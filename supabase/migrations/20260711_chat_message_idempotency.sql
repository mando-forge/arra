-- Ensure PostgREST can resolve the chatbot's ON CONFLICT target. PostgreSQL
-- unique indexes still allow multiple legacy rows where client_message_id is null.
alter table chat_messages
  add column if not exists client_message_id text,
  add column if not exists ip_address text;

drop index if exists chat_messages_client_message_key;

create unique index concurrently chat_messages_client_message_key
  on chat_messages (conversation_id, client_message_id);
