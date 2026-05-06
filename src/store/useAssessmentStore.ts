import { create } from "zustand";
import { AssessmentAnswer, AssessmentOptionKey } from "@/types/assessment";
import { TraitScoreMap } from "@/types/user";
import { scoreAssessment } from "@/lib/assessment/scoring";
import { shouldCompleteAssessment } from "@/lib/assessment/adaptive-engine";
import { questionBank } from "@/lib/assessment/question-bank";
import { getRecommendations } from "@/lib/recommendations/matcher";
import {
  createAssessmentRow,
  saveAssessmentAnswer,
  saveCareerRecommendations,
  savePsychometricProfile,
} from "@/lib/supabase/persistence";
import type { Json } from "@/lib/supabase";

type AssessmentState = {
  currentQuestionIndex: number;
  persistedAssessmentId: string | null;
  answers: AssessmentAnswer[];
  isComplete: boolean;
  psychometricProfile: TraitScoreMap | null;
  persistenceError: string | null;
  
  // Actions
  startAssessment: () => void;
  answerQuestion: (questionId: string, optionKey: AssessmentOptionKey) => void;
  resetAssessment: () => void;
  completeAssessment: () => void;
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentQuestionIndex: 0,
  persistedAssessmentId: null,
  answers: [],
  isComplete: false,
  psychometricProfile: null,
  persistenceError: null,

  startAssessment: () => {
    set({
      currentQuestionIndex: 0,
      persistedAssessmentId: null,
      answers: [],
      isComplete: false,
      psychometricProfile: null,
      persistenceError: null,
    });

    createAssessmentRow().then((result) => {
      if (result.data?.assessmentId) {
        set({ persistedAssessmentId: result.data.assessmentId });
      } else if (result.error) {
        set({ persistenceError: result.error });
      }
    });
  },

  answerQuestion: (questionId, optionKey) => {
    const { answers } = get();
    
    // Update or add answer
    const existingAnswerIndex = answers.findIndex((a) => a.questionId === questionId);
    const newAnswers = [...answers];
    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex] = { questionId, optionKey };
    } else {
      newAnswers.push({ questionId, optionKey });
    }
    
    set({ answers: newAnswers });

    const selectedQuestion = questionBank.find((question) => question.id === questionId);
    const selectedOption = selectedQuestion?.options.find((option) => option.key === optionKey);

    saveAssessmentAnswer({
      assessmentId: get().persistedAssessmentId,
      questionId,
      optionKey,
      traitEffects: selectedOption?.traitEffects ?? {},
    }).then((result) => {
      if (result.error) {
        set({ persistenceError: result.error });
      }
    });
    
    // In adaptive mode, we check if we should end
    if (shouldCompleteAssessment(newAnswers)) {
      get().completeAssessment();
    }
  },

  completeAssessment: () => {
    const { answers } = get();
    const result = scoreAssessment(answers);
    
    // Convert assessment traits to TraitScoreMap
    const scores = toLegacyTraitScoreMap(result);

    set({ isComplete: true, psychometricProfile: scores });

    savePsychometricProfile({
      assessmentId: get().persistedAssessmentId,
      profile: result as unknown as Json,
      confidenceScore: result.overallConfidence,
    }).then((saveResult) => {
      if (saveResult.error) {
        set({ persistenceError: saveResult.error });
      }
    });

    const recommendations = getRecommendations(scores);

    saveCareerRecommendations({
      assessmentId: get().persistedAssessmentId,
      recommendations: recommendations as unknown as Json,
    }).then((saveResult) => {
      if (saveResult.error) {
        set({ persistenceError: saveResult.error });
      }
    });
  },

  resetAssessment: () => {
    set({
      currentQuestionIndex: 0,
      persistedAssessmentId: null,
      answers: [],
      isComplete: false,
      psychometricProfile: null,
      persistenceError: null,
    });
  },
}));

// Helper to set next question index
export const nextQuestion = () => {
  useAssessmentStore.setState((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1
  }));
};

function toLegacyTraitScoreMap(result: ReturnType<typeof scoreAssessment>): TraitScoreMap {
  return {
    creativity: getScore(result, "creative_expression"),
    structuredThinking: getScore(result, "structured_thinking"),
    technicalAptitude: getScore(result, "technical_curiosity"),
    empathy: getScore(result, "empathy"),
    analysis: getScore(result, "analytical_thinking"),
    communication: getScore(result, "communication_strength"),
    execution: getScore(result, "execution_discipline"),
    curiosity: Math.max(getScore(result, "curiosity"), getScore(result, "learning_agility")),
  };
}

function getScore(result: ReturnType<typeof scoreAssessment>, traitId: keyof typeof result.traitScores): number {
  return Math.round((result.traitScores[traitId]?.normalizedScore ?? 0) * 10);
}
