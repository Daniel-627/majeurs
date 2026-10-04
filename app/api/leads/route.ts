import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  const { name, organization, email, phone, serviceInterest, message } =
    await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name,
    organization: organization || null,
    email,
    phone: phone || null,
    service_interest: serviceInterest || null,
    message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendTelegramMessage(
    `📋 *New consultation request*\n` +
      `${name}${organization ? " — " + organization : ""}\n` +
      `${email}${phone ? " · " + phone : ""}\n` +
      `Interested in: ${serviceInterest ?? "Not specified"}\n` +
      `${message ? `"${message}"` : ""}`
  );

  return NextResponse.json({ success: true });
}