"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

const STORAGE_KEY = "majeurs_conversation_id";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [newestId, setNewestId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  // On mount: resume a previous conversation from this browser, if one exists.
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (!savedId) {
      setLoaded(true);
      return;
    }

    async function resume() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", savedId)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setConversationId(savedId);
        setMessages(data);
      } else {
        // Conversation vanished or had no messages — start fresh next time.
        localStorage.removeItem(STORAGE_KEY);
      }
      setLoaded(true);
    }
    resume();
  }, [supabase]);

  // Subscribe to realtime messages once we have a conversation.
  // Visitor's own messages are added optimistically on send (below),
  // so here we only react to staff/system messages coming back in —
  // otherwise the visitor would see their own message twice.
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new as Message;
          if (incoming.sender === "visitor") return;
          setMessages((prev) => [...prev, incoming]);
          setNewestId(incoming.id);
          setTimeout(() => setNewestId(null), 900);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    const tempId = `temp-${Date.now()}`;

    // Show it immediately — don't wait on the network or realtime.
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
        body: JSON.stringify({ conversationId, body: text }),
      });

      if (!res.ok) throw new Error("Send failed");
      const data = await res.json();
      if (!conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem(STORAGE_KEY, data.conversationId);
      }

      setNewestId(tempId);
      setTimeout(() => setNewestId(null), 900);
    } catch {
      // Mark the optimistic bubble as failed rather than losing it silently.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, body: `${m.body} (failed to send)` } : m
        )
      );
    } finally {
      setSending(false);
    }
  }

  // Don't render the floating button until we know whether to resume
  // a conversation — avoids a flash of the empty-state intro.
  if (!loaded) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-30 rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(18,104,232,0.55)]"
        >
          ✦ Ask Majeurs
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-30 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-navy px-4 py-3.5">
            <span className="text-sm font-semibold text-white">
              Ask Majeurs
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-[#9FB4CC] hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-[13.5px] text-mute">
                Hi, I&apos;m from Majeurs — how can I help?
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[13.5px] transition-shadow duration-700 ${
                  m.sender === "visitor"
                    ? "ml-auto bg-blue text-white"
                    : m.sender === "system"
                    ? "bg-paper text-mute"
                    : "bg-paper text-ink"
                } ${
                  m.id === newestId
                    ? "shadow-[0_0_0_4px_rgba(60,140,255,0.35)]"
                    : "shadow-none"
                }`}
              >
                {m.body}
                {m.sender === "system" && (
                  <a
                    href="tel:+254700123456"
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-navy py-2 text-[13px] font-semibold text-white"
                  >
                    📞 Call us
                  </a>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-[13.5px] outline-none disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {sending ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}