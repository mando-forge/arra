-- Replace the owner-run view with a dedicated read-only directory table.
-- Anonymous visitors can read this aggregate, while private knowledge chunks
-- remain protected by their existing RLS policies.
drop view if exists public.public_knowledge_directory;

create table public.public_knowledge_directory (
  title text primary key,
  chunks bigint not null check (chunks > 0),
  created_at timestamptz not null
);

alter table public.public_knowledge_directory enable row level security;

revoke all on public.public_knowledge_directory from public, anon, authenticated;
grant select on public.public_knowledge_directory to anon, authenticated;

create policy "Visitors can read the public knowledge directory"
on public.public_knowledge_directory
for select
to anon, authenticated
using (true);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.refresh_public_knowledge_directory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.public_knowledge_directory;

  insert into public.public_knowledge_directory (title, chunks, created_at)
  select
    coalesce(nullif(metadata ->> 'source_title', ''), title) as title,
    count(*)::bigint as chunks,
    min(created_at) as created_at
  from public.knowledge_base
  group by coalesce(nullif(metadata ->> 'source_title', ''), title);

  return null;
end;
$$;

revoke all on function private.refresh_public_knowledge_directory()
from public, anon, authenticated;

create trigger refresh_public_knowledge_directory
after insert or update or delete or truncate
on public.knowledge_base
for each statement
execute function private.refresh_public_knowledge_directory();

insert into public.public_knowledge_directory (title, chunks, created_at)
select
  coalesce(nullif(metadata ->> 'source_title', ''), title) as title,
  count(*)::bigint as chunks,
  min(created_at) as created_at
from public.knowledge_base
group by coalesce(nullif(metadata ->> 'source_title', ''), title);

comment on table public.public_knowledge_directory is
  'Read-only aggregate directory for the public ARRA Explorations map.';
