# Deployment runbook

## Preflight

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

## Individual Mode

Deploy the repository to any host supporting Next.js 15. No environment variables are required. Smoke-test `/`, `/intro`, all seven `/experiment/*` routes, `/map`, `/concepts`, and `/discussion`.

## Class Mode

1. Apply `supabase/migrations/202609250001_class_mode.sql` to the production Supabase project.
2. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the hosting environment.
3. Do not configure or expose a Supabase service-role key in the web application.
4. Deploy, create a room from `/class/host`, and join from a separate private/mobile browser.
5. Verify host refresh, participant refresh, one response per experiment, reveal/hide behavior, discussion prompts, room finish, invalid room, and expired room.

## Rollback

Keep the previous successful application deployment available through the hosting provider. The migration is additive. If Class Mode must be disabled while preserving Individual Mode, remove the two public Supabase environment variables and redeploy; `/class` will return to its intentional connection-required state.

## Current verification status

The application production build and the repository-side Supabase implementation are validated locally. Live Supabase and hosted production smoke tests remain blocked until project credentials and a deployment target are supplied.
