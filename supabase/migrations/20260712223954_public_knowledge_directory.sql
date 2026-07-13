-- Expose only the aggregate fields required by the public Explorations map.
-- The view intentionally runs as its owner so anonymous visitors can read the
-- directory while the underlying knowledge chunks remain protected by RLS.
create or replace view public.public_knowledge_directory
with (security_barrier = true)
as
select
  coalesce(nullif(metadata ->> 'source_title', ''), title) as title,
  count(*)::bigint as chunks,
  min(created_at) as created_at
from public.knowledge_base
group by coalesce(nullif(metadata ->> 'source_title', ''), title);

alter view public.public_knowledge_directory owner to postgres;

revoke all on public.public_knowledge_directory from public, anon, authenticated;
grant select on public.public_knowledge_directory to anon, authenticated;

comment on view public.public_knowledge_directory is
  'Least-privilege aggregate directory for the public ARRA Explorations map.';
