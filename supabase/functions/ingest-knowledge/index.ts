// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- Supabase Edge Functions are type-checked by Deno during deployment.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.110.1"

const configuredOrigins = () =>
  (Deno.env.get("ALLOWED_ORIGINS") ?? Deno.env.get("SITE_URL") ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

const corsHeaders = (req: Request) => ({
  'Access-Control-Allow-Origin': configuredOrigins().includes(req.headers.get("origin") ?? "")
    ? req.headers.get("origin")!
    : configuredOrigins()[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
})

function splitIntoChunks(content: string, maxLength = 1_500, overlap = 200) {
  const paragraphs = content.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
  const chunks: string[] = []
  let current = ""

  for (const paragraph of paragraphs) {
    const candidates = paragraph.length > maxLength
      ? paragraph.match(new RegExp(`.{1,${maxLength}}(?:\\s|$)`, "gs")) ?? [paragraph]
      : [paragraph]

    for (const candidate of candidates) {
      if (current && `${current}\n\n${candidate}`.length > maxLength) {
        chunks.push(current)
        current = `${current.slice(-overlap)} ${candidate}`.trim()
      } else {
        current = current ? `${current}\n\n${candidate}` : candidate
      }
    }
  }

  if (current) chunks.push(current)
  return chunks
}

function getSupabaseAdminKey() {
  const legacyKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacyKey) return legacyKey

  try {
    const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')
    return secretKeys.default ?? Object.values(secretKeys)[0]
  } catch {
    return undefined
  }
}

class IngestionError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    })
  }
  
  try {
    const origin = req.headers.get('origin')
    if (origin && !configuredOrigins().includes(origin)) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      })
    }

    const authorization = req.headers.get('authorization')
    const token = authorization?.replace(/^Bearer\s+/i, '')
    if (!token) throw new IngestionError('UNAUTHORIZED', 'Your admin session is missing. Sign in again.', 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = getSupabaseAdminKey() ?? ''
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || user?.app_metadata?.role !== 'admin') {
      throw new IngestionError('FORBIDDEN', 'An administrator account is required.', 403)
    }

    const body = (await req.json().catch(() => {
      throw new IngestionError('INVALID_DOCUMENT', 'Add a title and source content before ingesting.')
    })) as { title?: unknown; content?: unknown }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new IngestionError('INVALID_DOCUMENT', 'Add a title and source content before ingesting.')
    }

    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content.trim() : ''
    if (!title || !content || title.length > 200 || content.length > 100_000) {
      throw new IngestionError('INVALID_DOCUMENT', 'Add a title and source content before ingesting.')
    }

    const chunks = splitIntoChunks(content)

    const { count: existingChunkCount, error: existingError } = await supabaseClient
      .from('knowledge_base')
      .select('id', { count: 'exact', head: true })
      .contains('metadata', { source_title: title })
    if (existingError) throw existingError

    // Prepend the document title to each chunk so the embedding captures
    // the full semantic context (critical for short documents).
    const embeddingInputs = chunks.map((chunk) => `${title}\n\n${chunk}`)
    const embeddingsByIndex = new Map<number, number[]>()
    let embeddingWarning: string | null = null
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY')

    if (!openRouterKey) {
      embeddingWarning = 'Vector generation is temporarily unavailable; keyword search remains active.'
    } else {
      try {
        const embeddingRes = await fetch('https://openrouter.ai/api/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/text-embedding-3-small',
            input: embeddingInputs,
            dimensions: 1_536,
            provider: { allow_fallbacks: true },
          }),
          signal: AbortSignal.timeout(8000),
        })

        if (!embeddingRes.ok) {
          embeddingWarning = `Vector generation is temporarily unavailable (provider ${embeddingRes.status}); keyword search remains active.`
        } else {
          const embeddingData = await embeddingRes.json()
          if (!Array.isArray(embeddingData.data)) {
            embeddingWarning = 'Vector generation returned an invalid response; keyword search remains active.'
          } else {
            for (const [position, item] of embeddingData.data.entries()) {
              const index = typeof item.index === 'number' ? item.index : position
              if (Array.isArray(item.embedding) && item.embedding.length === 1_536) {
                embeddingsByIndex.set(index, item.embedding)
              }
            }
            if (embeddingsByIndex.size !== chunks.length) {
              embeddingsByIndex.clear()
              embeddingWarning = 'Vector generation returned incomplete data; keyword search remains active.'
            }
          }
        }
      } catch {
        embeddingWarning = 'Vector generation could not be reached; keyword search remains active.'
      }
    }

    const embedded = embeddingsByIndex.size === chunks.length
    if (!embedded && (existingChunkCount ?? 0) > 0) {
      throw new IngestionError(
        'EMBEDDING_UNAVAILABLE',
        'The existing source was kept unchanged because vector regeneration is temporarily unavailable.',
        503,
      )
    }

    const rows = chunks.map((chunk, index) => ({
      title: chunks.length === 1 ? title : `${title} (Part ${index + 1})`,
      content: chunk,
      embedding: embeddingsByIndex.get(index) ?? null,
      metadata: {
        source_title: title,
        chunk_index: index,
        embedding_status: embedded ? 'complete' : 'pending',
      },
    }))

    const { data: inserted, error: insertError } = await supabaseClient.from('knowledge_base').insert(rows).select('id')
    if (insertError) throw insertError
    
    const newIds = inserted?.map(r => r.id).join(',')
    let deleteError: unknown;
    if (newIds) {
      const { error } = await supabaseClient.from('knowledge_base').delete().contains('metadata', { source_title: title }).not('id', 'in', `(${newIds})`)
      deleteError = error;
    } else {
      const { error } = await supabaseClient.from('knowledge_base').delete().contains('metadata', { source_title: title })
      deleteError = error;
    }
    if (deleteError) throw deleteError;
    
    return new Response(JSON.stringify({
      success: true,
      title,
      chunks: rows.length,
      embedded,
      warning: embeddingWarning,
    }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Knowledge ingestion failed', error)
    const knownError = error instanceof IngestionError ? error : null
    return new Response(JSON.stringify({
      error: knownError?.message ?? 'Knowledge ingestion failed. Please try again.',
      code: knownError?.code ?? 'INGESTION_FAILED',
    }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      status: knownError?.status ?? 500,
    })
  }
})
