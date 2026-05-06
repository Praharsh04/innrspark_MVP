import type { ChatMessage, ChatPrompt } from "@/types/chat";

export const mockChatMessages: ChatMessage[] = [
  {
    id: "chat-1",
    role: "assistant",
    content: "Hi, I’m Sparki. I can help you understand your roadmap and plan your next step.",
    createdAt: "2026-05-05T10:00:00.000Z",
  },
  {
    id: "chat-2",
    role: "user",
    content: "What should I focus on first for Product Management?",
    createdAt: "2026-05-05T10:01:00.000Z",
  },
  {
    id: "chat-3",
    role: "assistant",
    content: "Start with fundamentals: understand PM responsibilities, map a product you use, and learn basic product vocabulary.",
    createdAt: "2026-05-05T10:01:20.000Z",
  },
];

export const mockChatPrompts: ChatPrompt[] = [
  {
    id: "prompt-next-task",
    label: "Next task",
    message: "What should I do next on my roadmap?",
  },
  {
    id: "prompt-career-fit",
    label: "Career fit",
    message: "Why does this career fit me?",
  },
  {
    id: "prompt-practice",
    label: "Practice plan",
    message: "Give me a simple 7-day practice plan.",
  },
];
