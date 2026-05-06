export type LearningResource = {
  title: string;
  url: string;
  source: string;
  snippet: string;
  whyRecommended: string;
};

export type VideoResource = {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  embedUrl: string;
  watchUrl: string;
  whyRecommended: string;
};

export type ResourceLevel = "beginner" | "intermediate" | "advanced";

export type SearchResult<T> = {
  data: T[];
  error: string | null;
  skipped: boolean;
};
