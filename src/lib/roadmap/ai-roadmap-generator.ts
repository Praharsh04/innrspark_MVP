import { callJsonModel } from "@/lib/ai/client";
import { isJsonObject } from "@/lib/ai/json";
import type { CareerRoadmap, RoadmapMilestone, RoadmapTask, RoadmapTaskStatus, UserPsychometricProfile } from "./types";
import { buildAiRoadmapMessages, aiRoadmapJsonSchema } from "./prompts";

export type AiRoadmapGeneratorInput = {
  selectedCareer: {
    id: string;
    title: string;
  };
  profile: UserPsychometricProfile;
  templateRoadmap: CareerRoadmap;
  learningStyle: string;
  motivationStyle: string;
};

export async function generateAiAssistedRoadmap(input: AiRoadmapGeneratorInput) {
  const fallback = cloneRoadmap(input.templateRoadmap);

  return callJsonModel<CareerRoadmap>({
    messages: buildAiRoadmapMessages(input),
    validate: (value): value is CareerRoadmap => isValidRoadmap(value, input.templateRoadmap, input.selectedCareer),
    fallback,
    temperature: 0.25,
    maxOutputTokens: 3000,
    jsonSchema: {
      name: "career_roadmap",
      description: "Personalized Innrspark roadmap preserving deterministic schema.",
      schema: aiRoadmapJsonSchema,
      strict: true,
    },
  });
}

export function isValidRoadmap(
  value: unknown,
  template: CareerRoadmap,
  selectedCareer: { id: string; title: string },
): value is CareerRoadmap {
  if (!isJsonObject(value)) {
    return false;
  }

  if (
    typeof value.careerId !== "string" ||
    value.careerId !== selectedCareer.id ||
    value.careerTitle !== selectedCareer.title
  ) {
    return false;
  }

  if (!Array.isArray(value.milestones) || value.milestones.length !== template.milestones.length) {
    return false;
  }

  return value.milestones.every((milestone, milestoneIndex) =>
    isValidMilestone(milestone, template.milestones[milestoneIndex]),
  );
}

function isValidMilestone(value: unknown, template: RoadmapMilestone): value is RoadmapMilestone {
  if (!isJsonObject(value)) {
    return false;
  }

  if (
    value.id !== template.id ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    !Array.isArray(value.tasks) ||
    value.tasks.length !== template.tasks.length
  ) {
    return false;
  }

  return value.tasks.every((task, taskIndex) => isValidTask(task, template.tasks[taskIndex]));
}

function isValidTask(value: unknown, template: RoadmapTask): value is RoadmapTask {
  if (!isJsonObject(value)) {
    return false;
  }

  if (value.id !== template.id || typeof value.title !== "string") {
    return false;
  }

  if (
    "completed" in template &&
    template.completed !== undefined &&
    value.completed !== template.completed
  ) {
    return false;
  }

  if ("completed" in value && value.completed !== undefined && typeof value.completed !== "boolean") {
    return false;
  }

  if ("status" in template && template.status !== undefined && value.status !== template.status) {
    return false;
  }

  if ("status" in value && value.status !== undefined && typeof value.status !== "string") {
    return false;
  }

  if ("description" in value && value.description !== undefined && typeof value.description !== "string") {
    return false;
  }

  if ("type" in value && value.type !== undefined && typeof value.type !== "string") {
    return false;
  }

  if ("estimatedHours" in value && value.estimatedHours !== undefined && typeof value.estimatedHours !== "number") {
    return false;
  }

  if ("instructions" in value && value.instructions !== undefined && typeof value.instructions !== "string") {
    return false;
  }

  if (
    "completionCriteria" in value &&
    value.completionCriteria !== undefined &&
    typeof value.completionCriteria !== "string"
  ) {
    return false;
  }

  const status = typeof value.status === "string" && isRoadmapTaskStatus(value.status) ? value.status : undefined;

  return !containsUnsafePromise({
    id: value.id,
    title: value.title,
    description: typeof value.description === "string" ? value.description : undefined,
    completed: typeof value.completed === "boolean" ? value.completed : undefined,
    status,
    type: typeof value.type === "string" ? value.type : undefined,
    estimatedHours: typeof value.estimatedHours === "number" ? value.estimatedHours : undefined,
    instructions: typeof value.instructions === "string" ? value.instructions : undefined,
    completionCriteria: typeof value.completionCriteria === "string" ? value.completionCriteria : undefined,
  });
}

function isRoadmapTaskStatus(value: string): value is RoadmapTaskStatus {
  return value === "not_started" || value === "in_progress" || value === "completed";
}

function containsUnsafePromise(task: RoadmapTask): boolean {
  const text = [task.title, task.description, task.instructions, task.completionCriteria]
    .filter((value): value is string => typeof value === "string")
    .join(" ");

  return /\b(guaranteed|guarantee|job offer|six[- ]figure|become an expert overnight|master .* in \d+ days|fake link|http:\/\/|https:\/\/)\b/i.test(
    text,
  );
}

function cloneRoadmap(roadmap: CareerRoadmap): CareerRoadmap {
  return {
    ...roadmap,
    milestones: roadmap.milestones.map((milestone) => ({
      ...milestone,
      tasks: milestone.tasks.map((task) => ({ ...task })),
    })),
  };
}
