import { create } from "zustand";
import { ChatMessage } from "@/types/chat";
import { mockChatMessages } from "@/data/mockChat";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const CHAT_FALLBACK_MESSAGE =
  "I'm having trouble connecting right now, but I can still help you think through your next step. Try asking again in a moment.";

type ChatState = {
  messages: ChatMessage[];
  isTyping: boolean;
  status: "idle" | "sending" | "error";
  error: string | null;
  loadRecentMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: mockChatMessages,
  isTyping: false,
  status: "idle",
  error: null,

  loadRecentMessages: async () => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      return;
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(30);

    if (error) {
      set({ error: "Could not load recent Sparki messages.", status: "error" });
      return;
    }

    if (data && data.length > 0) {
      set({
        messages: data.map((message) => ({
          id: message.id,
          role: message.role === "assistant" || message.role === "system" ? message.role : "user",
          content: message.content,
          createdAt: message.created_at,
        })),
      });
    }
  },

  sendMessage: async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent || get().isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
      status: "sending",
      error: null,
    }));

    const apiResponse = await sendMessageToApi(trimmedContent, get().messages.slice(-10));
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: apiResponse.message,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, assistantMessage],
      isTyping: false,
      status: apiResponse.error ? "error" : "idle",
      error: apiResponse.error,
    }));
  },
}));

async function sendMessageToApi(
  content: string,
  history: ChatMessage[],
): Promise<{ message: string; error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  const accessToken = supabase ? (await supabase.auth.getSession()).data.session?.access_token : null;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ message: content, history }),
    });

    if (!response.ok) {
      return {
        ...mockAssistantReply(),
        error: "Sparki is using fallback guidance because the chat service is unavailable.",
      };
    }

    const payload = (await response.json()) as { reply?: string; message?: string; usedFallback?: boolean };
    const message = payload.reply ?? payload.message;

    if (!message) {
      return {
        ...mockAssistantReply(),
        error: "Sparki returned an empty response, so fallback guidance is shown.",
      };
    }

    return { message, error: null };
  } catch {
    return {
      ...mockAssistantReply(),
      error: "Sparki is using fallback guidance because the network request failed.",
    };
  }
}

function mockAssistantReply() {
  return {
    message: CHAT_FALLBACK_MESSAGE,
    error: null,
  };
}
