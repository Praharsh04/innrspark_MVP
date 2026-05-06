import { questionBank, seedQuestions } from "./question-bank";
import { scoreAssessment } from "./scoring";
import type { AdaptiveAssessmentState, AssessmentAnswer, AssessmentQuestion } from "./types";

export const MIN_ASSESSMENT_QUESTIONS = 20;
export const MAX_ASSESSMENT_QUESTIONS = 45;
export const COMPLETION_CONFIDENCE_THRESHOLD = 0.78;

export function shouldCompleteAssessment(answers: AssessmentAnswer[]): boolean {
  if (answers.length >= MAX_ASSESSMENT_QUESTIONS) {
    return true;
  }

  if (answers.length < MIN_ASSESSMENT_QUESTIONS) {
    return false;
  }

  return scoreAssessment(answers).overallConfidence >= COMPLETION_CONFIDENCE_THRESHOLD;
}

export function getNextQuestion(
  answers: AssessmentAnswer[],
  questions: AssessmentQuestion[] = questionBank,
): AssessmentQuestion | null {
  if (shouldCompleteAssessment(answers)) {
    return null;
  }

  const answeredIds = new Set(answers.map((answer) => answer.questionId));

  if (answers.length < seedQuestions.length) {
    return seedQuestions.find((question) => !answeredIds.has(question.id)) ?? null;
  }

  const score = scoreAssessment(answers, questions);
  const underExploredTraitIds = score.underExploredTraits.map((trait) => trait.traitId);
  const candidates = questions.filter((question) => !question.isSeed && !answeredIds.has(question.id));

  if (candidates.length === 0) {
    return null;
  }

  return [...candidates].sort((a, b) => {
    const aPriority = getQuestionPriority(a, underExploredTraitIds);
    const bPriority = getQuestionPriority(b, underExploredTraitIds);

    return bPriority - aPriority || a.difficultyLevel - b.difficultyLevel || a.id.localeCompare(b.id);
  })[0];
}

export function getAdaptiveAssessmentState(answers: AssessmentAnswer[]): AdaptiveAssessmentState {
  const score = scoreAssessment(answers);
  const isComplete = shouldCompleteAssessment(answers);

  return {
    answers,
    score,
    isComplete,
    nextQuestion: isComplete ? null : getNextQuestion(answers),
  };
}

function getQuestionPriority(question: AssessmentQuestion, underExploredTraitIds: string[]): number {
  const tagCoverage = question.followUpTags.reduce(
    (total, tag) => total + (underExploredTraitIds.includes(tag) ? 3 : 0),
    0,
  );
  const broadness = question.followUpTags.length * 0.1;
  const difficultyWeight = question.difficultyLevel === 2 ? 0.2 : 0;

  return tagCoverage + broadness + difficultyWeight;
}
