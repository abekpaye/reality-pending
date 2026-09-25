# REALITY PENDING

**An Interactive Philosophy Experiment** for university seminars.

REALITY PENDING places participants inside seven thought experiments before introducing philosophical terminology. It is not a quiz, personality test, automatic essay grader, or philosopher-matching system. Decisions are preserved as raw semantic responses and interpreted cautiously through broad, deterministic tendencies.

## Individual Mode

The complete local journey is:

`Landing → Intro → Simulation → Replace the World → Evidence Chain → Brain in a Vat → AI Consciousness → The Teleporter → Replace Yourself → Philosophical Map`

Individual Mode requires no account or backend. A versioned anonymous session is stored under `reality-pending:individual-session` in `localStorage`. Malformed, unsupported, or structurally invalid state is replaced safely. Users can reload at meaningful stages, revisit completed experiments, and intentionally restart from the final map.

The Personal Philosophical Map derives five broad continua from actual responses using deterministic rules in `src/features/philosophical-map/scoring.ts`. It displays no score, diagnosis, type, false precision, or philosopher match.

## Class Mode

Class Mode provides:

- anonymous room creation and six-character codes;
- a QR join link;
- anonymous participant count;
- host-controlled experiment, pause/resume, reveal, discussion, and finish states;
- mobile participant responses and waiting/reconnection states;
- experiment-specific aggregate visualizations;
- no names, email addresses, accounts, or student identifiers.

The repository implementation uses Supabase Realtime. Class Mode degrades to a clear configuration state when Supabase is absent; Individual Mode remains fully available. See [SETUP_REQUIRED.md](./SETUP_REQUIRED.md) for the exact external steps.

## Stack

- Next.js 15, React 19, TypeScript
- custom CSS design system and CSS Modules
- Framer Motion with reduced-motion fallbacks
- Supabase JS for Class Mode
- `qrcode.react` for room join codes
- Vitest for domain, persistence, interpretation, and aggregation tests

## Architecture

- `src/features/experiments/*` — seven independent interaction modules with local typed response schemas
- `src/features/individual-session/*` — registry-derived progress and resilient browser persistence
- `src/features/philosophical-map/*` — deterministic response interpretation
- `src/features/class-mode/*` — typed Supabase boundary, host/participant UX, and aggregates
- `src/data/*` — experiment, concept, and discussion registries
- `supabase/migrations/*` — Class Mode schema, RLS, token-protected RPCs, and realtime publication

Shared components provide framing, buttons, progress, range, reflection, and text entry without forcing experiments into a generic question engine.

## Local setup

Requirements: a current Node.js LTS release and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Leave the Supabase values empty when using Individual Mode only.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

These are Supabase's public browser values. Never place a service-role secret in `.env.local` or client code.

## Supabase setup

Run `supabase/migrations/202609250001_class_mode.sql` in the target project's SQL editor, then configure the two public variables above. The migration creates room/session state, isolated host and participant token hashes, response upserts, RLS, security-definer RPCs, room expiry, and realtime publication.

## Commands

```bash
npm run dev        # local development
npm run typecheck  # strict TypeScript validation
npm run lint       # ESLint through Next.js 15
npm run test       # Vitest suite
npm run build      # optimized production build
npm run start      # serve the production build
```

## Deployment

Build with `npm run build` and deploy to a Next.js-compatible host. Individual Mode needs no environment configuration. Enable Class Mode only after applying the migration and setting the two public Supabase variables. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the runbook and current external verification status.

## Privacy

Individual responses stay in the browser. Class Mode uses anonymous random identifiers and structured response data. Raw Brain in a Vat writing is not included in public class aggregation by default.
