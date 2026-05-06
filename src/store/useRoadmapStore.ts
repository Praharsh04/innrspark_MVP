"use client";

import { create } from "zustand";
import { mockRoadmap } from "@/data/mockRoadmap";
import type { CareerRoadmap } from "@/types/roadmap";
import type { TraitScoreMap } from "@/types/user";
import { generateRoadmap as generateRoadmapLogic } from "@/lib/roadmap/roadmap-generator";
import type { CareerRoadmap as GeneratedRoadmap } from "@/lib/roadmap/types";
import {
  loadLatestRoadmap,
  saveRoadmap,
  saveRoadmapTaskProgress,
} from "@/lib/supabase/persistence";
import type { Json } from "@/lib/supabase";

type RoadmapState = {
  roadmap: CareerRoadmap | null;
  persistedRoadmapId: string | null;
  activeMilestoneId: string | null;
  persistenceError: string | null;
  aiError: string | null;
  isPersonalizingWithAi: boolean;
  loadMockRoadmap: () => void;
  loadSavedRoadmap: () => Promise<boolean>;
  setActiveMilestoneId: (milestoneId: string | null) => void;
  toggleTask: (taskId: string) => void;
  generateRoadmap: (careerId: string, profile: TraitScoreMap) => void;
};

function cloneRoadmap(roadmap: CareerRoadmap): CareerRoadmap {
  return {
    ...roadmap,
    milestones: roadmap.milestones.map((milestone) => ({
      ...milestone,
      tasks: milestone.tasks.map((task) => ({ ...task })),
    })),
  };
}

function toAppRoadmap(roadmap: GeneratedRoadmap, careerId: string): CareerRoadmap {
  return {
    careerId: roadmap.careerId ?? careerId,
    careerTitle: roadmap.careerTitle,
    milestones: roadmap.milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      tasks: milestone.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed ?? task.status === "completed",
      })),
    })),
  };
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmap: null,
  persistedRoadmapId: null,
  activeMilestoneId: null,
  persistenceError: null,
  aiError: null,
  isPersonalizingWithAi: false,
  loadMockRoadmap: () => {
    const roadmap = cloneRoadmap(mockRoadmap);
    set({ roadmap });

    saveRoadmap({ roadmap: roadmap as unknown as Json }).then((result) => {
      if (result.data?.roadmapId) {
        set({ persistedRoadmapId: result.data.roadmapId });
      } else if (result.error) {
        set({ persistenceError: result.error });
      }
    });
  },
  loadSavedRoadmap: async () => {
    const result = await loadLatestRoadmap();

    if (result.skipped || !result.data) {
      return false;
    }

    if (result.error) {
      set({ persistenceError: result.error });
      return false;
    }

    set({
      persistedRoadmapId: result.data.id,
      roadmap: result.data.roadmap as unknown as CareerRoadmap,
    });

    return true;
  },
  setActiveMilestoneId: (activeMilestoneId) => set({ activeMilestoneId }),
  toggleTask: (taskId) => {
    const persistedRoadmapId = get().persistedRoadmapId;
    const currentRoadmap = get().roadmap;
    const taskContext = currentRoadmap?.milestones.flatMap((milestone) =>
      milestone.tasks
        .filter((task) => task.id === taskId)
        .map((task) => ({
          milestoneId: milestone.id,
          taskId: task.id,
          completed: !task.completed,
        })),
    )[0];

    set((state) => ({
      roadmap: state.roadmap
        ? {
            ...state.roadmap,
            milestones: state.roadmap.milestones.map((milestone) => ({
              ...milestone,
              tasks: milestone.tasks.map((task) => {
                if (task.id !== taskId) {
                  return task;
                }

                return { ...task, completed: !task.completed };
              }),
            })),
          }
        : state.roadmap,
    }));

    if (!currentRoadmap || !taskContext) {
      return;
    }

    saveRoadmapTaskProgress({
      roadmapId: persistedRoadmapId,
      milestoneId: taskContext.milestoneId,
      taskId: taskContext.taskId,
      completed: taskContext.completed,
    }).then((result) => {
      if (result.error) {
        set({ persistenceError: result.error });
      }
    });
  },
  generateRoadmap: (careerId, profile) => {
    const roadmap = toAppRoadmap(generateRoadmapLogic(careerId, profile), careerId);
    set({ roadmap, aiError: null, isPersonalizingWithAi: true });

    saveRoadmap({ roadmap: roadmap as unknown as Json }).then((result) => {
      if (result.data?.roadmapId) {
        set({ persistedRoadmapId: result.data.roadmapId });
      } else if (result.error) {
        set({ persistenceError: result.error });
      }
    });

    personalizeRoadmapWithAi(careerId, profile, roadmap)
      .then((personalizedRoadmap) => {
        if (personalizedRoadmap) {
          set({ roadmap: personalizedRoadmap, isPersonalizingWithAi: false });

          saveRoadmap({ roadmap: personalizedRoadmap as unknown as Json }).then((result) => {
            if (result.data?.roadmapId) {
              set({ persistedRoadmapId: result.data.roadmapId });
            } else if (result.error) {
              set({ persistenceError: result.error });
            }
          });
        } else {
          set({ isPersonalizingWithAi: false });
        }
      })
      .catch(() => {
        set({
          isPersonalizingWithAi: false,
          aiError: "AI roadmap personalization is unavailable, so the deterministic roadmap is shown.",
        });
      });
  }
}));

async function personalizeRoadmapWithAi(careerId: string, profile: TraitScoreMap, templateRoadmap: CareerRoadmap) {
  const response = await fetch("/api/roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      selectedCareer: {
        id: careerId,
        title: templateRoadmap.careerTitle,
      },
      profile,
      templateRoadmap,
      learningStyle: inferLearningStyle(profile),
      motivationStyle: inferMotivationStyle(profile),
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { roadmap?: CareerRoadmap };

  return payload.roadmap ?? null;
}

function inferLearningStyle(profile: TraitScoreMap): string {
  if (profile.technicalAptitude >= 7) {
    return "Learns best by building, testing tools, and understanding how systems work.";
  }

  if (profile.structuredThinking >= 7) {
    return "Learns best through structured steps, examples, and steady progression.";
  }

  if (profile.creativity >= 7) {
    return "Learns best through creative projects and visible outputs.";
  }

  return "Learns best through practical tasks with clear completion criteria.";
}

function inferMotivationStyle(profile: TraitScoreMap): string {
  if (profile.execution >= 7) {
    return "Motivated by visible progress and finished work.";
  }

  if (profile.empathy >= 7 || profile.communication >= 7) {
    return "Motivated by helping people and communicating ideas clearly.";
  }

  if (profile.curiosity >= 7) {
    return "Motivated by exploration and understanding how things connect.";
  }

  return "Motivated by manageable progress and confidence-building wins.";
}
