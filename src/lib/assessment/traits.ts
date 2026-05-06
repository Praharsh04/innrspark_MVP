export const traitIds = [
  "analytical_thinking",
  "creative_expression",
  "people_orientation",
  "leadership_drive",
  "detail_orientation",
  "autonomy_preference",
  "risk_appetite",
  "learning_agility",
  "technical_curiosity",
  "empathy",
  "communication_strength",
  "execution_discipline",
  "structured_thinking",
  "curiosity",
] as const;

export type TraitId = (typeof traitIds)[number];

export const traitLabels: Record<TraitId, string> = {
  analytical_thinking: "Analytical Thinking",
  creative_expression: "Creative Expression",
  people_orientation: "People Orientation",
  leadership_drive: "Leadership Drive",
  detail_orientation: "Detail Orientation",
  autonomy_preference: "Autonomy Preference",
  risk_appetite: "Risk Appetite",
  learning_agility: "Learning Agility",
  technical_curiosity: "Technical Curiosity",
  empathy: "Empathy",
  communication_strength: "Communication Strength",
  execution_discipline: "Execution Discipline",
  structured_thinking: "Structured Thinking",
  curiosity: "Curiosity",
};

export const seedTraitScores = (): Record<TraitId, number> =>
  traitIds.reduce(
    (scores, traitId) => ({
      ...scores,
      [traitId]: 0,
    }),
    {} as Record<TraitId, number>,
  );
