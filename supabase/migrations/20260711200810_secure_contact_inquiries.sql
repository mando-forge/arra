-- Route public contact intake through a validated Edge Function and give
-- authenticated administrators the permissions used by the inquiry workspace.

drop policy if exists "Enable insert for all users" on public.contact_submissions;

-- 1. Status default & updated_at column
alter table public.contact_submissions
  alter column status set default 'new',
  add column if not exists updated_at timestamptz not null default now();

-- Avoid blocking full-table scan for NOT NULL by adding NOT VALID check first
alter table public.contact_submissions
  add constraint contact_submissions_status_not_null_check
    check (status is not null) not valid;

alter table public.contact_submissions
  validate constraint contact_submissions_status_not_null_check;

alter table public.contact_submissions
  alter column status set not null;

-- 2. Add validation constraints with NOT VALID
alter table public.contact_submissions
  drop constraint if exists contact_submissions_status_check,
  add constraint contact_submissions_status_check
    check (status in ('new', 'read', 'archived')) not valid,
  drop constraint if exists contact_submissions_name_length_check,
  add constraint contact_submissions_name_length_check
    check (char_length(btrim(name)) between 2 and 120) not valid,
  drop constraint if exists contact_submissions_email_length_check,
  add constraint contact_submissions_email_length_check
    check (char_length(btrim(email)) between 3 and 254) not valid,
  drop constraint if exists contact_submissions_intent_check,
  add constraint contact_submissions_intent_check
    check (intent in ('General conversation', 'Potential collaboration', 'Founder introduction', 'Long-term supporter')) not valid,
  drop constraint if exists contact_submissions_message_length_check,
  add constraint contact_submissions_message_length_check
    check (char_length(btrim(message)) between 10 and 5000) not valid;

-- Validate constraints individually to avoid long lockups
alter table public.contact_submissions validate constraint contact_submissions_status_check;
alter table public.contact_submissions validate constraint contact_submissions_name_length_check;
alter table public.contact_submissions validate constraint contact_submissions_email_length_check;
alter table public.contact_submissions validate constraint contact_submissions_intent_check;
alter table public.contact_submissions validate constraint contact_submissions_message_length_check;

create or replace function public.set_contact_submission_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_contact_submission_updated_at on public.contact_submissions;
create trigger set_contact_submission_updated_at
before update on public.contact_submissions
for each row execute function public.set_contact_submission_updated_at();

revoke execute on function public.set_contact_submission_updated_at() from public, anon, authenticated;

drop policy if exists "Admins can update contact submissions" on public.contact_submissions;
create policy "Admins can update contact submissions"
on public.contact_submissions
for update
to authenticated
using ((((select auth.jwt()) -> 'app_metadata' ->> 'role')) = 'admin')
with check ((((select auth.jwt()) -> 'app_metadata' ->> 'role')) = 'admin');

drop policy if exists "Admins can delete contact submissions" on public.contact_submissions;
create policy "Admins can delete contact submissions"
on public.contact_submissions
for delete
to authenticated
using ((((select auth.jwt()) -> 'app_metadata' ->> 'role')) = 'admin');

revoke insert on table public.contact_submissions from public, anon, authenticated;
grant select, update, delete on table public.contact_submissions to authenticated;
grant insert on table public.contact_submissions to service_role;
