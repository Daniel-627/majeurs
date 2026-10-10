-- STEP 2 of 2 — run this AFTER the new code is deployed and chat still works.
--
-- Removes ALL public database access. From here on, visitors can only talk
-- to the database through your API routes (which use the secret key and
-- enforce the rate limits). Anyone who copies the publishable key out of the
-- website can no longer read chats or insert rows directly.
--
-- If you run this BEFORE deploying, the old chat widget stops working.

drop policy if exists "Public can read conversations"   on conversations;
drop policy if exists "Public can insert conversations" on conversations;
drop policy if exists "Public can read messages"        on messages;
drop policy if exists "Public can insert messages"      on messages;
drop policy if exists "Public can insert leads"         on leads;

-- Staff (logged-in users) keep full access to what the inbox needs.
-- "Staff can update conversations", "Staff can read leads" and
-- "Staff can update leads" already exist from the earlier migrations.
drop policy if exists "Staff can read conversations" on conversations;
drop policy if exists "Staff can read messages"      on messages;
drop policy if exists "Staff can insert messages"    on messages;

create policy "Staff can read conversations" on conversations
  for select using (auth.role() = 'authenticated');

create policy "Staff can read messages" on messages
  for select using (auth.role() = 'authenticated');

create policy "Staff can insert messages" on messages
  for insert with check (auth.role() = 'authenticated');
