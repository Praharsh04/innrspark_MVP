import type { Json } from "@/lib/supabase";

export type ChatbotRole = "user" | "assistant" | "system";

export type ChatbotMessage = {
  id?: string;
  role: ChatbotRole;
  content: string;
  createdAt?: string;
};

export type ChatbotTaskSummary = {
  id: string;
  title: string;
  milestoneId: string;
  milestoneTitle: string;
  completed: boolean;
};

export type ChatbotRoadmapSummary = {
  id: string;
  careerTitle: string;
  milestoneCount: number;
  taskCount: number;
  completedTaskCount: number;
};

export type ChatbotContext = {
  userProfile: Json | null;
  psychometricProfile: Json | null;
  selectedCareer: {
    id: string;
    title: string;
    selection: Json;
  } | null;
  roadmapSummary: ChatbotRoadmapSummary;
  completedTasks: ChatbotTaskSummary[];
  incompleteTasks: ChatbotTaskSummary[];
  currentMilestone: {
    id: string;
    title: string;
    description: string;
  } | null;
  recentChatHistory: ChatbotMessage[];
};

export type ChatApiRequest = {
  message: string;
  history?: ChatbotMessage[];
  context?: Json;
};

export type ChatApiResponse = {
  reply: string;
  message: string;
  usedFallback: boolean;
};

export type SparkiAiResponse = {
  message: string;
};
