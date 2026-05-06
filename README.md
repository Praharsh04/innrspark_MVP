# Innrspark

Innrspark is a mobile-first career discovery app built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Zustand, Supabase, and Gemini.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run production checks:

```bash
npm run lint
npm run build
```

## Environment Variables

Create `.env.local` from `.env.local.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
GEMINI_API_KEY=
GOOGLE_API_KEY=
GEMINI_MODEL=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` should be the Supabase project root URL, for example `https://your-project-ref.supabase.co`.
- Do not use the Supabase REST endpoint ending in `/rest/v1`.
- `NEXT_PUBLIC_SITE_URL` should be your deployed app URL, for example `https://your-app.vercel.app`.
- `GEMINI_API_KEY` is the preferred server-side Google AI key.
- `GOOGLE_API_KEY` is supported as a server-side fallback.
- Never prefix AI keys with `NEXT_PUBLIC_`.
- `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`.

## Supabase Setup

Apply database migrations after linking your Supabase project:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Required Supabase auth setup:

- Enable Google as an auth provider in Supabase.
- Add the Google OAuth client ID and secret in Supabase Auth providers.
- Add your local and production callback URLs in Supabase URL configuration:
  - `http://localhost:3000/auth`
  - `https://your-app.vercel.app/auth`
- Add the same authorized redirect URI in Google Cloud OAuth settings.

The app keeps a local/mock fallback when Supabase environment variables are missing.

## AI Setup

Sparki uses server-side API routes and never calls Gemini directly from the browser.

Set one of:

```bash
GEMINI_API_KEY=
GOOGLE_API_KEY=
```

If the key is missing or invalid, Sparki returns a friendly fallback message instead of crashing.

## Vercel Deployment

1. Push the repo to GitHub.
2. Create a Vercel project from this repo.
3. Set the project root to this folder if the repo contains parent folders.
4. Add all required environment variables in Vercel Project Settings.
5. Set `NEXT_PUBLIC_SITE_URL` to the final Vercel URL or custom domain.
6. Add the production `/auth` URL to Supabase and Google OAuth redirect settings.
7. Deploy.

Build command:

```bash
npm run build
```

Output is handled by Next.js and Vercel automatically.

## PWA Testing

The app includes `public/manifest.json` and installable icons under `public/icons`.

Android Chrome check:

1. Open the deployed site on Android Chrome.
2. Open the browser menu.
3. Choose `Add to Home screen` or `Install app`.
4. Launch Innrspark from the home screen.
5. Confirm it opens in standalone mode and starts at `/`.

## Manual QA Flow

Verify:

```text
/ -> /onboarding -> /auth -> /assessment/start -> /assessment/question
-> /assessment/loading -> /recommendations -> /roadmap/generating
-> /roadmap -> /progress -> /chat -> /profile
```

Also check widths `360px`, `390px`, and `430px` for overflow, clipped controls, chat input visibility, bottom navigation overlap, and roadmap modal scrolling.
