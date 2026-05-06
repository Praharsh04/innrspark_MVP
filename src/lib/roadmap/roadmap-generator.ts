import { CareerRoadmap, UserPsychometricProfile, RoadmapTask } from "./types";
import { ROADMAP_TEMPLATES } from "./roadmap-templates";

/**
 * Deterministically generates a personalized roadmap based on a template
 * and the user's psychometric profile.
 */
export function generateRoadmap(
  careerId: string,
  profile: UserPsychometricProfile
): CareerRoadmap {
  // 1. Find template or fallback
  const template = ROADMAP_TEMPLATES[careerId] || ROADMAP_TEMPLATES["fallback"];

  // 2. Clone template to avoid mutations
  const roadmap: CareerRoadmap = JSON.parse(JSON.stringify(template));
  roadmap.careerId = careerId;

  // 3. Apply light personalization
  roadmap.milestones.forEach((milestone) => {
    milestone.tasks.forEach((task) => {
      personalizeTask(task, profile);
      task.completed = task.completed ?? task.status === "completed";
    });
  });

  return roadmap;
}

/**
 * Adjusts task wording and estimates based on psychometric profile traits.
 */
function personalizeTask(task: RoadmapTask, profile: UserPsychometricProfile): void {
  // Personalize based on dominant traits
  const traits = Object.entries(profile).sort((a, b) => b[1] - a[1]);
  const primaryTrait = traits[0][0];

  if (primaryTrait === "creativity" && task.type === "project") {
    task.instructions += " Focus on unique visual elements and innovative solutions.";
  } else if (primaryTrait === "technicalAptitude" && task.type === "learning") {
    task.instructions += " Deep dive into the underlying architecture and performance.";
    task.estimatedHours = Math.max(1, Math.floor((task.estimatedHours || 0) * 0.8)); // Faster learning for technical
  } else if (primaryTrait === "empathy") {
    task.instructions += " Consider the user impact and emotional journey.";
  } else if (primaryTrait === "analysis") {
    task.instructions += " Document your assumptions and data-driven insights.";
  } else if (primaryTrait === "structuredThinking") {
    task.instructions += " Create a clear documentation or process map for this.";
  }
}
