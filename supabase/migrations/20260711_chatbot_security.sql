-- Move private chatbot data behind Edge Functions and make admin authorization explicit.

-- Preserve existing history if earlier browser-side creation raced and produced
-- more than one conversation for the same session.
with ranked_conversations as (
  select
    id,
    first_value(id) over (partition by session_id order by created_at, id) as canonical_id,
    row_number() over (partition by session_id order by created_at, id) as position
  from chat_conversations
)
update chat_messages as message
set conversation_id = ranked.canonical_id
from ranked_conversations as ranked
where message.conversation_id = ranked.id
  and ranked.position > 1;

with ranked_conversations as (
  select
    id,
    row_number() over (partition by session_id order by created_at, id) as position
  from chat_conversations
)
delete from chat_conversations as conversation
using ranked_conversations as ranked
where conversation.id = ranked.id
  and ranked.position > 1;

alter table chat_conversations
  add constraint chat_conversations_session_id_key unique (session_id);

alter table chat_messages
  add column if not exists client_message_id text;

create unique index if not exists chat_messages_client_message_key
  on chat_messages (conversation_id, client_message_id);

create index if not exists chat_messages_conversation_created_idx
  on chat_messages (conversation_id, created_at);

create index if not exists posts_author_id_idx
  on posts (author_id);

create index if not exists knowledge_base_embedding_hnsw_idx
  on knowledge_base using hnsw (embedding vector_cosine_ops);

drop policy if exists "Enable insert for all users" on chat_conversations;
drop policy if exists "Enable select for all users" on chat_conversations;
drop policy if exists "Enable insert for all users" on chat_messages;
drop policy if exists "Enable select for all users" on chat_messages;
drop policy if exists "Enable select for all users" on knowledge_base;
drop policy if exists "Enable all access for admins" on knowledge_base;
drop policy if exists "Enable select for admins only" on contact_submissions;
drop policy if exists "Enable all access for admins" on posts;
drop policy if exists "Enable select for admins only" on subscribers;

create policy "Admins can read contact submissions"
  on contact_submissions for select to authenticated
  using ((((select auth.jwt())) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can manage posts"
  on posts for all to authenticated
  using ((((select auth.jwt())) -> 'app_metadata' ->> 'role') = 'admin')
  with check ((((select auth.jwt())) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can read subscribers"
  on subscribers for select to authenticated
  using ((((select auth.jwt())) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can manage knowledge"
  on knowledge_base for all to authenticated
  using ((((select auth.jwt())) -> 'app_metadata' ->> 'role') = 'admin')
  with check ((((select auth.jwt())) -> 'app_metadata' ->> 'role') = 'admin');

revoke all on function match_documents(vector, float, int) from public, anon, authenticated;
grant execute on function match_documents(vector, float, int) to service_role;
alter function match_documents(vector, float, int) set search_path = public;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;
