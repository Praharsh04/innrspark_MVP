import type { TraitId } from "./traits";

export type OptionKey = "A" | "B" | "C" | "D";

export type QuestionCategory =
  | "problem_solving"
  | "creativity"
  | "collaboration"
  | "leadership"
  | "work_style"
  | "learning"
  | "technology"
  | "communication"
  | "execution"
  | "values";

export type DifficultyLevel = 1 | 2 | 3;

export type TraitEffects = Partial<Record<TraitId, number>>;

export type AssessmentOption = {
  key: OptionKey;
  text: string;
  traitEffects: TraitEffects;
};

export type AssessmentQuestion = {
  id: string;
  text: string;
  category: QuestionCategory;
  difficultyLevel: DifficultyLevel;
  followUpTags: TraitId[];
  isSeed: boolean;
  options: AssessmentOption[];
};

export type AssessmentAnswer = {
  questionId: string;
  optionKey: OptionKey;
};

export type TraitScore = {
  traitId: TraitId;
  rawScore: number;
  normalizedScore: number;
  confidence: number;
  evidenceCount: number;
};

export type AssessmentScoreResult = {
  traitScores: Record<TraitId, TraitScore>;
  dominantTraits: TraitScore[];
  underExploredTraits: TraitScore[];
  overallConfidence: number;
  answeredCount: number;
};

export type AdaptiveAssessmentState = {
  answers: AssessmentAnswer[];
  nextQuestion: AssessmentQuestion | null;
  isComplete: boolean;
  score: AssessmentScoreResult;
};

export type GeneratedAssessmentProfile = {
  traits: TraitScore[];
  strengths: string[];
  interests: string[];
  workStyle: string;
  motivationStyle: string;
  learningStyle: string;
  confidenceScore: number;
  summary: string;
};
