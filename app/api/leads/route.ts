import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram";
import { cleanText, EMAIL_RE, getClientIp, hashIp } from "@/lib/security";

const MAX_LEADS_PER_IP_PER_HOUR = 3;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return fail("Invalid request", 400);
  }

  // Honeypot: real people never see this field, bots fill everything in.
  // Pretend it worked so the bot moves on, but store nothing.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const name = cleanText(payload.name, 100);
  const email = cleanText(payload.email, 254);
  if (!name || !email || !EMAIL_RE.test(email)) {
    return fail("Please enter your name and a valid email address.", 400);
  }

  const organization = cleanText(payload.organization, 150);
  const phone = cleanText(payload.phone, 30);
  const serviceInterest = cleanText(payload.serviceInterest, 100);
  const message = cleanText(payload.message, 2000);

  const supabase = createAdminClient();
  const ipHash = hashIp(getClientIp(req));
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", hourAgo);

  if ((count ?? 0) >= MAX_LEADS_PER_IP_PER_HOUR) {
    return fail(
      "We've already received a few requests from you — we'll be in touch shortly.",
      429
    );
  }

  const { error } = await supabase.from("leads").insert({
    name,
    organization,
    email,
    phone,
    service_interest: serviceInterest,
    message,
    ip_hash: ipHash,
  });

  if (error) return fail("Something went wrong — please try again.", 500);

  await sendTelegramMessage(
    `📋 New consultation request\n` +
      `${name}${organization ? " — " + organization : ""}\n` +
      `${email}${phone ? " · " + phone : ""}\n` +
      `Interested in: ${serviceInterest ?? "Not specified"}\n` +
      `${message ? `"${message}"` : ""}`
  );

  return NextResponse.json({ success: true });
}
