import type { JsonObject } from "@/lib/ai/json";
import type { UserTrait, TraitScoreMap } from "@/types/user";
import type { Recommendation } from "./types";

type CareerExplanationPromptInput = {
  profile: TraitScoreMap;
  recommendation: Recommendation;
  matchedTraits: UserTrait[];
  gapTraits: UserTrait[];
};

export function buildCareerExplainerMessages(input: CareerExplanationPromptInput) {
  return [
    {
      role: "system" as const,
      content:
        "You write cautious career exploration explanations for Innrspark. Return JSON only. Never change ranking, match score, career title, matched traits, or gap traits. Never say perfect career, guaranteed success, destined, ideal, or best career. Use cautious language such as may fit, could fit, worth exploring, and may be useful.",
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        task: "Explain why this deterministic career recommendation may be worth exploring.",
        constraints: {
          outputShape: {
            shortReason: "string",
            whyFulfilling: "string",
            badges: "string[]",
            potentialChallenge: "string",
            confidenceNote: "string",
          },
          preserveRanking: true,
          doNotInventTraits: true,
          allowedTraitsOnly: [...input.matchedTraits, ...input.gapTraits],
          cautiousLanguage: true,
        },
        psychometricProfile: input.profile,
        recommendation: {
          careerId: input.recommendation.careerId,
          title: input.recommendation.title,
          cluster: input.recommendation.cluster,
          matchScore: input.recommendation.matchScore,
          deterministicReason: input.recommendation.reason,
          deterministicBadges: input.recommendation.badges,
          deterministicChallenge: input.recommendation.potentialChallenge,
        },
        matchedTraits: input.matchedTraits,
        gapTraits: input.gapTraits,
      }),
    },
  ];
}

export const careerExplainerJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["shortReason", "whyFulfilling", "badges", "potentialChallenge", "confidenceNote"],
  properties: {
    shortReason: { type: "string" },
    whyFulfilling: { type: "string" },
    badges: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 4,
    },
    potentialChallenge: { type: "string" },
    confidenceNote: { type: "string" },
  },
} satisfies JsonObject;
