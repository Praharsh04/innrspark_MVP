"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { RoadmapGenerating } from "@/components/roadmap/RoadmapGenerating";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useRoadmapStore } from "@/store/useRoadmapStore";

export default function RoadmapGeneratingPage() {
  const router = useRouter();
  const psychometricProfile = useAssessmentStore((state) => state.psychometricProfile);
  const selectedCareerId = useRecommendationStore((state) => state.selectedCareerId);
  const generateRoadmap = useRoadmapStore((state) => state.generateRoadmap);
  const loadMockRoadmap = useRoadmapStore((state) => state.loadMockRoadmap);

  useEffect(() => {
    if (selectedCareerId && psychometricProfile) {
      generateRoadmap(selectedCareerId, psychometricProfile);
    } else {
      loadMockRoadmap();
    }

    const timer = setTimeout(() => {
      router.push("/roadmap");
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedCareerId, psychometricProfile, generateRoadmap, loadMockRoadmap, router]);

  return (
    <MobileShell>
      <RoadmapGenerating />
    </MobileShell>
  );
}
