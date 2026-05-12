# Ursa Major Pilot

Standalone stripped-down demo for the school pilot.

Production web: https://um-pilot.expo.app

## Pilot flow

- Registration accepts name, phone, age 12-17, and class.
- Age 12-14 uses the hackathon-style Basic/PRO tests.
- Age 15-17 uses the career-anchor Basic test and the "Первый день стажера" PRO test.
- After Basic results, the participant can start PRO or open the UM overview.
- After PRO results, the participant can open the UM overview.

## Run locally

```sh
cd ~/Projects/um-pilot
pnpm install
pnpm web
```

## Frontend env

Create `.env` in this folder:

```sh
EXPO_PUBLIC_PILOT_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_PILOT_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

The app still works with local storage if these are missing, but Supabase is required for shared pilot data and AI analysis.

## Supabase setup

Use a separate Supabase project for the pilot.

1. Create a new Supabase project, for example `um-pilot-school`.
2. Enable anonymous sign-ins in Supabase Auth.
3. Open the SQL editor and run:

```sql
-- paste contents of supabase/migrations/001_pilot_schema.sql
```

4. Add the frontend env values from Project Settings > API into `.env`.
5. Link the CLI to the pilot project:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

6. Deploy the AI Edge Function:

```sh
supabase functions deploy analyze-diagnostic
```

7. Set the Gemini key as a Supabase Edge Function secret:

```sh
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY
supabase secrets set GEMINI_MODEL=gemini-2.5-flash
```

You can also copy `supabase/functions/.env.example` to `supabase/functions/.env` for local function testing. Do not commit real keys.

## Data model

The pilot writes only to the pilot project:

- `pilot_users`: participant name, phone, age, grade.
- `pilot_answers`: every answer and response time, saved after each question.
- `diagnostic_sessions`: final scores, behavioral data, anchors, deterministic report, and AI narrative when available.

## AI behavior

The client builds a deterministic report first. Then it invokes the `analyze-diagnostic` Edge Function. If AI fails or times out, the user still gets results and the app preview works.

## Web deployment

This project is linked to EAS as `@ursamajor/um-pilot`.

```sh
pnpm web:export
pnpm exec eas deploy --prod --non-interactive
```

GitHub Actions deploys from `main` after these repository secrets are configured:

- `EXPO_TOKEN`
- `EXPO_PUBLIC_PILOT_SUPABASE_URL`
- `EXPO_PUBLIC_PILOT_SUPABASE_ANON_KEY`

## Troubleshooting RLS errors

If inserts into `pilot_answers` or `diagnostic_sessions` fail with:

```txt
new row violates row-level security policy
```

then the browser is sending the anon project key instead of the anonymous user's access token, or the stored pilot user id no longer matches the active Supabase Auth session.

Check:

1. Supabase Auth > Providers > Anonymous Sign-Ins is enabled.
2. The app `.env` points to the same pilot project where the SQL migration was applied.
3. Press `Выйти` in the pilot app, then register again. This clears old local pilot state and creates a fresh anonymous Supabase user.
4. In DevTools Network, REST requests to `/rest/v1/pilot_answers` should have `Authorization: Bearer <user JWT>`, not only the anon key.

Anonymous Supabase users use the `authenticated` database role, so the migration policies are intentionally scoped to `to authenticated with check (user_id = auth.uid())`.
