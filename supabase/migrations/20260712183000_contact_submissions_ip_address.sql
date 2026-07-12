-- Add ip_address column and index to contact_submissions for rate limiting
alter table contact_submissions
  add column if not exists ip_address text;

create index if not exists contact_submissions_ip_address_created_idx
  on contact_submissions (ip_address, created_at);
