"use client";

import { useState } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-[104px] z-20 px-screen pb-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-[32px] border border-charcoal/15 bg-white/80 p-2 shadow-premium backdrop-blur-xl transition-all focus-within:border-brand-yellow/50"
      >
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/40 transition-all hover:bg-charcoal/10 active:scale-90"   
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Sparki"
          className="h-11 w-full bg-transparent px-2 text-[16px] font-bold text-charcoal placeholder:text-charcoal/30 focus:outline-none"
          disabled={disabled}
        />

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-transparent text-charcoal/30 transition-all hover:bg-charcoal/5 active:scale-90"
        >
          <Mic size={22} strokeWidth={2.5} />
        </button>

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
            input.trim() && !disabled
              ? "bg-brand-yellow text-charcoal shadow-button"
              : "bg-charcoal/5 text-charcoal/20"
          }`}
        >
          <ArrowUp size={22} strokeWidth={3} />
        </button>
      </form>
    </div>
  );
}

