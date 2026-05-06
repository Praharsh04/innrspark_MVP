import { UserTrait, TraitScoreMap } from "@/types/user";

export type CareerCluster =
  | "Product"
  | "Design"
  | "Software"
  | "Data"
  | "Marketing"
  | "Sales"
  | "HR"
  | "Finance"
  | "Operations"
  | "Entrepreneurship"
  | "Research"
  | "Education"
  | "Content"
  | "Psychology"
  | "Business Strategy";

export type DifficultyLevel = "Low" | "Medium" | "High";

export interface CareerProfile {
  id: string;
  title: string;
  cluster: CareerCluster;
  requiredTraits: Partial<Record<UserTrait, number>>;
  preferredWorkStyle: string;
  fulfillingSkills: string[];
  commonTasks: string[];
  growthPotential: DifficultyLevel;
  difficultyLevel: DifficultyLevel;
  learningCurve: DifficultyLevel;
  possibleChallenges: string[];
}

export interface Recommendation {
  careerId: string;
  title: string;
  cluster: CareerCluster;
  matchScore: number;
  badges: string[];
  reason: string;
  potentialChallenge: string;
  matchedTraits: UserTrait[];
  gapTraits: UserTrait[];
}

export type PsychometricProfile = TraitScoreMap;
