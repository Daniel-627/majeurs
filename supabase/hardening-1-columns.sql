-- STEP 1 of 2 — safe to run any time (only ADDS things, removes nothing).
-- Run this BEFORE deploying the new code.

alter table conversations add column if not exists visitor_phone text;
alter table conversations add column if not exists ip_hash text;
alter table leads         add column if not exists ip_hash text;

-- Indexes so the rate-limit lookups stay fast as data grows.
create index if not exists conversations_ip_created_idx on conversations (ip_hash, created_at);
create index if not exists leads_ip_created_idx         on leads (ip_hash, created_at);
create index if not exists messages_convo_created_idx   on messages (conversation_id, created_at);
