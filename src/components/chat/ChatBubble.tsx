"use client";

import { ChatMessage } from "@/types/chat";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`mb-5 flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-[24px] px-5 py-3.5 text-[16px] font-bold leading-relaxed shadow-sm border ${
          isAssistant
            ? "rounded-tl-none bg-white text-charcoal border-charcoal/5"
            : "rounded-tr-none bg-brand-yellow text-charcoal border-charcoal/10"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
