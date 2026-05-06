import { getSupabaseBrowserClient } from "./client";
import type { Json } from "./types";

export type PersistenceResult<T = null> = {
  data: T | null;
  error: string | null;
  skipped: boolean;
};

export type SupabaseUserProfile = {
  id: string;
  email: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};

const skipped = <T = never>(): PersistenceResult<T> => ({
  data: null,
  error: null,
  skipped: true,
});

const failed = <T = never>(error: unknown): PersistenceResult<T> => ({
  data: null,
  error: error instanceof Error ? error.message : "Something went wrong while saving your progress.",
  skipped: false,
});

const ok = <T>(data: T | null): PersistenceResult<T> => ({
  data,
  error: null,
  skipped: false,
});

export function isSupabaseAvailable(): boolean {
  return getSupabaseBrowserClient() !== null;
}

export async function signInWithGoogle(redirectTo: string): Promise<PersistenceResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return skipped();
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  return error ? failed(error) : ok(null);
}

export async function signOut(): Promise<PersistenceResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return skipped();
  }

  const { error } = await supabase.auth.signOut();
  return error ? failed(error) : ok(null);
}

export async function getCurrentUserProfile(): Promise<PersistenceResult<SupabaseUserProfile>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return skipped();
  }

  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error) {
    return failed(error);
  }

  if (!user) {
    return ok<SupabaseUserProfile>(null);
  }

  return ok({
    id: user.id,
    email: user.email ?? null,
    name: readString(user.user_metadata?.full_name) ?? readString(user.user_metadata?.name),
    avatarUrl: readString(user.user_metadata?.avatar_url),
  });
}

export async function ensureProfile(): Promise<PersistenceResult<SupabaseUserProfile>> {
  const userResult = await getCurrentUserProfile();

  if (userResult.skipped || userResult.error || !userResult.data) {
    return userResult;
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return skipped<SupabaseUserProfile>();
  }

  const profile = userResult.data;
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: profile.id,
      display_name: profile.name ?? null,
      avatar_url: profile.avatarUrl ?? null,
      profile: {
        email: profile.email,
        provider: "google",
      },
    },
    { onConflict: "user_id" },
  );

  return error ? failed(error) : ok(profile);
}

export async function createAssessmentRow(): Promise<PersistenceResult<{ assessmentId: string }>> {
  const context = await getUserPersistenceContext();

  if (!context) {
    return skipped<{ assessmentId: string }>();
  }

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("assessments")
    .insert({ user_id: userId, status: "started" })
    .select("id")
    .single();

  return error ? failed(error) : ok({ assessmentId: data.id });
}

export async function saveAssessmentAnswer(params: {
  assessmentId: string | null;
  questionId: string;
  optionKey: string;
  traitEffects?: Json;
}): Promise<PersistenceResult> {
  const context = await getUserPersistenceContext();

  if (!context || !params.assessmentId) {
    return skipped();
  }

  const { supabase, userId } = context;
  const { error } = await supabase.from("assessment_answers").upsert(
    {
      user_id: userId,
      assessment_id: params.assessmentId,
      question_id: params.questionId,
      option_key: params.optionKey,
      trait_effects: params.traitEffects ?? {},
    },
    { onConflict: "assessment_id,question_id" },
  );

  return error ? failed(error) : ok(null);
}

export async function savePsychometricProfile(params: {
  assessmentId: string | null;
  profile: Json;
  confidenceScore?: number | null;
}): Promise<PersistenceResult> {
  const context = await getUserPersistenceContext();

  if (!context || !params.assessmentId) {
    return skipped();
  }

  const { supabase, userId } = context;
  const { error } = await supabase.from("psychometric_profiles").upsert(
    {
      user_id: userId,
      assessment_id: params.assessmentId,
      profile: params.profile,
      confidence_score: params.confidenceScore ?? null,
    },
    { onConflict: "assessment_id" },
  );

  await supabase
    .from("assessments")
    .update({ status: "completed", completed_at: new Date().toISOString(), score_summary: params.profile })
    .eq("id", params.assessmentId)
    .eq("user_id", userId);

  return error ? failed(error) : ok(null);
}

