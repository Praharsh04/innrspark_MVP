import { TraitScoreMap } from "@/types/user";

export type RoadmapTaskStatus = "not_started" | "in_progress" | "completed";

export type RoadmapTask = {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  status?: RoadmapTaskStatus;
  // Extra fields used by generator logic but not in UI type yet
  type?: string;
  estimatedHours?: number;
  instructions?: string;
  completionCriteria?: string;
};

export type RoadmapMilestone = {
  id: string;
  title: string;
  description: string;
  order?: number;
  estimatedWeeks?: number;
  tasks: RoadmapTask[];
};

export type CareerRoadmap = {
  id?: string;
  careerId?: string;
  careerTitle: string;
  targetLevel?: string;
  durationMonths?: number;
  milestones: RoadmapMilestone[];
};

export type UserPsychometricProfile = TraitScoreMap;
