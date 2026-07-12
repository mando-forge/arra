-- Create a public view to expose non-sensitive metadata from knowledge_base for public pages (e.g. Products/explorations page visualization)
create or replace view public.public_knowledge_base as
select id, title, metadata, created_at
from public.knowledge_base;

alter view public.public_knowledge_base owner to postgres;

grant select on public.public_knowledge_base to anon, authenticated;
