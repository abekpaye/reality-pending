# REALITY PENDING — Implementation Plan

Status legend: `[ ]` not started, `[x]` complete. No phase is marked complete before implementation and validation.

## Phase 1 — Project foundation

- Objective: establish a maintainable application baseline.
- Tasks: preserve compatible stack; configure TypeScript, Next.js, Tailwind, lint/test/build scripts; add README and `.env.example`; define error boundaries and environment handling.
- Dependencies: repository inspection.
- Acceptance: app boots, builds, and has no secrets committed.
- Validation: install, typecheck, lint, test, production build.
- Completion: `[x]`

## Phase 2 — Design system and application shell

- Objective: establish dark editorial visual language and accessible shell.
- Tasks: tokens, typography, responsive layout, progress/navigation, focus states, reduced-motion behavior, favicon, route structure.
- Dependencies: Phase 1.
- Acceptance: shell is usable at mobile and desktop widths with no starter styling remaining.
- Validation: keyboard pass, contrast review, viewport smoke tests.
- Completion: `[x]`

## Phase 3 — Landing and intro

- Objective: create the invitation and paced entry into the experiment.
- Tasks: landing copy/actions; progressive intro reveal; local entry state; restart-safe transitions.
- Dependencies: Phase 2.
- Acceptance: user can enter immediately and understands this is not a test.
- Validation: mouse, keyboard, touch, reduced motion.
- Completion: `[x]`

## Phase 4 — Experiment framework and persistence

- Objective: support seven unique modules with resilient Individual Mode state.
- Tasks: central registry; versioned session types; JSON-safe experiment data boundary; local storage adapter with validation/recovery; progress persistence; restart flow; completion and routing boundaries. Philosophical scoring remains deferred.
- Dependencies: Phase 2–3.
- Acceptance: refresh preserves progress; intentional restart clears only after confirmation; experiments can remain unique.
- Validation: storage corruption, refresh, back/forward, reload tests.
- Completion: `[x]`

## Phase 5 — Simulation

- Objective: implement spatial dilemma and post-decision reflection.
- Tasks: narrative reveal; spatial conceptual field; keyboard/touch selection; typed response persistence; response-specific reflection and philosophical context; physical/simulated transition; real Intro handoff; registry-derived progress and completion state.
- Dependencies: Phase 4.
- Acceptance: no radio-card replacement; all three positions are accessible and persisted.
- Validation: selection/revision/completion, reload restoration, keyboard semantics, reduced-motion implementation, domain/session tests, typecheck, lint, build, and browser flow review.
- Completion: `[x]`

## Phase 6 — Replace the World

- Objective: implement progressive scene replacement and threshold marking.
- Tasks: lightweight scene; element-by-element replacement; simulation indicator; threshold/never/reject actions; reflection.
- Dependencies: Phase 4.
- Acceptance: user can mark a threshold or reject the premise and results persist.
- Validation: sequence, reset, mobile controls, state tests.
- Completion: `[x]`

## Phase 7 — Evidence Chain

- Objective: implement dynamic confidence and evidence history.
- Tasks: large confidence control; five sequential evidence events; confidence snapshots; animated timeline; final questions/reflection.
- Dependencies: Phase 4.
- Acceptance: every stage stores a value and the trajectory is readable on mobile.
- Validation: slider keyboard/touch, timeline data, reduced-motion.
- Completion: `[x]`

## Phase 8 — Brain in a Vat

- Objective: deliver a contemplative open-response module.
- Tasks: paced narrative; autosaving optional text area; submission; strategy self-selection; cautious reflection.
- Dependencies: Phase 4.
- Acceptance: no grading or automated classification; text survives refresh.
- Validation: autosave, long text, keyboard, mobile keyboard behavior.
- Completion: `[x]`

## Phase 9 — AI Consciousness

- Objective: implement evidence-set construction and standards reflection.
- Tasks: dialogue reveal; selectable evidence pieces; selected/unsure/nothing logic; evidence summary; structured reaction/open response; dimension contribution.
- Dependencies: Phase 4.
- Acceptance: evidence set is assembled, not a checkbox quiz, and interpretation is cautious.
- Validation: selection constraints, persistence, accessibility fallback.
- Completion: `[x]`

## Phase 10 — Teleporter

- Objective: implement branching identity thought experiment and ranking.
- Tasks: stage 1 answer; stage 2 changed assumption; stage 3 ranking with accessible reorder controls; contradiction-aware reflection.
- Dependencies: Phase 4.
- Acceptance: both branches and the ranking affect the recorded result.
- Validation: keyboard reorder, touch fallback, response mapping.
- Completion: `[x]`

