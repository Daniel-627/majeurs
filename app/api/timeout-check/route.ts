import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { createClient } from "@/lib/supabase/server";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

const FALLBACK_MESSAGE =
  "Sorry, we're not at a screen right now — call us directly and we'll pick up.";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  // Confirms this request genuinely came from QStash, not someone spoofing
  // a call to this endpoint.
  const isValid = await receiver.verify({ signature, body }).catch(() => false);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { conversationId } = JSON.parse(body);
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("status")
    .eq("id", conversationId)
    .single();

  // Already answered (or already timed out by a prior check) — nothing to do.
  if (!conversation || conversation.status !== "open") {
    return NextResponse.json({ skipped: true });
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender: "system",
    body: FALLBACK_MESSAGE,
  });

  await supabase
    .from("conversations")
    .update({ status: "timed_out" })
    .eq("id", conversationId);

  return NextResponse.json({ ok: true });
}