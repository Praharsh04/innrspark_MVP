import type { JsonObject } from "@/lib/ai/json";
import type { CareerRoadmap, UserPsychometricProfile } from "./types";

export type AiRoadmapPromptInput = {
  selectedCareer: {
    id: string;
    title: string;
  };
  profile: UserPsychometricProfile;
  templateRoadmap: CareerRoadmap;
  learningStyle: string;
  motivationStyle: string;
};

export function buildAiRoadmapMessages(input: AiRoadmapPromptInput) {
  return [
    {
      role: "system" as const,
      content:
        "You personalize career roadmaps for Innrspark. Return JSON only. Preserve the provided roadmap schema exactly. Do not add fake links, credentials, salary promises, guaranteed outcomes, or unrealistic timelines. Keep all task ids and milestone ids stable. Personalize wording, pacing, instructions, and completion criteria only.",
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        task: "Personalize this deterministic roadmap template.",
        selectedCareer: input.selectedCareer,
        psychometricProfile: input.profile,
        learningStyle: input.learningStyle,
        motivationStyle: input.motivationStyle,
        schemaRules: {
          careerId: "must equal selectedCareer.id",
          careerTitle: "must equal selectedCareer.title",
          milestones: "same count and ids as template",
          tasks: "same count and ids as template",
          completed: "preserve boolean completion values from template",
          optionalTaskFields: ["type", "estimatedHours", "instructions", "completionCriteria"],
          status: "preserve status values from template when present",
        },
        personalizationRules: [
          "Make task wording practical and specific.",
          "Adjust pacing gently based on learning style.",
          "Use motivation style to make instructions feel relevant.",
          "Include completionCriteria for every task.",
          "Do not include URLs unless they were already in the template.",
          "Do not promise jobs, income, admissions, promotions, or guaranteed mastery.",
        ],
        templateRoadmap: input.templateRoadmap,
      }),
    },
  ];
}

export const aiRoadmapJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["careerId", "careerTitle", "milestones"],
  properties: {
    careerId: { type: "string" },
    careerTitle: { type: "string" },
    milestones: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description", "tasks"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          tasks: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "title"],
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                completed: { type: "boolean" },
                status: { type: "string" },
                type: { type: "string" },
                estimatedHours: { type: "number" },
                instructions: { type: "string" },
                completionCriteria: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} satisfies JsonObject;
