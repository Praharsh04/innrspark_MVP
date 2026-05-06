export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  responseType?: "chat" | "web_resources" | "video_recommendations";
  resources?: ChatLearningResource[];
  videos?: ChatVideoResource[];
};

export type ChatPrompt = {
  id: string;
  label: string;
  message: string;
};

export type ChatLearningResource = {
  title: string;
  url: string;
  source: string;
  snippet: string;
  whyRecommended: string;
};

export type ChatVideoResource = {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  embedUrl: string;
  watchUrl: string;
  whyRecommended: string;
};
