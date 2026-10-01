"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to realtime messages once we have a conversation
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
          setMessages((prev) => [...prev, payload.new as Message]);
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
    if (!input.trim()) return;

    // First message: create the conversation, then the message.
    // POST to /api/messages — that route handles both the insert
    // and kicking off the Phase 6 timeout job (QStash).
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, body: input }),
    });

    const data = await res.json();
    if (!conversationId) setConversationId(data.conversationId);
    setInput("");
  }

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
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[13.5px] ${
                  m.sender === "visitor"
                    ? "ml-auto bg-blue text-white"
                    : m.sender === "system"
                    ? "bg-paper text-mute"
                    : "bg-paper text-ink"
                }`}
              >
                {m.body}
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
              className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-[13.5px] outline-none"
            />
            <button
              onClick={sendMessage}
              className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