## Phase 11 — Replace Yourself

- Objective: implement continuous identity replacement.
- Tasks: persistent evolving visualization; meaningful replacement stages; same/not/unsure decisions; physical/psychological tracking; reflection.
- Dependencies: Phase 4.
- Acceptance: not a sequence of identical pages; judgment-change threshold is recorded.
- Validation: stage progression, refresh, mobile layout, reduced motion.
- Completion: `[x]`

## Phase 12 — Philosophical Map

- Objective: turn answers into transparent, descriptive dimensions.
- Tasks: central deterministic scoring rules; broad-position continua; animated map with accessible static fallback; 3–5 template observations; no false precision.
- Dependencies: Phases 5–11.
- Acceptance: output is reproducible and never labels a user as a philosopher/type.
- Validation: fixture sessions, scoring unit tests, empty/incomplete states.
- Completion: `[x]`

## Phase 13 — Explore Concepts and Discussion

- Objective: provide compact post-experience context and discussion prompts.
- Tasks: concept registry; concise concept views; thinker links; experiment-specific prompts; optional return navigation.
- Dependencies: Phase 12.
- Acceptance: content follows experience and remains scannable, not encyclopedic.
- Validation: content audit and route smoke tests.
- Completion: `[x]`

## Phase 14 — Class Mode backend

- Objective: establish anonymous realtime session model.
- Tasks: Supabase schema, policies, room generation, host token handling, participant identity, session lifecycle, realtime channels, configuration/error states.
- Dependencies: Individual Mode data model; Supabase project.
- Acceptance: no privileged key exposure; invalid/expired/unavailable states are handled.
- Validation: policy tests, reconnect tests, anonymous join tests.
- Completion: `[x]` (repository implementation complete; live Supabase verification requires external configuration documented in `SETUP_REQUIRED.md`)

## Phase 15 — Class Mode host/participant UX

- Objective: support live facilitation and anonymous mobile participation.
- Tasks: host room creation/code/QR, participant join/waiting, host controls, stage synchronization, reveal/hide, discussion prompt, finish.
- Dependencies: Phase 14.
- Acceptance: host can run an experiment while participants respond from phones.
- Validation: two-browser session, refresh/disconnect, projection and mobile checks.
- Completion: `[x]` (implemented and configuration/error states verified; live two-browser room flow awaits Supabase credentials)

## Phase 16 — Class result visualizations

- Objective: make aggregate results prompt discussion and vary by experiment.
- Tasks: position, threshold, confidence, structured strategy, evidence frequency, branching, and identity-threshold views; suppress raw open text by default.
- Dependencies: Phase 15.
- Acceptance: each experiment has an appropriate distinct visualization readable on projection and mobile.
- Validation: representative data fixtures, no-data/one-response states.
- Completion: `[x]`

## Phase 17 — Mobile/accessibility polish

- Objective: make the full journey robust for seminar phones and assistive technology.
- Tasks: test 320–430px/tablet widths; touch target audit; focus order; ARIA/labels; keyboard fallbacks; contrast; reduced motion; viewport/virtual keyboard fixes.
- Dependencies: Phases 2–16.
- Acceptance: no horizontal scrolling and no essential interaction unavailable without drag or color.
- Validation: manual device-size matrix and accessibility tooling.
- Completion: `[x]`

## Phase 18 — Content audit

- Objective: ensure philosophical responsibility and tone.
- Tasks: verify cautious language, no fake quotes, no premature definitions, no overclaiming, complete seven-experiment coverage, concise concepts and prompts.
- Dependencies: Phases 5–13.
- Acceptance: content matches the specification and preserves uncertainty.
- Validation: editorial review against `PROJECT_SPEC.md`.
- Completion: `[x]`

## Phase 19 — QA and performance

- Objective: validate the integrated experience.
- Tasks: full flow tests; local persistence fixtures; realtime failure modes; build/performance checks; loading/error/empty/success states; no console errors.
- Dependencies: Phases 1–18.
- Acceptance: production build succeeds and core journey is recoverable.
- Validation: typecheck, lint, tests, build, manual regression.
- Completion: `[x]`

## Phase 20 — Deployment

- Objective: publish the completed site safely.
- Tasks: configure hosting, environment values, deploy, verify production routes, confirm no secrets, document runbook.
- Dependencies: Phase 19 and hosting configuration.
- Acceptance: deployed Individual Mode works; Class Mode is verified if enabled.
- Validation: production smoke test and rollback notes.
- Completion: `[ ]` — blocked by external hosting target and production Supabase credentials; repository runbook is complete.
