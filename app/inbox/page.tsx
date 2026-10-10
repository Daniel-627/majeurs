"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Message } from "@/types";

// "Waiting on us" = the visitor (or the automatic call-fallback) spoke last.
function needsReply(c: Conversation) {
  return c.last_sender !== null && c.last_sender !== "staff";
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Conversation list — most recent activity first, kept live.
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false });
      if (data) setConversations(data);
    }
    load();

    const channel = supabase
      .channel("inbox:conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Show how many are waiting in the browser tab, so you notice from another tab.
  const waiting = conversations.filter(needsReply).length;
  useEffect(() => {
    document.title = `${waiting > 0 ? `(${waiting}) ` : ""}Inbox | Majeurs Ltd`;
  }, [waiting]);

  // Messages for the open conversation, kept live.
  useEffect(() => {
    if (!activeId) return;

    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    }
    loadMessages();

    const channel = supabase
      .channel(`inbox:messages:${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeId, supabase]);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeId]);

  async function sendReply() {
    const text = reply.trim();
    if (!text || !activeId) return;
    setReply("");

    await supabase.from("messages").insert({
      conversation_id: activeId,
      sender: "staff",
      body: text,
    });

    await supabase
      .from("conversations")
      .update({ status: "answered", replied_at: new Date().toISOString() })
      .eq("id", activeId);
  }

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="flex h-full bg-paper">
      {/* Conversation list — full width on mobile when nothing is selected,
          hidden on mobile once a conversation is open (thread takes over) */}
      <div
        className={`w-full flex-shrink-0 overflow-y-auto border-r border-line bg-white sm:block sm:w-80 ${
          activeId ? "hidden sm:block" : "block"
        }`}
      >
        <div className="border-b border-line px-5 py-2.5 text-[12.5px] text-mute">
          {waiting > 0 ? (
            <span className="font-semibold text-blue">
              {waiting} waiting for a reply
            </span>
          ) : (
            "All caught up"
          )}
        </div>

        {conversations.map((c) => {
          const waitingOnUs = needsReply(c);
          const overdue = waitingOnUs && c.status === "timed_out";
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`block w-full border-b border-line px-5 py-3.5 text-left ${
                activeId === c.id ? "bg-paper" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`truncate text-sm text-ink ${
                    waitingOnUs ? "font-semibold" : "font-medium"
                  }`}
                >
                  {c.visitor_name || "Website visitor"}
                </span>
                <span
                  className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    overdue
                      ? "bg-amber-100 text-amber-700"
                      : waitingOnUs
                      ? "bg-blue/10 text-blue"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {overdue ? "Overdue" : waitingOnUs ? "Needs reply" : "Replied"}
                </span>
              </div>
              {c.last_message_preview && (
                <div
                  className={`mt-1 truncate text-[12.5px] ${
                    waitingOnUs ? "text-ink" : "text-mute"
                  }`}
                >
                  {c.last_message_preview}
                </div>
              )}
              <div className="mt-1 truncate text-[11.5px] text-mute">
                {formatWhen(c.last_message_at ?? c.created_at)}
                {(c.visitor_phone || c.visitor_email) && (
                  <span> · {c.visitor_phone || c.visitor_email}</span>
                )}
              </div>
            </button>
          );
        })}
        {conversations.length === 0 && (
          <p className="px-5 py-6 text-sm text-mute">No conversations yet.</p>
        )}
      </div>

      {/* Thread — hidden on mobile until a conversation is selected */}
      <div className={`min-w-0 flex-1 flex-col sm:flex ${activeId ? "flex" : "hidden"}`}>
        {!activeId ? (
          <div className="flex flex-1 items-center justify-center text-sm text-mute">
            Select a conversation
          </div>
        ) : (
          <>
            <button
              onClick={() => setActiveId(null)}
              className="flex items-center gap-1.5 border-b border-line bg-white px-5 py-3 text-[13px] font-medium text-mute sm:hidden"
            >
              ← Back to conversations
            </button>
            {active && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line bg-white px-5 py-3 text-[13px]">
                <span className="font-semibold">
                  {active.visitor_name || "Website visitor"}
                </span>
                {active.visitor_phone && (
                  <a href={`tel:${active.visitor_phone}`} className="text-blue">
                    {active.visitor_phone}
                  </a>
                )}
                {active.visitor_email && (
                  <a href={`mailto:${active.visitor_email}`} className="text-blue">
                    {active.visitor_email}
                  </a>
                )}
                {!active.visitor_phone && !active.visitor_email && (
                  <span className="text-mute">No contact details left</span>
                )}
              </div>
            )}
            <div className="flex-1 space-y-2.5 overflow-y-auto p-6">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-md rounded-xl px-3.5 py-2.5 text-sm ${
                    m.sender === "staff"
                      ? "ml-auto bg-navy text-white"
                      : m.sender === "system"
                      ? "bg-gray-100 text-mute"
                      : "bg-white text-ink"
                  }`}
                >
                  {m.body}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="flex gap-2 border-t border-line bg-white p-4">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type a reply..."
                className="flex-1 rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
              />
              <button
                onClick={sendReply}
                className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white"
              >
                Reply
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
