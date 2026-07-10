-- Ensure PostgREST can resolve the chatbot's ON CONFLICT target. PostgreSQL
-- unique indexes still allow multiple legacy rows where client_message_id is null.
drop index if exists chat_messages_client_message_key;

create unique index chat_messages_client_message_key
  on chat_messages (conversation_id, client_message_id);
