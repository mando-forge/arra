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
    if (!token) throw new Error('Unauthorized')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = getSupabaseAdminKey() ?? ''
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || user?.app_metadata?.role !== 'admin') throw new Error('Unauthorized')

    const body = await req.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content.trim() : ''
    if (!title || !content || title.length > 200 || content.length > 100_000) {
      throw new Error('Invalid document')
    }

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openRouterKey) throw new Error('Embedding service is not configured')

    const chunks = splitIntoChunks(content)
    
    // Get embeddings from OpenRouter (OpenAI)
    const embeddingRes = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: chunks
      })
    })
    
    if (!embeddingRes.ok) throw new Error('Embedding request failed')
    const embeddingData = await embeddingRes.json()

    if (!embeddingData.data) {
      throw new Error('Embedding response was invalid')
    }

    const rows = chunks.map((chunk, index) => ({
      title: chunks.length === 1 ? title : `${title} (Part ${index + 1})`,
      content: chunk,
      embedding: embeddingData.data[index].embedding,
      metadata: { source_title: title, chunk_index: index },
    }))
    if (rows.some((row) => !Array.isArray(row.embedding))) throw new Error('Embedding response was incomplete')

    const { data: inserted, error: insertError } = await supabaseClient.from('knowledge_base').insert(rows).select('id')
    if (insertError) throw insertError
    
    const newIds = inserted?.map(r => r.id).join(',')
    if (newIds) {
      await supabaseClient.from('knowledge_base').delete().contains('metadata', { source_title: title }).not('id', 'in', `(${newIds})`)
    } else {
      await supabaseClient.from('knowledge_base').delete().contains('metadata', { source_title: title })
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Knowledge ingestion failed', error)
    const unauthorized = error instanceof Error && error.message === 'Unauthorized'
    return new Response(JSON.stringify({ error: unauthorized ? 'Unauthorized' : 'Knowledge ingestion failed' }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      status: unauthorized ? 403 : 400,
    })
  }
})
