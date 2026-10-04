import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  const { conversationId, body, visitorName, visitorEmail } =
    await req.json();

  if (!body || typeof body !== "string") {
    return NextResponse.json({ error: "Message body is required" }, { status: 400 });
  }

  const supabase = await createClient();
  let convoId: string = conversationId;
  let isNewConversation = false;

  // First message in a new chat: create the conversation row first.
  if (!convoId) {
    const { data: conversation, error: convoError } = await supabase
      .from("conversations")
      .insert({
        visitor_name: visitorName ?? null,
        visitor_email: visitorEmail ?? null,
      })
      .select()
      .single();

    if (convoError || !conversation) {
      return NextResponse.json(
        { error: convoError?.message ?? "Could not start conversation" },
        { status: 500 }
      );
    }
    convoId = conversation.id;
    isNewConversation = true;
  }

  const { error: msgError } = await supabase.from("messages").insert({
    conversation_id: convoId,
    sender: "visitor",
    body,
  });

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  await sendTelegramMessage(
    `💬 *${isNewConversation ? "New chat" : "New message"}*\n` +
      `${visitorName ? visitorName + "\n" : ""}` +
      `"${body}"\n\n` +
      `Reply: ${siteUrl}/inbox`
  );

  // TODO (Phase 6): schedule a QStash job for +5 minutes that checks
  // whether this conversation has been replied to, and if not, inserts
  // a system message with the "Call us" fallback.

  return NextResponse.json({ conversationId: convoId });
}