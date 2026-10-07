import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. Uses the Supabase *secret* key, which bypasses Row Level
// Security. Only import this from API routes / server code — never from a
// "use client" file, and never prefix the env var with NEXT_PUBLIC_.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY environment variable"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
