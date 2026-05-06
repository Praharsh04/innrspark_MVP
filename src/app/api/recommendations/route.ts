import { NextResponse } from "next/server";
import { explainCareerWithAi } from "@/lib/recommendations/ai-explainer";
import type { Recommendation, PsychometricProfile } from "@/lib/recommendations/types";

type RecommendationRequest = {
  profile: PsychometricProfile;
  recommendations: Recommendation[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RecommendationRequest>;

    if (!body.profile || !Array.isArray(body.recommendations)) {
      return NextResponse.json({ error: "Invalid recommendation payload." }, { status: 400 });
    }

    const enhanced = await Promise.all(
      body.recommendations.map(async (recommendation) => {
        const result = await explainCareerWithAi({
          profile: body.profile as PsychometricProfile,
          recommendation,
          matchedTraits: recommendation.matchedTraits,
          gapTraits: recommendation.gapTraits,
        });

        return {
          ...recommendation,
          reason: result.data.shortReason,
          badges: result.data.badges,
          potentialChallenge: result.data.potentialChallenge,
          aiExplanation: result.data,
          aiUsedFallback: result.usedFallback,
        };
      }),
    );

    return NextResponse.json({ recommendations: enhanced });
  } catch {
    return NextResponse.json({ error: "AI explanations are unavailable." }, { status: 500 });
  }
}
