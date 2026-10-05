import { Client } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Schedules a check 5 minutes from now. The timeout-check route decides
// whether staff replied in time — this just guarantees the check happens.
export async function scheduleTimeoutCheck(conversationId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL not set — skipping timeout schedule");
    return;
  }

  try {
    await qstash.publishJSON({
      url: `${siteUrl}/api/timeout-check`,
      body: { conversationId },
      delay: "5m",
    });
  } catch (err) {
    console.error("Failed to schedule timeout check:", err);
  }
}