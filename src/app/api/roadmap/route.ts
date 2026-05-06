import { NextResponse } from "next/server";
import { generateAiAssistedRoadmap } from "@/lib/roadmap/ai-roadmap-generator";
import type { CareerRoadmap, UserPsychometricProfile } from "@/lib/roadmap/types";

type RoadmapRequest = {
  selectedCareer: {
    id: string;
    title: string;
  };
  profile: UserPsychometricProfile;
  templateRoadmap: CareerRoadmap;
  learningStyle: string;
  motivationStyle: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RoadmapRequest>;

    if (!body.selectedCareer || !body.profile || !body.templateRoadmap) {
      return NextResponse.json({ error: "Invalid roadmap payload." }, { status: 400 });
    }

    const result = await generateAiAssistedRoadmap({
      selectedCareer: body.selectedCareer,
      profile: body.profile,
      templateRoadmap: body.templateRoadmap,
      learningStyle: body.learningStyle ?? "Learns best through practical steps.",
      motivationStyle: body.motivationStyle ?? "Motivated by clear progress.",
    });

    return NextResponse.json({
      roadmap: result.data,
      aiUsedFallback: result.usedFallback,
    });
  } catch {
    return NextResponse.json({ error: "AI roadmap generation is unavailable." }, { status: 500 });
  }
}
