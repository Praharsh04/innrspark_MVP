"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, History, MessageSquarePlus, X } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useChatStore } from "@/store/useChatStore";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const { messages, pastChats, sendMessage, isTyping, error, loadRecentMessages, startNewChat, restoreChat } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPastChats, setShowPastChats] = useState(false);

  useEffect(() => {
    loadRecentMessages();
  }, [loadRecentMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <MobileShell withBottomNav>
      <div className="relative flex h-full min-h-0 flex-col bg-brand-cream">
        <header className="shrink-0 border-b border-charcoal/10 bg-white/95 px-screen py-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <h1 className="text-[22px] font-black leading-none tracking-tight text-charcoal">Sparki</h1>
              </div>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/30">Career coach</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startNewChat}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-charcoal/5 bg-brand-cream text-charcoal shadow-sm transition active:scale-95"
                aria-label="Start a new chat"
              >
                <MessageSquarePlus size={19} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setShowPastChats(true)}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-charcoal/5 bg-brand-cream text-charcoal shadow-sm transition active:scale-95"
                aria-label="Open past chats"
              >
                <History size={19} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {showPastChats && (
          <div className="absolute inset-0 z-40 flex items-end bg-charcoal/30 px-screen pb-[calc(7.25rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
            <section className="w-full max-h-[68vh] overflow-hidden rounded-[30px] border border-white/70 bg-white p-5 shadow-premium" role="dialog" aria-modal="true" aria-labelledby="past-chats-title">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="past-chats-title" className="text-[22px] font-black leading-tight text-charcoal">Past Chats</h2>
                  <p className="mt-1 text-[13px] font-bold text-charcoal/45">Recent visible conversations from this session.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPastChats(false)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-charcoal/5 text-charcoal/55"
                  aria-label="Close past chats"
                >
                  <X size={20} strokeWidth={2.6} />
                </button>
              </div>

              <div className="mt-5 max-h-[42vh] overflow-y-auto no-scrollbar">
                {pastChats.length === 0 ? (
                  <p className="rounded-2xl bg-brand-cream px-4 py-5 text-center text-[14px] font-bold leading-relaxed text-charcoal/50">
                    No past chats yet. Start a conversation, then tap New Chat to save this one here.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {pastChats.map((chat, index) => (
                      <button
                        key={`${chat[0]?.id ?? "chat"}-${index}`}
                        type="button"
                        onClick={() => {
                          restoreChat(index);
                          setShowPastChats(false);
                        }}
                        className="w-full rounded-2xl border border-charcoal/5 bg-brand-cream/70 px-4 py-3 text-left transition active:scale-[0.98]"
                      >
                        <span className="block truncate text-[15px] font-black text-charcoal">
                          {chat.find((message) => message.role === "user")?.content ?? "Saved conversation"}
                        </span>
                        <span className="mt-1 block text-[12px] font-bold text-charcoal/40">{chat.length} messages</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Message Container */}
        <div 
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-screen pb-[calc(13.25rem+env(safe-area-inset-bottom))] pt-5 scroll-smooth no-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center px-8 pb-8 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-brand-yellow/12 shadow-sm">
                <Bot size={40} className="text-brand-yellow" strokeWidth={2.5} />
              </div>
              <h2 className="text-[25px] font-black leading-tight tracking-tight text-charcoal">
                How can I guide you today?
              </h2>
              <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.16em] text-charcoal/40">Ask anything about your career</p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))
          )}

          {isTyping && (
            <div className="mb-6 flex justify-start">
              <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-none shadow-sm border border-charcoal/5 flex gap-1.5 items-center">
                <div className="h-2 w-2 rounded-full bg-brand-yellow animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          {error && (
            <p className="mx-auto max-w-[270px] rounded-2xl bg-white/70 px-4 py-3 text-center text-xs font-bold text-red-500 border border-red-50 shadow-sm">
              {error}
            </p>
          )}
        </div>

        {/* Fixed Chat Input */}
        <ChatInput onSend={sendMessage} disabled={isTyping} />

      </div>
    </MobileShell>
  );

}
