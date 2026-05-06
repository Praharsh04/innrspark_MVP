export type CareerId = string;

export type CareerRecommendation = {
  id: CareerId;
  title: string;
  matchScore: number;
  badges: string[];
  reason: string;
  potentialChallenge: string;
  hook?: string;
  description?: string;
  whyFit?: string;
  starterProject?: string;
  firstStep?: string;
};
