import { seedTraitScores, traitIds } from "./traits";
import type { AssessmentAnswer, AssessmentQuestion, AssessmentScoreResult, TraitScore } from "./types";
import { questionBank } from "./question-bank";

const CONFIDENCE_EVIDENCE_TARGET = 6;
const CONFIDENCE_MAGNITUDE_TARGET = 12;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function scoreAssessment(
  answers: AssessmentAnswer[],
  questions: AssessmentQuestion[] = questionBank,
): AssessmentScoreResult {
  const rawScores = seedTraitScores();
  const evidenceCounts = seedTraitScores();
  const evidenceMagnitude = seedTraitScores();
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    const option = question?.options.find((candidate) => candidate.key === answer.optionKey);

    if (!option) {
      continue;
    }

    for (const [traitId, effect] of Object.entries(option.traitEffects)) {
      const typedTraitId = traitId as keyof typeof rawScores;
      const safeEffect = effect ?? 0;
      rawScores[typedTraitId] += safeEffect;
      evidenceCounts[typedTraitId] += 1;
      evidenceMagnitude[typedTraitId] += Math.abs(safeEffect);
    }
  }

  const maxRawScore = Math.max(1, ...traitIds.map((traitId) => rawScores[traitId]));

  const traitScores = traitIds.reduce(
    (scores, traitId) => {
      const evidenceScore = clamp01(evidenceCounts[traitId] / CONFIDENCE_EVIDENCE_TARGET);
      const magnitudeScore = clamp01(evidenceMagnitude[traitId] / CONFIDENCE_MAGNITUDE_TARGET);
      const confidence = clamp01(evidenceScore * 0.7 + magnitudeScore * 0.3);

      scores[traitId] = {
        traitId,
        rawScore: rawScores[traitId],
        normalizedScore: clamp01(rawScores[traitId] / maxRawScore),
        confidence,
        evidenceCount: evidenceCounts[traitId],
      };

      return scores;
    },
    {} as Record<(typeof traitIds)[number], TraitScore>,
  );

  const sortedTraits = traitIds.map((traitId) => traitScores[traitId]).sort(compareTraitScores);
  const dominantTraits = sortedTraits.filter((score) => score.normalizedScore >= 0.55).slice(0, 5);
  const underExploredTraits = [...sortedTraits]
    .sort((a, b) => a.confidence - b.confidence || b.normalizedScore - a.normalizedScore)
    .filter((score) => score.confidence < 0.48)
    .slice(0, 5);
  const overallConfidence =
    traitIds.reduce((total, traitId) => total + traitScores[traitId].confidence, 0) / traitIds.length;

  return {
    traitScores,
    dominantTraits,
    underExploredTraits,
    overallConfidence: clamp01(overallConfidence),
    answeredCount: answers.length,
  };
}

function compareTraitScores(a: TraitScore, b: TraitScore) {
  return b.normalizedScore - a.normalizedScore || b.confidence - a.confidence || a.traitId.localeCompare(b.traitId);
}
