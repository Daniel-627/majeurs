"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Message } from "@/types";

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const supabase = createClient();

  // Load conversation list, newest first
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });
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

  // Load + subscribe to the active conversation's messages
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

  return (
    <div className="flex h-full bg-paper">
      {/* Conversation list — full width on mobile when nothing is selected,
          hidden on mobile once a conversation is open (thread takes over) */}
      <div
        className={`w-full flex-shrink-0 overflow-y-auto border-r border-line bg-white sm:block sm:w-80 ${
          activeId ? "hidden sm:block" : "block"
        }`}
      >
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`block w-full border-b border-line px-5 py-3.5 text-left ${
              activeId === c.id ? "bg-paper" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                {c.visitor_name || "Website visitor"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  c.status === "open"
                    ? "bg-blue/10 text-blue"
                    : c.status === "answered"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-mute"
                }`}
              >
                {c.status}
              </span>
            </div>
            <div className="mt-1 text-[11.5px] text-mute">
              {new Date(c.created_at).toLocaleString()}
            </div>
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="px-5 py-6 text-sm text-mute">
            No conversations yet.
          </p>
        )}
      </div>

      {/* Thread — hidden on mobile until a conversation is selected */}
      <div className={`flex-1 flex-col sm:flex ${activeId ? "flex" : "hidden"}`}>
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