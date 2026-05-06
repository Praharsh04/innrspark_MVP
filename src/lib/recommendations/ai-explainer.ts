import { callJsonModel } from "@/lib/ai/client";
import { isJsonObject } from "@/lib/ai/json";
import type { UserTrait, TraitScoreMap } from "@/types/user";
import type { Recommendation } from "./types";
import { buildCareerExplainerMessages, careerExplainerJsonSchema } from "./prompts";

export type AiCareerExplanation = {
  shortReason: string;
  whyFulfilling: string;
  badges: string[];
  potentialChallenge: string;
  confidenceNote: string;
};

export type ExplainCareerInput = {
  profile: TraitScoreMap;
  recommendation: Recommendation;
  matchedTraits?: UserTrait[];
  gapTraits?: UserTrait[];
};

export async function explainCareerWithAi(input: ExplainCareerInput) {
  const matchedTraits = input.matchedTraits ?? input.recommendation.matchedTraits;
  const gapTraits = input.gapTraits ?? input.recommendation.gapTraits;
  const fallback = createDeterministicExplanation(input.recommendation, matchedTraits, gapTraits);

  return callJsonModel<AiCareerExplanation>({
    messages: buildCareerExplainerMessages({
      profile: input.profile,
      recommendation: input.recommendation,
      matchedTraits,
      gapTraits,
    }),
    validate: isAiCareerExplanation,
    fallback,
    temperature: 0.25,
    maxOutputTokens: 650,
    jsonSchema: {
      name: "career_explanation",
      description: "Cautious JSON career explanation for a deterministic recommendation.",
      schema: careerExplainerJsonSchema,
      strict: true,
    },
  });
}

export function createDeterministicExplanation(
  recommendation: Recommendation,
  matchedTraits: UserTrait[] = recommendation.matchedTraits,
  gapTraits: UserTrait[] = recommendation.gapTraits,
): AiCareerExplanation {
  const safeReason = softenLanguage(recommendation.reason, recommendation.title);
  const safeChallenge = softenLanguage(recommendation.potentialChallenge, recommendation.title);
  const traitList = matchedTraits.length > 0 ? matchedTraits.join(", ") : "your current trait pattern";
  const gapList = gapTraits.length > 0 ? gapTraits.join(", ") : "no major gap traits";

  return {
    shortReason: safeReason,
    whyFulfilling: `${recommendation.title} may fit because it can draw on ${traitList}. It is worth exploring as one possible direction, not a final answer.`,
    badges: recommendation.badges.length > 0 ? recommendation.badges.slice(0, 4) : ["Worth Exploring"],
    potentialChallenge: safeChallenge,
    confidenceNote: `This explanation keeps the deterministic ${recommendation.matchScore}% match score unchanged. It also notes ${gapList} as areas to explore further.`,
  };
}

function isAiCareerExplanation(value: unknown): value is AiCareerExplanation {
  return (
    isJsonObject(value) &&
    isSafeString(value.shortReason) &&
    isSafeString(value.whyFulfilling) &&
    Array.isArray(value.badges) &&
    value.badges.length > 0 &&
    value.badges.length <= 4 &&
    value.badges.every(isSafeString) &&
    isSafeString(value.potentialChallenge) &&
    isSafeString(value.confidenceNote) &&
    !containsForbiddenLanguage([
      value.shortReason,
      value.whyFulfilling,
      value.potentialChallenge,
      value.confidenceNote,
      ...value.badges,
    ])
  );
}

function isSafeString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function containsForbiddenLanguage(values: string[]): boolean {
  return values.some((value) => /\b(perfect career|guaranteed|destined|ideal career|best career)\b/i.test(value));
}

function softenLanguage(text: string, careerTitle: string): string {
  return text
    .replace(/\bperfect fit\b/gi, "possible fit")
    .replace(/\bexactly what's needed\b/gi, "potentially useful")
    .replace(/\bmake you a strong candidate\b/gi, `may support exploration of ${careerTitle}`)
    .replace(/\bwill help you excel\b/gi, "may help you build momentum")
    .replace(/\bsuccess\b/gi, "growth")
    .replace(/\bNo major challenges identified\./gi, "No major challenge stands out yet, but this path is still worth exploring carefully.");
}
