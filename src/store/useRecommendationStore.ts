"use client";

import { create } from "zustand";
import { Recommendation, PsychometricProfile } from "@/lib/recommendations/types";
import { getRecommendations } from "@/lib/recommendations/matcher";
import { careerOntology } from "@/lib/recommendations/career-ontology";
import { saveCareerRecommendations, saveSelectedCareer } from "@/lib/supabase/persistence";
import type { Json } from "@/lib/supabase";

type RecommendationState = {
  currentIndex: number;
  selectedCareerId: string | null;
  persistedRecommendationSetId: string | null;
  persistedSelectedCareerId: string | null;
  persistenceError: string | null;
  aiError: string | null;
  isEnhancingWithAi: boolean;
  recommendations: Recommendation[];
  setCurrentIndex: (index: number) => void;
  selectCareer: (careerId: string) => void;
  generateRecommendations: (profile: PsychometricProfile) => void;
  getCareerById: (id: string) => Recommendation | null;
};

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  currentIndex: 0,
  selectedCareerId: null,
  persistedRecommendationSetId: null,
  persistedSelectedCareerId: null,
  persistenceError: null,
  aiError: null,
  isEnhancingWithAi: false,
  recommendations: [],
  
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  
  selectCareer: (selectedCareerId) => {
    set({ selectedCareerId });

    const recommendation = get().recommendations.find((item) => item.careerId === selectedCareerId);
    const fallbackCareer = careerOntology.find((item) => item.id === selectedCareerId);
    const title = recommendation?.title ?? fallbackCareer?.title ?? selectedCareerId;

    saveSelectedCareer({
      careerId: selectedCareerId,
      careerTitle: title,
      careerRecommendationId: get().persistedRecommendationSetId,
      selection: (recommendation ?? { careerId: selectedCareerId, title }) as unknown as Json,
    }).then((result) => {
      if (result.data?.selectedCareerId) {
        set({ persistedSelectedCareerId: result.data.selectedCareerId });
      } else if (result.error) {
        set({ persistenceError: result.error });
      }
    });
  },
  
  generateRecommendations: (profile) => {
    const results = getRecommendations(profile);
    set({ recommendations: results, currentIndex: 0, aiError: null, isEnhancingWithAi: true });

    enhanceRecommendationsWithAi(profile, results)
      .then((enhancedRecommendations) => {
        if (enhancedRecommendations) {
          set({ recommendations: enhancedRecommendations, isEnhancingWithAi: false });
        } else {
          set({ isEnhancingWithAi: false });
        }
      })
      .catch(() => {
        set({
          isEnhancingWithAi: false,
          aiError: "AI explanations are unavailable, so deterministic explanations are shown.",
        });
      });

    saveCareerRecommendations({
      assessmentId: null,
      recommendations: results as unknown as Json,
    }).then((result) => {
      if (result.data?.recommendationSetId) {
        set({ persistedRecommendationSetId: result.data.recommendationSetId });
      } else if (result.error) {
        set({ persistenceError: result.error });
      }
    });
  },

  getCareerById: (id) => {
    return get().recommendations.find(r => r.careerId === id) || null;
  }
}));

async function enhanceRecommendationsWithAi(profile: PsychometricProfile, recommendations: Recommendation[]) {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, recommendations }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { recommendations?: Recommendation[] };

  if (!Array.isArray(payload.recommendations)) {
    return null;
  }

  return payload.recommendations.map((recommendation, index) => ({
    ...recommendations[index],
    reason: recommendation.reason ?? recommendations[index].reason,
    badges: recommendation.badges ?? recommendations[index].badges,
    potentialChallenge: recommendation.potentialChallenge ?? recommendations[index].potentialChallenge,
  }));
}
