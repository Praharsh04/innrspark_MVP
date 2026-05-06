# Innrspark Codex Guide

## Product Overview

Innrspark is a mobile-first career discovery app that guides users through onboarding, Google login, adaptive assessment, career recommendations, personalized roadmaps, progress tracking, and the Sparki chatbot.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Supabase later
- AI later

## Design Source Of Truth

`/designs` contains exported Figma references and assets. Use these files to recreate the UI:

- `/designs/onboarding/slide_1.png` -> `/`
- `/designs/onboarding/slide_2.png` to `slide_5.png` -> `/onboarding`
- `/designs/auth/login_signup.png` -> `/auth`
- `/designs/assessment/start_test.png` -> `/assessment/start`
- `/designs/assessment/quetion_screen.png` and `progress_screen.png` -> `/assessment/question`
- `/designs/assessment/completion_screen.png` and `/designs/career_recommendation/Recomedationg_Loading.png` -> `/assessment/loading`
- `/designs/career_recommendation/career_card.png` -> `/recommendations`
- `/designs/roadmap/generating.png` -> `/roadmap/generating`
- `/designs/roadmap/road_map.png` and `roadmap_milestone_wise_task.png` -> `/roadmap`
- `/designs/chat/chatbot.png` -> `/chat`

## Asset Rules

- Do not use full-screen screenshots as final UI.
- Recreate layouts using React and Tailwind.
- Use individual logo/doodle assets where available.
- Runtime assets should be placed in `/public/assets`.
- Keep `/designs` unchanged.

## UI Rules

- Build mobile-first.
- Target a max width around `390px`.
- Use yellow/cream gradient backgrounds.
- Use rounded cards.
- Use pill buttons.
- Use bold black headings.
- Show bottom navigation after roadmap generation.

## Development Rules

- Use mock data first.
- Do not add Supabase until asked.
- Do not add AI behavior until asked.
- Keep UI, state, and logic separated.
- Keep components reusable.
- Use TypeScript types.
- Report changed files after each task.
