create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'started' check (status in ('started', 'in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_id text not null,
  option_key text not null check (option_key in ('A', 'B', 'C', 'D')),
  trait_effects jsonb not null default '{}'::jsonb,
  answered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (assessment_id, question_id)
);

create table public.psychometric_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  confidence_score numeric(5, 4) check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id)
);

create table public.career_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.selected_careers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_recommendation_id uuid references public.career_recommendations(id) on delete set null,
  career_id text not null,
  career_title text not null,
  selection jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  selected_career_id uuid references public.selected_careers(id) on delete set null,
  roadmap jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
  milestone_id text not null,
  task_id text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  progress jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (roadmap_id, task_id)
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_user_id_idx on public.profiles(user_id);
create index assessments_user_id_idx on public.assessments(user_id);
create index assessment_answers_user_id_idx on public.assessment_answers(user_id);
create index assessment_answers_assessment_id_idx on public.assessment_answers(assessment_id);
create index psychometric_profiles_user_id_idx on public.psychometric_profiles(user_id);
create index psychometric_profiles_assessment_id_idx on public.psychometric_profiles(assessment_id);
create index career_recommendations_user_id_idx on public.career_recommendations(user_id);
create index career_recommendations_assessment_id_idx on public.career_recommendations(assessment_id);
create index selected_careers_user_id_idx on public.selected_careers(user_id);
create index roadmaps_user_id_idx on public.roadmaps(user_id);
create index roadmap_progress_user_id_idx on public.roadmap_progress(user_id);
create index roadmap_progress_roadmap_id_idx on public.roadmap_progress(roadmap_id);
create index chat_messages_user_id_idx on public.chat_messages(user_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger assessments_set_updated_at
before update on public.assessments
for each row execute function public.set_updated_at();

create trigger psychometric_profiles_set_updated_at
before update on public.psychometric_profiles
for each row execute function public.set_updated_at();

create trigger career_recommendations_set_updated_at
before update on public.career_recommendations
for each row execute function public.set_updated_at();

create trigger selected_careers_set_updated_at
before update on public.selected_careers
for each row execute function public.set_updated_at();

create trigger roadmaps_set_updated_at
before update on public.roadmaps
for each row execute function public.set_updated_at();

create trigger roadmap_progress_set_updated_at
before update on public.roadmap_progress
for each row execute function public.set_updated_at();

create trigger chat_messages_set_updated_at
before update on public.chat_messages
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.psychometric_profiles enable row level security;
alter table public.career_recommendations enable row level security;
alter table public.selected_careers enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_progress enable row level security;
alter table public.chat_messages enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_own" on public.profiles
for delete using (auth.uid() = user_id);

create policy "assessments_select_own" on public.assessments
for select using (auth.uid() = user_id);
create policy "assessments_insert_own" on public.assessments
for insert with check (auth.uid() = user_id);
create policy "assessments_update_own" on public.assessments
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assessments_delete_own" on public.assessments
for delete using (auth.uid() = user_id);

create policy "assessment_answers_select_own" on public.assessment_answers
for select using (auth.uid() = user_id);
create policy "assessment_answers_insert_own" on public.assessment_answers
for insert with check (auth.uid() = user_id);
create policy "assessment_answers_update_own" on public.assessment_answers
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assessment_answers_delete_own" on public.assessment_answers
for delete using (auth.uid() = user_id);

create policy "psychometric_profiles_select_own" on public.psychometric_profiles
for select using (auth.uid() = user_id);
create policy "psychometric_profiles_insert_own" on public.psychometric_profiles
for insert with check (auth.uid() = user_id);
create policy "psychometric_profiles_update_own" on public.psychometric_profiles
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "psychometric_profiles_delete_own" on public.psychometric_profiles
for delete using (auth.uid() = user_id);

create policy "career_recommendations_select_own" on public.career_recommendations
for select using (auth.uid() = user_id);
create policy "career_recommendations_insert_own" on public.career_recommendations
for insert with check (auth.uid() = user_id);
create policy "career_recommendations_update_own" on public.career_recommendations
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "career_recommendations_delete_own" on public.career_recommendations
for delete using (auth.uid() = user_id);

create policy "selected_careers_select_own" on public.selected_careers
for select using (auth.uid() = user_id);
create policy "selected_careers_insert_own" on public.selected_careers
for insert with check (auth.uid() = user_id);
create policy "selected_careers_update_own" on public.selected_careers
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "selected_careers_delete_own" on public.selected_careers
for delete using (auth.uid() = user_id);

create policy "roadmaps_select_own" on public.roadmaps
for select using (auth.uid() = user_id);
create policy "roadmaps_insert_own" on public.roadmaps
for insert with check (auth.uid() = user_id);
create policy "roadmaps_update_own" on public.roadmaps
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "roadmaps_delete_own" on public.roadmaps
for delete using (auth.uid() = user_id);

create policy "roadmap_progress_select_own" on public.roadmap_progress
for select using (auth.uid() = user_id);
create policy "roadmap_progress_insert_own" on public.roadmap_progress
for insert with check (auth.uid() = user_id);
create policy "roadmap_progress_update_own" on public.roadmap_progress
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "roadmap_progress_delete_own" on public.roadmap_progress
for delete using (auth.uid() = user_id);

create policy "chat_messages_select_own" on public.chat_messages
for select using (auth.uid() = user_id);
create policy "chat_messages_insert_own" on public.chat_messages
for insert with check (auth.uid() = user_id);
create policy "chat_messages_update_own" on public.chat_messages
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "chat_messages_delete_own" on public.chat_messages
for delete using (auth.uid() = user_id);
