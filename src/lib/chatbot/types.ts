import type { Json } from "@/lib/supabase";
import type { LearningResource, ResourceLevel, VideoResource } from "@/lib/search/types";

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

export type CompactChatbotContext = {
  selectedCareer: string;
  currentMilestone: string;
  nextIncompleteTask: string;
  upcomingTasks: string[];
  completedTaskCount: number;
  totalTaskCount: number;
  topStrengths: string[];
  learningStyle: string;
  motivationStyle: string;
  recentConversationSummary: string;
  lastUserMessages: string[];
};

export type ChatbotUserIntent =
  | "next_step"
  | "stuck"
  | "explanation"
  | "motivation"
  | "resources"
  | "roadmap_adjustment"
  | "general_chat";

export type ChatApiRequest = {
  message: string;
  history?: ChatbotMessage[];
  context?: Json;
};

export type ChatApiResponse = {
  type: "chat";
  reply: string;
  message: string;
  usedFallback: boolean;
} | {
  type: "web_resources";
  reply: string;
  message: string;
  usedFallback: boolean;
  resources: LearningResource[];
} | {
  type: "video_recommendations";
  reply: string;
  message: string;
  usedFallback: boolean;
  videos: VideoResource[];
};

export type SparkiAiResponse = {
  message: string;
};

export type SparkiIntent = {
  intent: "general_chat" | "learn_resources" | "youtube_videos";
  topic: string;
  level: ResourceLevel;
  searchQuery: string;
  resourceType: "none" | "web" | "youtube";
  needsSearch: boolean;
};
