-- Run this in Supabase: SQL Editor → New Query → paste → Run

create type conversation_status as enum ('open', 'answered', 'timed_out');
create type message_sender as enum ('visitor', 'staff', 'system');

create table conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  visitor_email text,
  status conversation_status not null default 'open',
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender message_sender not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table conversations enable row level security;
alter table messages enable row level security;

-- MVP policies: a conversation's UUID is unguessable and acts as the
-- shared secret for now. Tighten once staff auth (Phase 3) is wired up
-- — e.g. restrict staff-only actions to auth.role() = 'authenticated'.
create policy "Public can read conversations" on conversations
  for select using (true);

create policy "Public can insert conversations" on conversations
  for insert with check (true);

create policy "Public can read messages" on messages
  for select using (true);

create policy "Public can insert messages" on messages
  for insert with check (true);

create policy "Staff can update conversations" on conversations
  for update using (auth.role() = 'authenticated');
