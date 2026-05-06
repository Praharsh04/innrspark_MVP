import type { UserTrait } from "./user";

export type AssessmentOptionKey = "A" | "B" | "C" | "D";

export type TraitEffects = Partial<Record<UserTrait, number>>;

export type AssessmentOption = {
  key: AssessmentOptionKey;
  text: string;
  traitEffects: TraitEffects;
};

export type AssessmentQuestion = {
  id: string;
  text: string;
  options: AssessmentOption[];
};

export type AssessmentAnswer = {
  questionId: string;
  optionKey: AssessmentOptionKey;
};
