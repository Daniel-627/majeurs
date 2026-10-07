import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram";
import { scheduleTimeoutCheck } from "@/lib/qstash";
import { cleanText, getClientIp, hashIp, isUuid } from "@/lib/security";
import { site } from "@/lib/site";

const MAX_BODY = 1000;
const MAX_PER_MINUTE = 8; // per conversation
const MAX_PER_HOUR = 60; // per conversation
const MAX_NEW_CHATS_PER_IP_PER_HOUR = 5;
const MAX_NEW_CHATS_PER_10_MIN = 30; // across everyone — flood brake

const TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:\d{2})$/;
const MESSAGE_COLUMNS = "id, conversation_id, sender, body, created_at";

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

// The database is locked to staff, so visitors read their own chat through
// here. The conversation's UUID is the "key" — unguessable, and only the
// visitor's browser has it.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const after = searchParams.get("after");

  if (!isUuid(conversationId)) return fail("Invalid conversationId", 400);
  if (after && !TIMESTAMP_RE.test(after)) return fail("Invalid cursor", 400);

  const supabase = createAdminClient();
  let query = supabase
    .from("messages")
    .select(MESSAGE_COLUMNS)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (after) query = query.gt("created_at", after);

  const { data, error } = await query;
  if (error) return fail("Could not load messages", 500);

  return NextResponse.json(
    { messages: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return fail("Invalid request", 400);
  }

  const text = cleanText(payload.body, MAX_BODY + 1);
  if (!text) return fail("Message can't be empty", 400);
  if (text.length > MAX_BODY) {
    return fail(`Message is too long (max ${MAX_BODY} characters)`, 400);
  }

  const supabase = createAdminClient();
  const ipHash = hashIp(getClientIp(req));
  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();

  // Does the conversation the browser remembers still exist?
  let convoId: string | null = null;
  let visitorName: string | null = null;
  let visitorPhone: string | null = null;
  let visitorEmail: string | null = null;

  if (isUuid(payload.conversationId)) {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id, visitor_name, visitor_phone, visitor_email")
      .eq("id", payload.conversationId)
      .maybeSingle();

    if (existing) {
      convoId = existing.id as string;
      visitorName = existing.visitor_name;
      visitorPhone = existing.visitor_phone;
      visitorEmail = existing.visitor_email;
    }
    // If it's gone (stale id from an old session), fall through and start fresh.
  }

  let isNewConversation = false;

  if (!convoId) {
    // --- Flood guards for NEW conversations -------------------------------
    const tenMinAgo = new Date(now - 10 * 60 * 1000).toISOString();
    const [perIp, everyone] = await Promise.all([
      supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", hourAgo),
      supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .gte("created_at", tenMinAgo),
    ]);

    if ((perIp.count ?? 0) >= MAX_NEW_CHATS_PER_IP_PER_HOUR) {
      return fail(
        `You've started several chats recently. Please call us on ${site.phone} instead.`,
        429
      );
    }
    if ((everyone.count ?? 0) >= MAX_NEW_CHATS_PER_10_MIN) {
      return fail(
        `We're getting a lot of messages right now. Please call us on ${site.phone}.`,
        429
      );
    }

    // --- Optional details from the intro form -----------------------------
    visitorName = cleanText(payload.visitorName, 100);
    const contact = cleanText(payload.visitorContact, 120);
    if (contact) {
      if (contact.includes("@")) visitorEmail = contact;
      else visitorPhone = contact.slice(0, 30);
    }

    const { data: created, error: createError } = await supabase
      .from("conversations")
      .insert({
        visitor_name: visitorName,
        visitor_phone: visitorPhone,
        visitor_email: visitorEmail,
        ip_hash: ipHash,
      })
      .select("id")
      .single();

    if (createError || !created) return fail("Could not start the chat", 500);
    convoId = created.id as string;
    isNewConversation = true;
  } else {
    // --- Per-conversation rate limits ---------------------------------------
    const { data: recent } = await supabase
      .from("messages")
      .select("created_at")
      .eq("conversation_id", convoId)
      .eq("sender", "visitor")
      .gte("created_at", hourAgo)
      .limit(MAX_PER_HOUR + 1);

    const rows = recent ?? [];
    if (rows.length >= MAX_PER_HOUR) {
      return fail(
        `That's a lot of messages. Please call us on ${site.phone} for anything urgent.`,
        429
      );
    }
    const minuteAgo = now - 60 * 1000;
    const lastMinute = rows.filter(
      (r) => new Date(r.created_at).getTime() > minuteAgo
    ).length;
    if (lastMinute >= MAX_PER_MINUTE) {
      return fail("You're sending messages very quickly — please wait a moment.", 429);
    }
  }

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({ conversation_id: convoId, sender: "visitor", body: text })
    .select(MESSAGE_COLUMNS)
    .single();

  if (messageError || !message) return fail("Could not send your message", 500);

  const who = [visitorName, visitorPhone, visitorEmail].filter(Boolean).join(" · ");
  await sendTelegramMessage(
    `💬 ${isNewConversation ? "New chat" : "New message"}\n` +
      `${who ? who + "\n" : ""}` +
      `"${text}"\n\n` +
      `Reply: ${site.url}/inbox`
  );

  // One timer per conversation, started on its first message.
  if (isNewConversation) {
    await scheduleTimeoutCheck(convoId);
  }

  return NextResponse.json({ conversationId: convoId, message });
}