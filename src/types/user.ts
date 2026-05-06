export type AuthProvider = "google" | "email";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: AuthProvider;
  selectedCareerId?: string;
  completedTaskIds: string[];
  createdAt: string;
};

export type UserTrait =
  | "creativity"
  | "structuredThinking"
  | "technicalAptitude"
  | "empathy"
  | "analysis"
  | "communication"
  | "execution"
  | "curiosity";

export type TraitScoreMap = Record<UserTrait, number>;
