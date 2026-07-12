-- Remove an unused anonymous write surface and avoid evaluating the public
-- published-post policy for authenticated administrators.

drop policy if exists "Enable insert for all users" on public.subscribers;
revoke insert on table public.subscribers from public, anon, authenticated;

drop policy if exists "Enable select for published posts" on public.posts;
create policy "Anonymous visitors can read published posts"
on public.posts
for select
to anon
using (status = 'published');
