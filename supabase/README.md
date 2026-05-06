# Innrspark Supabase Setup

This folder contains the initial database migration for Innrspark.

## Environment

Create `.env.local` from `.env.local.example` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Apply Migrations

From the project root, after linking a Supabase project:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

For a local Supabase database:

```bash
supabase start
supabase db reset
```

## Schema Summary

The migration creates user-owned tables for profiles, assessments, assessment answers, psychometric profiles, career recommendations, selected careers, roadmaps, roadmap progress, and chat messages.

Row Level Security is enabled on every table. Policies allow authenticated users to read, insert, update, and delete only rows where `user_id = auth.uid()`.
