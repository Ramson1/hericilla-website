"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSupabase, hasSupabaseEnv } from "@hericilla/supabase-clients";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Msg = { id: string; sender_role: "visitor" | "agent"; body: string; created_at: string };

/**
 * Custom live chat: visitor gets an anonymous thread (token in localStorage),
 * agents answer from the admin Inbox over Supabase Realtime. When offline /
 * no DB configured the widget links to the enquiry form instead.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const enabled = hasSupabaseEnv();

  useEffect(() => {
    if (open && !threadId && enabled && !connecting) void startThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => { void channelRef.current?.unsubscribe(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function token(): string {
    let t = localStorage.getItem("hericilla_chat_token");
    if (!t) {
      t = crypto.randomUUID();
      localStorage.setItem("hericilla_chat_token", t);
    }
    return t;
  }

  async function startThread() {
    setConnecting(true);
    try {
      const s = getSupabase();
      const vt = token();
      const { data, error } = await s
        .from("chat_threads")
        .insert({ visitor_token: vt, status: "open" })
        .select()
        .single();
      if (error || !data) throw error;
      setThreadId(data.id);
      subscribe(s, data.id, vt);
    } catch {
      setConnecting(false);
    }
  }

  function subscribe(s: ReturnType<typeof getSupabase>, id: string, vt: string) {
    channelRef.current?.unsubscribe();
    const ch = s
      .channel(`chat-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `thread_id=eq.${id}` },
        (payload) => {
          const m = payload.new as Msg;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          if (m.sender_role === "agent") setAgentOnline(true);
        },
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const { data } = await s
            .from("chat_messages")
            .select("id, sender_role, body, created_at")
            .eq("thread_id", id)
            .order("created_at")
            .limit(100);
          setMessages((data as Msg[]) ?? []);
        }
      });
    channelRef.current = ch;
  }

  async function send() {
    const body = draft.trim();
    if (!body || !threadId) return;
    setDraft("");
    const s = getSupabase();
    const vt = token();
    const { data } = await s
      .from("chat_messages")
      .insert({ thread_id: threadId, sender_role: "visitor", body })
      .select()
      .single();
    if (data) setMessages((prev) => [...prev, data as Msg]);
    // keep the thread header warm for agents
    await s.from("chat_threads").update({ last_message_at: new Date().toISOString() }).eq("id", threadId);
    void vt;
  }

  if (!enabled) {
    if (!open) return (
      <FloatingButton onClick={() => setOpen(true)} />
    );
    return (
      <Panel onClose={() => setOpen(false)}>
        <div className="p-6 text-center">
          <p className="font-semibold text-lg">Chat is being connected to our office system.</p>
          <p className="mt-2 text-ink-soft">Meanwhile, send us a message and we will reply quickly.</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Contact form <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <>
      {!open && <FloatingButton onClick={() => setOpen(true)} />}
      {open && (
        <Panel onClose={() => setOpen(false)}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
            {messages.length === 0 && (
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold">Welcome to Hericilla live chat 👋</p>
                <p className="mt-1 text-ink-soft">
                  {connecting
                    ? "Connecting you to the front desk…"
                    : threadId
                      ? "Type your question below. An officer from Port Harcourt will answer here."
                      : "Could not connect — please use the contact form."}
                </p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender_role === "visitor" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[1.05rem] shadow-sm ${
                    m.sender_role === "visitor"
                      ? "bg-brand-700 text-white"
                      : "bg-white text-ink border border-line"
                  }`}
                >
                  {m.sender_role === "agent" && (
                    <p className="text-xs font-bold text-brand-700 mb-1">Hericilla office</p>
                  )}
                  {m.body}
                </div>
              </div>
            ))}
            {agentOnline && <p className="text-center text-xs text-ink-soft">You have a reply 🎉</p>}
            <div ref={bottomRef} />
          </div>
          <form
            className="flex items-center gap-2 border-t border-line bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={threadId ? "Type your message…" : "Waiting for connection…"}
              disabled={!threadId}
              className="min-h-12 flex-1 rounded-xl border-2 border-line px-4 text-lg focus:border-brand-400 focus:outline-none"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={!threadId || !draft.trim()}
              className="min-h-12 rounded-xl bg-brand-700 px-4 text-white disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-6 w-6" />
            </button>
          </form>
        </Panel>
      )}
    </>
  );
}

function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open live chat"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-700 text-white shadow-[var(--shadow-pop)] hover:bg-brand-800"
    >
      <MessageCircle className="h-8 w-8" />
    </button>
  );
}

function Panel({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-[min(92vw,26rem)] flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-pop)]">
      <div className="flex items-center justify-between bg-brand-900 px-4 py-3 text-white">
        <p className="font-bold text-lg">Chat with Hericilla</p>
        <button onClick={onClose} aria-label="Close chat" className="rounded-lg p-2 hover:bg-brand-800">
          <X className="h-6 w-6" />
        </button>
      </div>
      {children}
    </div>
  );
}