export async function saveCareerRecommendations(params: {
  assessmentId: string | null;
  recommendations: Json;
}): Promise<PersistenceResult<{ recommendationSetId: string }>> {
  const context = await getUserPersistenceContext();

  if (!context) {
    return skipped<{ recommendationSetId: string }>();
  }

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("career_recommendations")
    .insert({
      user_id: userId,
      assessment_id: params.assessmentId,
      recommendations: params.recommendations,
    })
    .select("id")
    .single();

  return error ? failed(error) : ok({ recommendationSetId: data.id });
}

export async function saveSelectedCareer(params: {
  careerId: string;
  careerTitle: string;
  careerRecommendationId?: string | null;
  selection?: Json;
}): Promise<PersistenceResult<{ selectedCareerId: string }>> {
  const context = await getUserPersistenceContext();

  if (!context) {
    return skipped<{ selectedCareerId: string }>();
  }

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("selected_careers")
    .insert({
      user_id: userId,
      career_recommendation_id: params.careerRecommendationId ?? null,
      career_id: params.careerId,
      career_title: params.careerTitle,
      selection: params.selection ?? {},
    })
    .select("id")
    .single();

  return error ? failed(error) : ok({ selectedCareerId: data.id });
}

export async function saveRoadmap(params: {
  roadmap: Json;
  selectedCareerId?: string | null;
}): Promise<PersistenceResult<{ roadmapId: string }>> {
  const context = await getUserPersistenceContext();

  if (!context) {
    return skipped<{ roadmapId: string }>();
  }

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("roadmaps")
    .insert({
      user_id: userId,
      selected_career_id: params.selectedCareerId ?? null,
      roadmap: params.roadmap,
    })
    .select("id")
    .single();

  return error ? failed(error) : ok({ roadmapId: data.id });
}

export async function loadLatestRoadmap(): Promise<PersistenceResult<{ id: string; roadmap: Json }>> {
  const context = await getUserPersistenceContext();

  if (!context) {
    return skipped<{ id: string; roadmap: Json }>();
  }

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("roadmaps")
    .select("id, roadmap")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return failed(error);
  }

  if (!data) {
    return ok<{ id: string; roadmap: Json }>(null);
  }

  const { data: progressRows, error: progressError } = await supabase
    .from("roadmap_progress")
    .select("task_id, completed")
    .eq("roadmap_id", data.id)
    .eq("user_id", userId);

  if (progressError) {
    return failed(progressError);
  }

  return ok({
    id: data.id,
    roadmap: applyProgressToRoadmap(data.roadmap, progressRows ?? []),
  });
}

export async function saveRoadmapTaskProgress(params: {
  roadmapId: string | null;
  milestoneId: string;
  taskId: string;
  completed: boolean;
  progress?: Json;
}): Promise<PersistenceResult> {
  const context = await getUserPersistenceContext();

  if (!context || !params.roadmapId) {
    return skipped();
  }

  const { supabase, userId } = context;
  const { error } = await supabase.from("roadmap_progress").upsert(
    {
      user_id: userId,
      roadmap_id: params.roadmapId,
      milestone_id: params.milestoneId,
      task_id: params.taskId,
      completed: params.completed,
      completed_at: params.completed ? new Date().toISOString() : null,
      progress: params.progress ?? {},
    },
    { onConflict: "roadmap_id,task_id" },
  );

  return error ? failed(error) : ok(null);
}

async function getUserPersistenceContext() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return null;
  }

  const userResult = await ensureProfile();

  if (userResult.error || !userResult.data) {
    return null;
  }

  return {
    supabase,
    userId: userResult.data.id,
  };
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function applyProgressToRoadmap(roadmap: Json, progressRows: { task_id: string; completed: boolean }[]): Json {
  if (!isRecord(roadmap) || !Array.isArray(roadmap.milestones)) {
    return roadmap;
  }

  const progressByTaskId = new Map(progressRows.map((row) => [row.task_id, row.completed]));

  return {
    ...roadmap,
    milestones: roadmap.milestones.map((milestone) => {
      if (!isRecord(milestone) || !Array.isArray(milestone.tasks)) {
        return milestone;
      }

      return {
        ...milestone,
        tasks: milestone.tasks.map((task) => {
          if (!isRecord(task) || typeof task.id !== "string" || !progressByTaskId.has(task.id)) {
            return task;
          }

          return {
            ...task,
            completed: progressByTaskId.get(task.id) ?? false,
          };
        }),
      };
    }),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
