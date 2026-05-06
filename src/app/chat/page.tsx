"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, Bot } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useChatStore } from "@/store/useChatStore";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const { messages, sendMessage, isTyping, error, loadRecentMessages } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {/* Header */}
        <header className="flex items-center justify-center border-b border-charcoal/10 px-screen py-7 bg-white shadow-sm">
          <button className="flex items-center gap-2 rounded-2xl bg-brand-cream px-5 py-2.5 shadow-sm border border-charcoal/5 active:scale-[0.97] transition-all">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[18px] font-black text-charcoal tracking-tight">Sparki</span>
            <ChevronDown size={18} strokeWidth={3} className="text-charcoal/25 ml-1" />
          </button>
        </header>

        {/* Message Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-screen pt-6 pb-48 space-y-3 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="flex h-[65%] flex-col items-center justify-center text-center px-8">
              <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mb-6">
                <Bot size={40} className="text-brand-yellow" strokeWidth={2.5} />
              </div>
              <h2 className="text-[26px] font-black text-charcoal tracking-tight leading-tight">
                How can I guide you today?
              </h2>
              <p className="mt-3 text-[15px] font-bold text-charcoal/40 uppercase tracking-widest">ASK ANYTHING ABOUT YOUR CAREER</p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))
          )}

          {isTyping && (
            <div className="flex justify-start mb-6">
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
