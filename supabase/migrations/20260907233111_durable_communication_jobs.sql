-- Add only the missing communication persistence. Existing operational tables are untouched.
create table public.background_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('support_email', 'support_triage')),
  dedupe_key text not null,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_until timestamptz,
  lease_token uuid,
  last_error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (kind, dedupe_key)
);
create index background_jobs_claim_idx on public.background_jobs(status, available_at, created_at);

create table public.email_notifications (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete set null,
  recipient_email text not null,
  template_name text not null,
  subject text not null,
  body_html text,
  body_text text,
  status text not null check (status in ('sent', 'failed')),
  provider_message_id text,
  sent_at timestamptz not null default now()
);
create index email_notifications_ticket_idx on public.email_notifications(ticket_id, sent_at desc);

create table public.dead_letter_queue (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  payload jsonb,
  error text,
  retry_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.background_jobs enable row level security;
alter table public.email_notifications enable row level security;
alter table public.dead_letter_queue enable row level security;
revoke all on public.background_jobs, public.email_notifications, public.dead_letter_queue from public, anon, authenticated;
grant all on public.background_jobs, public.email_notifications, public.dead_letter_queue to service_role;
comment on table public.background_jobs is 'Server-only leased work queue. No client Data API access. Provider acceptance must be recorded before completion.';
