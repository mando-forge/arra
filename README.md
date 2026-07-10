# ARRA

[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/mando-forge/arra?utm_source=oss&utm_medium=github&utm_campaign=mando-forge%2Farra&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)](https://coderabbit.ai)

ARRA is a Vite, React, and TypeScript site for a technology research company grounded in Northeast India. It includes the public site, a Supabase-backed contact flow, an admin-only knowledge ingestion surface, and a retrieval-augmented AI guide.

## Local development

Requirements: Node.js 20.18.1 or newer and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`. Browser variables are public; never put the OpenRouter or Supabase service-role keys in a `VITE_` variable.

## Supabase and chatbot setup

Apply the migrations in `supabase/migrations`, then deploy both Edge Functions:

```bash
supabase db push
supabase functions deploy chat
supabase functions deploy ingest-knowledge
```

Configure these Edge Function secrets in Supabase:

- `OPENROUTER_API_KEY`
- `ALLOWED_ORIGINS` as a comma-separated list of production origins
- `CHAT_MODEL` (optional; defaults to `nvidia/nemotron-3-ultra-550b-a55b:free`)
- `CHAT_FALLBACK_MODEL` (optional; defaults to `openai/gpt-oss-120b:free`)

Supabase supplies `SUPABASE_URL` and `SUPABASE_SECRET_KEYS` to deployed Edge Functions; the code also supports the legacy `SUPABASE_SERVICE_ROLE_KEY`. Admin accounts must have `app_metadata.role` set to `admin`; user-editable metadata is not used for authorization.

The chatbot stores conversations and performs vector retrieval only inside the `chat` Edge Function. Anonymous browser clients must not receive direct policies for `chat_conversations`, `chat_messages`, or `knowledge_base`.

## Verification

```bash
pnpm test:all
pnpm audit --prod
```

`test:all` runs lint, TypeScript checks, the Storybook browser tests, and the production/PWA build.

## Code Review

This repository has automated Code Review enabled via **CodeRabbit** and **Macroscope**.

- **Macroscope**: All PRs have code review enabled by default. You can manually trigger a Macroscope review on any Pull Request by commenting:
  ```text
  @macroscope-app review
  ```
- **CodeRabbit**: Automatically reviews all Pull Requests.
