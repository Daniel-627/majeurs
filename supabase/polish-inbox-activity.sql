-- Run once in the Supabase SQL Editor — BEFORE deploying the new inbox code.
-- Safe to re-run. Supabase will show its "destructive operations" warning
-- again (because of the `drop trigger` and `update` lines) — that's expected;
-- nothing here deletes your data.

-- 1. Three columns that describe each conversation's latest message
alter table conversations add column if not exists last_message_at timestamptz not null default now();
alter table conversations add column if not exists last_sender text;
alter table conversations add column if not exists last_message_preview text;

-- 2. Fill them in for conversations that already exist
update conversations c
set last_message_at      = m.created_at,
    last_sender          = m.sender::text,
    last_message_preview = left(m.body, 80)
from (
  select distinct on (conversation_id) conversation_id, created_at, sender, body
  from messages
  order by conversation_id, created_at desc
) m
where m.conversation_id = c.id;

-- 3. From now on, every new message updates its conversation automatically —
--    whether it came from a visitor, from you, or from the 5-minute fallback.
create or replace function bump_conversation_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update conversations
  set last_message_at      = new.created_at,
      last_sender          = new.sender::text,
      last_message_preview = left(new.body, 80)
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_bump_activity on messages;
create trigger messages_bump_activity
after insert on messages
for each row execute function bump_conversation_activity();

create index if not exists conversations_last_message_idx
  on conversations (last_message_at desc);
