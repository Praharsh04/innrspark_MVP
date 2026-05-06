"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { RecommendationLoading } from "@/components/recommendations/RecommendationLoading";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";

export default function AssessmentLoadingPage() {
  const router = useRouter();
  const psychometricProfile = useAssessmentStore((state) => state.psychometricProfile);
  const generateRecommendations = useRecommendationStore((state) => state.generateRecommendations);

  useEffect(() => {
    if (psychometricProfile) {
      generateRecommendations(psychometricProfile);
    }

    const timer = setTimeout(() => {
      router.push("/recommendations");
    }, 3000);

    return () => clearTimeout(timer);
  }, [psychometricProfile, generateRecommendations, router]);

  return (
    <MobileShell>
      <RecommendationLoading />
    </MobileShell>
  );
}
