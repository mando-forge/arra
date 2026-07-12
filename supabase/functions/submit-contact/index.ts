// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- Supabase Edge Functions are type-checked by Deno during deployment.
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.110.1"

const allowedIntents = new Set([
  "General conversation",
  "Potential collaboration",
  "Founder introduction",
  "Long-term supporter",
])

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  }
}

function json(origin: string, status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  })
}

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") ?? ""
  const configuredOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  const defaultOrigins = [
    "https://arra.tech",
    "https://www.arra.tech",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]
  const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])]
  const responseOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

  if (!origin || !allowedOrigins.includes(origin)) {
    return json(responseOrigin, 403, { error: "Request origin is not allowed." })
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(responseOrigin) })
  }

  if (request.method !== "POST") {
    return json(responseOrigin, 405, { error: "Method not allowed." })
  }

  try {
    const body = await request.json()
    const name = normalize(body.name)
    const email = normalize(body.email).toLowerCase()
    const intent = normalize(body.intent)
    const message = normalize(body.message)
    const website = normalize(body.website)

    if (website) {
      return json(responseOrigin, 202, { ok: true })
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (
      name.length < 2 || name.length > 120 ||
      !validEmail || email.length > 254 ||
      !allowedIntents.has(intent) ||
      message.length < 10 || message.length > 5000
    ) {
      return json(responseOrigin, 400, { error: "Please review the form fields and try again." })
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (!supabaseUrl || !serviceRoleKey) {
      return json(responseOrigin, 503, { error: "Contact intake is temporarily unavailable." })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await admin
      .from("contact_submissions")
      .insert({ name, email, intent, message })
      .select("id")
      .single()

    if (error) throw error

    return json(responseOrigin, 201, {
      ok: true,
      reference: `ARRA-${String(data.id).replaceAll("-", "").slice(0, 8).toUpperCase()}`,
    })
  } catch (error) {
    console.error("Contact intake failed", error)
    return json(responseOrigin, 500, { error: "We could not receive your message. Please try again shortly." })
  }
})
