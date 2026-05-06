import type { SparkiIntent } from "./types";

const DEFAULT_INTENT: SparkiIntent = {
  intent: "general_chat",
  topic: "",
  level: "beginner",
  searchQuery: "",
  resourceType: "none",
  needsSearch: false,
};

export async function extractSparkiIntent(userMessage: string): Promise<SparkiIntent> {
  return inferIntent(userMessage);
}

function inferIntent(message: string): SparkiIntent {
  const normalized = message.toLowerCase();
  const level = inferLevel(normalized);
  const topic = extractTopic(message);
  const asksForVideo = /\b(youtube|video|videos|watch|playlist|channel|embed)\b/i.test(message);
  const asksForLearning =
    /\b(learn|resources?|guides?|tutorials?|articles?|documentation|docs|courses?|references?|study|practice)\b/i.test(message);
  const asksRoadmap =
    /\b(roadmap|progress|task|milestone|career path|next step|what should i do next|selected career)\b/i.test(message);

  if (asksForVideo) {
    return {
      intent: "youtube_videos",
      topic,
      level,
      searchQuery: topic || message,
      resourceType: "youtube",
      needsSearch: true,
    };
  }

  if (asksForLearning && !asksRoadmap) {
    return {
      intent: "learn_resources",
      topic,
      level,
      searchQuery: topic || message,
      resourceType: "web",
      needsSearch: true,
    };
  }

  return DEFAULT_INTENT;
}

function inferLevel(message: string): SparkiIntent["level"] {
  if (/\b(advanced|expert|senior|deep dive)\b/.test(message)) {
    return "advanced";
  }

  if (/\b(intermediate|some experience|next level)\b/.test(message)) {
    return "intermediate";
  }

  return "beginner";
}

function extractTopic(message: string): string {
  return message
    .replace(/\b(show me|give me|find|best|resources?|learn|learning|youtube|videos?|video|for|about|to|i want|want to|please)\b/gi, " ")
    .replace(/[?.!,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}
