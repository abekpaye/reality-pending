# External setup required for live Class Mode

Individual Mode is fully local and needs no account or environment variables. Live Class Mode requires a Supabase project because this repository does not contain credentials.

1. Create or select a Supabase project.
2. In the Supabase SQL editor, run `supabase/migrations/202609250001_class_mode.sql`.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` to the project URL.
5. Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the public anonymous key. Never use the service-role key in browser configuration.
6. Restart `npm run dev`.
7. Open `/class`, create a host room, then join its code from another browser or private window.

The migration creates the anonymous room/session tables, token-hashed host and participant secrets, response upsert RPCs, room expiry, row-level security, and the realtime publication for safe session-state updates.

Live realtime behavior has not been production-verified in this checkout because no Supabase URL or anonymous key is configured.
