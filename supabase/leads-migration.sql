-- Run this in Supabase: SQL Editor → New Query → paste → Run

create type lead_status as enum ('new', 'contacted', 'closed');

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  email text not null,
  phone text,
  service_interest text,
  message text,
  status lead_status not null default 'new',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- Visitors can submit the form, but can't read leads back —
-- unlike chat, there's no reason the public needs to see this data.
create policy "Public can insert leads" on leads
  for insert with check (true);

create policy "Staff can read leads" on leads
  for select using (auth.role() = 'authenticated');

create policy "Staff can update leads" on leads
  for update using (auth.role() = 'authenticated');
