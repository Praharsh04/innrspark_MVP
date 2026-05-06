import { traitLabels } from "./traits";
import type { AssessmentAnswer, GeneratedAssessmentProfile, TraitScore } from "./types";
import { scoreAssessment } from "./scoring";

export function generateAssessmentProfile(answers: AssessmentAnswer[]): GeneratedAssessmentProfile {
  const score = scoreAssessment(answers);
  const traits = Object.values(score.traitScores).sort(compareTraitScores);
  const topTraits = traits.slice(0, 5);
  const topTraitIds = new Set(topTraits.map((trait) => trait.traitId));

  return {
    traits,
    strengths: getStrengths(topTraits),
    interests: getInterests(topTraits),
    workStyle: getWorkStyle(topTraitIds),
    motivationStyle: getMotivationStyle(topTraitIds),
    learningStyle: getLearningStyle(topTraitIds),
    confidenceScore: score.overallConfidence,
    summary: getSummary(topTraits, score.overallConfidence),
  };
}

function getStrengths(topTraits: TraitScore[]): string[] {
  return topTraits.slice(0, 4).map((trait) => {
    const label = traitLabels[trait.traitId];
    return `${label} shows up as a clear strength.`;
  });
}

function getInterests(topTraits: TraitScore[]): string[] {
  const interests = new Set<string>();

  for (const trait of topTraits) {
    if (trait.traitId === "technical_curiosity") interests.add("Digital products and technical systems");
    if (trait.traitId === "creative_expression") interests.add("Design, storytelling, and original ideas");
    if (trait.traitId === "analytical_thinking") interests.add("Data, patterns, and decision-making");
    if (trait.traitId === "empathy" || trait.traitId === "people_orientation") interests.add("User needs and human behavior");
    if (trait.traitId === "leadership_drive") interests.add("Team direction and ownership");
    if (trait.traitId === "execution_discipline") interests.add("Shipping useful outcomes");
  }

  if (interests.size === 0) {
    interests.add("Exploring broad career possibilities");
  }

  return [...interests].slice(0, 5);
}

function getWorkStyle(topTraitIds: Set<string>): string {
  if (topTraitIds.has("autonomy_preference") && topTraitIds.has("execution_discipline")) {
    return "Independent ownership with clear goals and visible outcomes.";
  }

  if (topTraitIds.has("people_orientation") || topTraitIds.has("communication_strength")) {
    return "Collaborative work with frequent alignment and shared context.";
  }

  if (topTraitIds.has("structured_thinking") || topTraitIds.has("detail_orientation")) {
    return "Organized work with clear systems, standards, and checkpoints.";
  }

  return "Flexible work that balances exploration with practical next steps.";
}

function getMotivationStyle(topTraitIds: Set<string>): string {
  if (topTraitIds.has("leadership_drive")) {
    return "Motivated by responsibility, direction-setting, and meaningful ownership.";
  }

  if (topTraitIds.has("creative_expression")) {
    return "Motivated by originality, expression, and making ideas feel tangible.";
  }

  if (topTraitIds.has("empathy") || topTraitIds.has("people_orientation")) {
    return "Motivated by helping people feel understood and supported.";
  }

  return "Motivated by progress, mastery, and seeing effort turn into results.";
}

function getLearningStyle(topTraitIds: Set<string>): string {
  if (topTraitIds.has("learning_agility") || topTraitIds.has("risk_appetite")) {
    return "Learns best through experiments, quick feedback, and iteration.";
  }

  if (topTraitIds.has("technical_curiosity")) {
    return "Learns best by understanding systems deeply and building with tools.";
  }

  if (topTraitIds.has("structured_thinking")) {
    return "Learns best through structured plans, examples, and steady progression.";
  }

  return "Learns best through a mix of guided examples and hands-on practice.";
}

function getSummary(topTraits: TraitScore[], confidence: number): string {
  const labels = topTraits
    .slice(0, 3)
    .map((trait) => traitLabels[trait.traitId])
    .join(", ");

  return `This profile currently points toward ${labels}. Confidence is ${Math.round(
    confidence * 100,
  )}%, based only on deterministic assessment scoring.`;
}

function compareTraitScores(a: TraitScore, b: TraitScore) {
  return b.normalizedScore - a.normalizedScore || b.confidence - a.confidence || a.traitId.localeCompare(b.traitId);
}
