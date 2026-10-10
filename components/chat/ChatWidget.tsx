"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { Message } from "@/types";
import { site } from "@/lib/site";

const STORAGE_KEY = "majeurs_conversation_id";
const POLL_OPEN_MS = 4000; // panel open: look for replies every 4 seconds
const POLL_CLOSED_MS = 20000; // panel closed: slower, just to catch replies

// Merge server messages into what's on screen. Skips ones we already have,
// and swaps an optimistic "temp" bubble for its real twin instead of
// showing the same message twice.
function mergeMessages(prev: Message[], incoming: Message[]): Message[] {
  const next = [...prev];
  for (const m of incoming) {
    if (next.some((x) => x.id === m.id)) continue;
    const twin = next.findIndex(
      (x) =>
        x.id.startsWith("temp-") && x.sender === m.sender && x.body === m.body
    );
    if (twin !== -1) next[twin] = m;
    else next.push(m);
  }
  return next;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [newestId, setNewestId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [unread, setUnread] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorContact, setVisitorContact] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  // Timestamp of the newest message the SERVER has told us about. Only
  // advanced from server data (never from our optimistic bubbles), so a reply
  // that lands between two polls can't be skipped.
  const lastSeenRef = useRef<string | null>(null);

  // On mount: resume a previous conversation from this browser, if any.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Pushes every setState below past the current render — avoids
      // calling setState synchronously inside the effect body.
      await Promise.resolve();

      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        try {
          const res = await fetch(
            `/api/messages?conversationId=${encodeURIComponent(savedId)}`,
            { cache: "no-store" }
          );
          if (cancelled) return;

          if (res.ok) {
            const data: { messages: Message[] } = await res.json();
            if (data.messages.length > 0) {
              setConversationId(savedId);
              setMessages(data.messages);
              lastSeenRef.current =
                data.messages[data.messages.length - 1].created_at;
            } else {
              localStorage.removeItem(STORAGE_KEY);
            }
          } else if (res.status === 400) {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          // Offline — keep the saved id and try again next visit.
        }
      }

      if (!cancelled) setLoaded(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Look for staff / system replies. Open panel polls quickly, closed panel
  // slowly; paused entirely while the tab is hidden.
  useEffect(() => {
    if (!conversationId) return;
    const id: string = conversationId;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function tick() {
      if (!document.hidden) {
        try {
          const qs = new URLSearchParams({ conversationId: id });
          if (lastSeenRef.current) qs.set("after", lastSeenRef.current);

          const res = await fetch(`/api/messages?${qs}`, { cache: "no-store" });
          if (res.ok && !cancelled) {
            const data: { messages: Message[] } = await res.json();
            if (data.messages.length > 0 && !cancelled) {
              lastSeenRef.current =
                data.messages[data.messages.length - 1].created_at;
              setMessages((prev) => mergeMessages(prev, data.messages));

              const fromTeam = data.messages.filter((m) => m.sender !== "visitor");
              if (fromTeam.length > 0) {
                setNewestId(fromTeam[fromTeam.length - 1].id);
                setTimeout(() => setNewestId(null), 900);
                if (!open) setUnread(true);
              }
            }
          }
        } catch {
          // Network blip — we'll try again on the next tick.
        }
      }
      if (!cancelled) {
        timer = setTimeout(tick, open ? POLL_OPEN_MS : POLL_CLOSED_MS);
      }
    }

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [conversationId, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setNotice(null);
    const tempId = `temp-${Date.now()}`;

    // Show it immediately — don't wait on the network.
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversation_id: conversationId ?? "",
        sender: "visitor",
        body: text,
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          body: text,
          visitorName,
          visitorContact,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Send failed");

      const real: Message = data.message;
      // A different id than we sent means the server started a fresh chat
      // (first message, or the old one no longer exists).
      const isFresh = data.conversationId !== conversationId;
      if (isFresh) {
        setConversationId(data.conversationId);
        localStorage.setItem(STORAGE_KEY, data.conversationId);
        lastSeenRef.current = null;
      }

      setMessages((prev) => {
        const base = isFresh && conversationId ? prev.filter((m) => m.id === tempId) : prev;
        return base.some((m) => m.id === real.id)
          ? base.filter((m) => m.id !== tempId)
          : base.map((m) => (m.id === tempId ? real : m));
      });

      setNewestId(real.id);
      setTimeout(() => setNewestId(null), 900);
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, body: `${m.body} (failed to send)` } : m
        )
      );
      setNotice(err instanceof Error ? err.message : "Couldn't send — try again.");
    } finally {
      setSending(false);
    }
  }

  // Don't render until we know whether to resume a conversation — avoids a
  // flash of the empty-state intro.
  if (!loaded) return null;

  const isNewChat = !conversationId && messages.length === 0;

  return (
    <>
      <AnimatePresence>
      {!open && (
        <m.button
          key="launcher"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            setOpen(true);
            setUnread(false);
          }}
          className="fixed bottom-5 right-5 z-30 rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(18,104,232,0.55)]"
        >
          ✦ Ask Majeurs
          {unread && (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500" />
          )}
        </m.button>
      )}

      {open && (
        <m.div
          key="panel"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ transformOrigin: "bottom right" }}
          className="fixed bottom-5 right-5 z-30 flex h-[min(480px,calc(100vh-7rem))] w-[min(340px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-navy px-4 py-3.5">
            <span className="text-sm font-semibold text-white">Ask Majeurs</span>
            <button
              onClick={() => setOpen(false)}
              className="text-[#9FB4CC] hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {isNewChat && (
              <div>
                <p className="text-[13.5px] text-mute">
                  Hi, I&apos;m from Majeurs — how can I help?
                </p>
                <div className="mt-4 space-y-2">
                  <input
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Your name (optional)"
                    maxLength={100}
                    autoComplete="name"
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] outline-none focus:border-blue"
                  />
                  <input
                    value={visitorContact}
                    onChange={(e) => setVisitorContact(e.target.value)}
                    placeholder="Phone or email (optional)"
                    maxLength={120}
                    autoComplete="email"
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] outline-none focus:border-blue"
                  />
                  <p className="text-[11.5px] text-mute">
                    So we can reach you if you leave this page.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <m.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[13.5px] transition-shadow duration-700 ${
                  msg.sender === "visitor"
                    ? "ml-auto bg-blue text-white"
                    : msg.sender === "system"
                    ? "bg-paper text-mute"
                    : "bg-paper text-ink"
                } ${
                  msg.id === newestId
                    ? "shadow-[0_0_0_4px_rgba(60,140,255,0.35)]"
                    : "shadow-none"
                }`}
              >
                {msg.body}
                {msg.sender === "system" && (
                  <a
                    href={site.phoneHref}
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-navy py-2 text-[13px] font-semibold text-white"
                  >
                    📞 Call us
                  </a>
                )}
              </m.div>
            ))}
            <div ref={bottomRef} />
          </div>

          {notice && (
            <p className="px-4 pb-1 text-[12px] text-red-600">{notice}</p>
          )}

          <div className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              maxLength={1000}
              disabled={sending}
              className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-[13.5px] outline-none focus:border-blue disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {sending ? "…" : "Send"}
            </button>
          </div>
        </m.div>
      )}
      </AnimatePresence>
    </>
  );
}
