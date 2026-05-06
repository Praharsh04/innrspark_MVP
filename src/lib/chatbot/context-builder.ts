import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase";
import type {
  ChatbotContext,
  ChatbotMessage,
  ChatbotRoadmapSummary,
  ChatbotTaskSummary,
} from "./types";

type Client = SupabaseClient<Database>;

export async function buildChatbotContext(supabase: Client, userId: string): Promise<ChatbotContext | null> {
  const [
    profileResult,
    psychometricResult,
    selectedCareerResult,
    roadmapResult,
    chatHistoryResult,
  ] = await Promise.all([
    supabase.from("profiles").select("profile").eq("user_id", userId).maybeSingle(),
    supabase
      .from("psychometric_profiles")
      .select("profile")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("selected_careers")
      .select("career_id, career_title, selection")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("roadmaps")
      .select("id, roadmap")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const queryError =
    profileResult.error ??
    psychometricResult.error ??
    selectedCareerResult.error ??
    roadmapResult.error ??
    chatHistoryResult.error;

  if (queryError) {
    throw queryError;
  }

  if (roadmapResult.error) {
    throw roadmapResult.error;
  }

  if (!roadmapResult.data) {
    return null;
  }

  const progressResult = await supabase
    .from("roadmap_progress")
    .select("task_id, completed")
    .eq("user_id", userId)
    .eq("roadmap_id", roadmapResult.data.id);

  if (progressResult.error) {
    throw progressResult.error;
  }

  const progressByTaskId = new Map((progressResult.data ?? []).map((row) => [row.task_id, row.completed]));
  const tasks = extractTasks(roadmapResult.data.roadmap, progressByTaskId);
  const completedTasks = tasks.filter((task) => task.completed);
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const currentMilestone = findCurrentMilestone(roadmapResult.data.roadmap, incompleteTasks[0]?.milestoneId);

  return {
    userProfile: profileResult.data?.profile ?? null,
    psychometricProfile: psychometricResult.data?.profile ?? null,
    selectedCareer: selectedCareerResult.data
      ? {
          id: selectedCareerResult.data.career_id,
          title: selectedCareerResult.data.career_title,
          selection: selectedCareerResult.data.selection,
        }
      : null,
    roadmapSummary: buildRoadmapSummary(roadmapResult.data.id, roadmapResult.data.roadmap, tasks, completedTasks),
    completedTasks,
    incompleteTasks,
    currentMilestone,
    recentChatHistory: mapChatHistory(chatHistoryResult.data ?? []),
  };
}

function buildRoadmapSummary(
  roadmapId: string,
  roadmap: Json,
  tasks: ChatbotTaskSummary[],
  completedTasks: ChatbotTaskSummary[],
): ChatbotRoadmapSummary {
  const milestones = readField(roadmap, "milestones");

  return {
    id: roadmapId,
    careerTitle: readStringField(roadmap, "careerTitle") ?? "Selected career",
    milestoneCount: Array.isArray(milestones) ? milestones.length : 0,
    taskCount: tasks.length,
    completedTaskCount: completedTasks.length,
  };
}

function extractTasks(roadmap: Json, progressByTaskId: Map<string, boolean>): ChatbotTaskSummary[] {
  const milestones = readField(roadmap, "milestones");

  if (!Array.isArray(milestones)) {
    return [];
  }

  return milestones.flatMap((milestone) => {
    if (!isRecord(milestone)) {
      return [];
    }

    const milestoneId = readStringField(milestone, "id") ?? "milestone";
    const milestoneTitle = readStringField(milestone, "title") ?? "Milestone";
    const tasks = milestone.tasks;

    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks.flatMap((task) => {
      if (!isRecord(task)) {
        return [];
      }

      const id = readStringField(task, "id");
      const title = readStringField(task, "title");

      if (!id || !title) {
        return [];
      }

      return {
        id,
        title,
        milestoneId,
        milestoneTitle,
        completed: progressByTaskId.get(id) ?? Boolean(task.completed),
      };
    });
  });
}

function findCurrentMilestone(roadmap: Json, milestoneId?: string) {
  if (!milestoneId) {
    return null;
  }

  const milestones = readField(roadmap, "milestones");

  if (!Array.isArray(milestones)) {
    return null;
  }

  const milestone = milestones.find((item) => isRecord(item) && item.id === milestoneId);

  if (!isRecord(milestone)) {
    return null;
  }

  return {
    id: readStringField(milestone, "id") ?? milestoneId,
    title: readStringField(milestone, "title") ?? "Current milestone",
    description: readStringField(milestone, "description") ?? "",
  };
}

function mapChatHistory(rows: { id: string; role: string; content: string; created_at: string }[]): ChatbotMessage[] {
  return [...rows]
    .reverse()
    .map((row) => ({
      id: row.id,
      role: row.role === "assistant" || row.role === "system" ? row.role : "user",
      content: row.content,
      createdAt: row.created_at,
    }));
}

function readField(value: Json | Record<string, unknown>, key: string): unknown {
  return isRecord(value) ? value[key] : undefined;
}

function readStringField(value: Json | Record<string, unknown>, key: string): string | null {
  const field = readField(value, key);
  return typeof field === "string" ? field : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
