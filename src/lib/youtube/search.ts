import type { ResourceLevel, SearchResult, VideoResource } from "@/lib/search/types";

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      medium?: { url?: string };
      high?: { url?: string };
      default?: { url?: string };
    };
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
};

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const CACHE_TTL_MS = 45 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; data: SearchResult<VideoResource> }>();

export async function searchYouTubeVideos(params: {
  searchQuery: string;
  topic: string;
  level: ResourceLevel;
}): Promise<SearchResult<VideoResource>> {
  const apiKey = cleanEnvValue(process.env.YOUTUBE_API_KEY);

  if (!apiKey) {
    return {
      data: [],
      error: "I can recommend videos once the YouTube API key is configured.",
      skipped: true,
    };
  }

  const query = `${params.searchQuery} ${params.level} tutorial`;
  const cacheKey = `youtube:${params.level}:${normalizeQuery(query)}`;
  const cached = readCache(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const url = new URL(YOUTUBE_SEARCH_URL);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "3");
    url.searchParams.set("safeSearch", "strict");
    url.searchParams.set("q", query);
    url.searchParams.set("key", apiKey);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube search failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as YouTubeSearchResponse;
    const videos = normalizeYouTubeResults(payload.items ?? [], params.topic, params.level);
    const result: SearchResult<VideoResource> = {
      data: videos,
      error: videos.length > 0 ? null : "I couldn't find strong videos for that. Try a more specific topic.",
      skipped: false,
    };

    writeCache(cacheKey, result);
    return result;
  } catch {
    return {
      data: [],
      error: "I can help with this, but YouTube search is not available right now.",
      skipped: false,
    };
  }
}

function normalizeYouTubeResults(items: YouTubeSearchItem[], topic: string, level: ResourceLevel): VideoResource[] {
  const seen = new Set<string>();

  return items
    .flatMap((item) => {
      const videoId = item.id?.videoId;

      if (!videoId || !VIDEO_ID_PATTERN.test(videoId) || seen.has(videoId)) {
        return [];
      }

      seen.add(videoId);
      const title = decodeHtml(item.snippet?.title ?? "YouTube learning video");
      const thumbnail =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        "";

      return [
        {
          videoId,
          title,
          thumbnail,
          channelTitle: item.snippet?.channelTitle ?? "YouTube",
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
          whyRecommended: `This video may help ${level} learners start ${topic} with a visual walkthrough.`,
        },
      ];
    })
    .slice(0, 3);
}

function readCache(key: string): SearchResult<VideoResource> | null {
  const entry = cache.get(key);

  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function writeCache(key: string, data: SearchResult<VideoResource>) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function normalizeQuery(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function cleanEnvValue(value: string | undefined): string | null {
  const cleaned = value?.trim().replace(/^['"]|['"]$/g, "");
  return cleaned ? cleaned : null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
