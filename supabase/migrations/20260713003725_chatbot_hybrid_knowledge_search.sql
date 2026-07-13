-- Give the private chatbot a deterministic keyword fallback when semantic
-- embedding generation is unavailable or a short query misses the threshold.
-- The function stays service-role only so raw knowledge never becomes public.

create index if not exists knowledge_base_search_idx
  on public.knowledge_base
  using gin (
    to_tsvector(
      'english',
      coalesce(nullif(metadata ->> 'source_title', ''), title, '') || ' ' || coalesce(content, '')
    )
  );

create or replace function public.search_knowledge_documents(
  search_query text,
  requested_count integer default 5
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language sql
stable
set search_path = public, extensions
as $$
  with query as (
    select websearch_to_tsquery('english', nullif(trim(search_query), '')) as value
  )
  select
    kb.id,
    kb.title,
    kb.content,
    ts_rank_cd(
      to_tsvector(
        'english',
        coalesce(nullif(kb.metadata ->> 'source_title', ''), kb.title, '') || ' ' || coalesce(kb.content, '')
      ),
      query.value
    )::float as similarity
  from public.knowledge_base as kb
  cross join query
  where query.value is not null
    and to_tsvector(
      'english',
      coalesce(nullif(kb.metadata ->> 'source_title', ''), kb.title, '') || ' ' || coalesce(kb.content, '')
    ) @@ query.value
  order by similarity desc, kb.created_at desc
  limit least(greatest(requested_count, 1), 20);
$$;

revoke all on function public.search_knowledge_documents(text, integer)
  from public, anon, authenticated;
grant execute on function public.search_knowledge_documents(text, integer)
  to service_role;
