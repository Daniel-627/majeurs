import { Client } from "@upstash/qstash";

// Built lazily so a missing env var can't crash the build.
function getClient() {
  const token = process.env.QSTASH_TOKEN;
  if (!token) return null;

  return new Client({
    token,
    // Your QStash lives in the EU region. Without this, the SDK talks to the
    // default endpoint, your EU token is rejected, and the 5-minute timer
    // silently never gets scheduled.
    ...(process.env.QSTASH_URL ? { baseUrl: process.env.QSTASH_URL } : {}),
  });
}

// Schedules a check 5 minutes from now. The timeout-check route decides
// whether staff replied in time — this only guarantees the check happens.
export async function scheduleTimeoutCheck(conversationId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const client = getClient();

  if (!siteUrl || !client) {
    console.warn(
      "Timeout check NOT scheduled — set NEXT_PUBLIC_SITE_URL and QSTASH_TOKEN"
    );
    return;
  }

  try {
    await client.publishJSON({
      url: `${siteUrl.replace(/\/$/, "")}/api/timeout-check`,
      body: { conversationId },
      delay: "5m",
    });
  } catch (err) {
    console.error("Failed to schedule timeout check:", err);
  }
}
