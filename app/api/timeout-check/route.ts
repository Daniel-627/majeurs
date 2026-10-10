import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/security";

const FALLBACK_MESSAGE =
  "Sorry, we're not at a screen right now — call us directly and we'll pick up.";

// Built lazily so a missing env var can't crash the build.
function getReceiver() {
  return new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY ?? "",
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY ?? "",
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  // Confirms the request genuinely came from QStash, not someone calling
  // this endpoint directly.
  const valid = await getReceiver()
    .verify({ signature, body })
    .catch(() => false);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let conversationId: unknown;
  try {
    conversationId = JSON.parse(body).conversationId;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!isUuid(conversationId)) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  // This route has no logged-in user, so it uses the secret-key client.
  const supabase = createAdminClient();

  // Did a human reply? Checking the messages themselves is sturdier than
  // trusting the status column alone.
  const { data: staffReply } = await supabase
    .from("messages")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("sender", "staff")
    .limit(1);
  if (staffReply && staffReply.length > 0) {
    return NextResponse.json({ skipped: "already answered" });
  }

  // Claim the timeout atomically: only one run can flip open → timed_out.
  // If QStash retries this request, the second run finds nothing to claim,
  // so the visitor never gets the fallback message twice.
  const { data: claimed, error: claimError } = await supabase
    .from("conversations")
    .update({ status: "timed_out" })
    .eq("id", conversationId)
    .eq("status", "open")
    .select("id");

  if (claimError) {
    return NextResponse.json({ error: claimError.message }, { status: 500 });
  }
  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ skipped: "not open" });
  }

  const { error: insertError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender: "system",
    body: FALLBACK_MESSAGE,
  });

  if (insertError) {
    // Undo the claim so QStash's retry can try again.
    await supabase
      .from("conversations")
      .update({ status: "open" })
      .eq("id", conversationId)
      .eq("status", "timed_out");
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
