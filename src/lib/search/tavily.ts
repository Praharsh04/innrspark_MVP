import type { LearningResource, ResourceLevel, SearchResult } from "./types";

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
};

type TavilyResponse = {
  results?: TavilyResult[];
};

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
const CACHE_TTL_MS = 45 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; data: SearchResult<LearningResource> }>();

export async function searchLearningResources(params: {
  searchQuery: string;
  topic: string;
  level: ResourceLevel;
}): Promise<SearchResult<LearningResource>> {
  const apiKey = cleanEnvValue(process.env.TAVILY_API_KEY) ?? cleanEnvValue(process.env.NEXT_PUBLIC_TAVILY_API_KEY);

  if (!apiKey) {
    return {
      data: [],
      error: "I can help with this, but live web search is not configured yet.",
      skipped: true,
    };
  }

  const query = buildEducationalQuery(params.searchQuery, params.level);
  const cacheKey = `web:${params.level}:${normalizeQuery(query)}`;
  const cached = readCache(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(TAVILY_SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: 8,
        include_answer: false,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily search failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as TavilyResponse;
    const resources = normalizeTavilyResults(payload.results ?? [], params.topic, params.level);
    const result: SearchResult<LearningResource> = {
      data: resources,
      error: resources.length > 0 ? null : "I couldn't find strong resources for that. Try a more specific topic.",
      skipped: false,
    };

    writeCache(cacheKey, result);
    return result;
  } catch {
    return {
      data: [],
      error: "I can help with this, but live web search is not available right now.",
      skipped: false,
    };
  }
}

function normalizeTavilyResults(results: TavilyResult[], topic: string, level: ResourceLevel): LearningResource[] {
  const seen = new Set<string>();

  return results
    .filter((result) => result.title && result.url)
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .flatMap((result) => {
      const url = normalizeUrl(result.url ?? "");

      if (!url || seen.has(url)) {
        return [];
      }

      seen.add(url);
      const source = getSource(url);

      return [
        {
          title: cleanText(result.title ?? "Learning resource"),
          url,
          source,
          snippet: cleanText(result.content ?? "A useful resource to explore this topic."),
          whyRecommended: `This looks useful for ${level} learners because it focuses on ${topic} with practical, searchable guidance.`,
        },
      ];
    })
    .slice(0, 3);
}

function qualityScore(result: TavilyResult): number {
  const url = result.url?.toLowerCase() ?? "";
  const title = result.title?.toLowerCase() ?? "";
  const content = result.content?.toLowerCase() ?? "";
  let score = result.score ?? 0;

  for (const signal of ["docs", "guide", "tutorial", "course", "learn", "beginner", "foundation"]) {
    if (url.includes(signal) || title.includes(signal) || content.includes(signal)) {
      score += 0.15;
    }
  }

  for (const domain of ["coursera.org", "edx.org", "freecodecamp.org", "developer.mozilla.org", "interaction-design.org"]) {
    if (url.includes(domain)) {
      score += 0.3;
    }
  }

  return score;
}

function buildEducationalQuery(searchQuery: string, level: ResourceLevel): string {
  return `${searchQuery} ${level} learning resources guide tutorial documentation`;
}

function normalizeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function getSource(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "web";
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeQuery(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function readCache(key: string): SearchResult<LearningResource> | null {
  const entry = cache.get(key);

  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function writeCache(key: string, data: SearchResult<LearningResource>) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function cleanEnvValue(value: string | undefined): string | null {
  const cleaned = value?.trim().replace(/^['"]|['"]$/g, "");
  return cleaned ? cleaned : null;
}
