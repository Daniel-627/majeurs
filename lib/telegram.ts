// Plain text on purpose. The old version used Markdown, and Telegram rejects
// the whole message if a visitor's text contains an unbalanced _ * or `.
export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram env vars missing — skipping notification");
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000),
        link_preview_options: { is_disabled: true },
      }),
    });

    // Don't fail silently — a rejected alert should show up in Vercel logs.
    if (!res.ok) {
      console.error("Telegram rejected the message:", res.status, await res.text());
    }
  } catch (err) {
    // A failed notification must never break the visitor's request.
    console.error("Telegram notify failed:", err);
  }
}
