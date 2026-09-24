# REALITY PENDING — Technical Decision Log

This log distinguishes requirements already stated by the specification from recommendations that remain subject to implementation validation. No recommendation should be treated as a product requirement without confirmation.

## Framework

- Status: CONFIRMED BY SPECIFICATION (preferred).
- Decision: Use Next.js, React, and TypeScript if the repository has no compatible existing stack.
- Rationale: matches the requested interactive, maintainable web application and future Class Mode.
- Open attention: preserve existing compatible tooling rather than rebuilding unnecessarily.

## Routing

- Status: TECHNICAL RECOMMENDATION.
- Decision: Use route-level shell/landing/intro/individual/class/concepts surfaces, with experiment-specific components selected from a central registry.
- Rationale: keeps navigation and future modules extensible without forcing experiments into one schema.

- Phase 4 implementation: future experiment routes use `/experiment/[registry-slug]`, beginning with `/experiment/simulation`. Paths are derived from registry metadata; no experiment route exists until its real interaction is implemented.

## Styling

- Status: CONFIRMED BY SPECIFICATION.
- Decision: Tailwind CSS or existing compatible styling, driven by dark tokens, modern sans typography, contextual accent colors, editorial hierarchy, whitespace, responsive layouts, and accessible focus states.
- Open attention: avoid generic SaaS patterns and preserve one idea per screen.

### Phase 2 design-system decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Font: Geist Sans is the single primary family, loaded locally through the `geist` package to avoid runtime font requests. The scale uses responsive display, question, experiment-title, section-title, body, label, metadata, and microcopy styles.
- Color: one dark neutral foundation uses semantic CSS variables for background, surfaces, borders, foreground, secondary/muted text, active accent, and accent-soft. Only one contextual accent is active in a composition; experiment accents are selected through metadata identifiers.
- Radius: `4px`, `8px`, and `12px` tokens are available. Most editorial structure remains square; moderate radius is reserved for real controls and bounded surfaces. Pills are not part of the default language.
- Borders and depth: tonal surfaces and thin borders provide structure. Shadows, glow, glass, and decorative blur are intentionally absent from the foundation.
- Layout: the application shell provides optional project framing without imposing permanent navigation. Shared width, reading-width, page-padding, and section-spacing tokens support immersive, centered, split, and wide visualization layouts.
- Primitive strategy: custom, narrowly scoped primitives cover buttons, optional choice surfaces, seven-step progress, range controls, reflection regions, reflective text entry, and sparing tooltips. They are optional building blocks, not a generic experiment renderer.
- Deferred pattern: ranking-item and dialog primitives remain deferred until their real interaction requirements are known; Phase 2 does not invent drag behavior or modal flows.

## Animation

- Status: CONFIRMED BY SPECIFICATION (preferred Framer Motion).
- Decision: use Framer Motion or an equivalent already present; motion must express progression, transformation, uncertainty, consequence, comparison, or reveal, and must honor reduced motion.
- Open attention: provide static/readable fallbacks for maps and charts.

- Phase 2 implementation: shared durations, easing, scene entrance, narrative stagger, and reflection reveal variants use restrained opacity/vertical/height transitions. Reduced-motion CSS collapses duration without removing content or state.

## Component architecture

- Status: CONFIRMED BY SPECIFICATION.
- Decision: separate application shell, experiment registry/data, experiment-specific components, session state, scoring, visualizations, philosophical content, and Class Mode.
- Rationale: reuse primitives without erasing meaningful mechanic differences; avoid a giant monolith.

### Phase 3 entry-experience decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Landing composition: the final root route is a single-viewport editorial composition rather than a conventional marketing page. Project identity, three core questions, subtitle, and one primary entry action carry the page; inactive Class Mode and Explore Concepts destinations are omitted until their routes exist.
- Name treatment: “PENDING” uses an incomplete rule, a single settled marker, and an offset boundary line to suggest unresolved certainty without loading, terminal, glitch, or science-fiction conventions.
- Shell variants: `public` and `immersive` modes adjust framing emphasis while preserving a shared application shell. Intro navigation is intentionally limited to a quiet return link.
- Intro sequencing: `/intro` owns short local presentation state for three user-advanced statements. It does not persist or infer returning-user behavior; Phase 4 may decide replay, skip, and resume behavior without rewriting the sequence component.
- Start boundary: a typed `ExperienceStartBoundary` names `simulation` as the first experiment. Phase 5 enabled it only when the real `/experiment/simulation` route existed; BEGIN now starts that experiment through the shared session API before navigation.
- Entrance motion: landing content enters through one short stagger and route departure uses a brief fade/vertical shift. Intro statements use user-triggered replacement with prior statements receding into context. Reduced-motion users receive the same content and controls without meaningful delay.

## State management

- Status: TECHNICAL RECOMMENDATION.
- Decision: start with typed React state/context scoped to the session and experiment; introduce a small store only if cross-route coordination makes it necessary.
- Rationale: minimizes dependencies while preserving a clear state model.

### Phase 4 Individual Session decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Model: schema version `1` stores an anonymous UUID, overall `not-started | in-progress | completed` status, nullable current experiment, canonical completed ids, a registry-derived state record for every experiment, and creation/update timestamps.
- Experiment data: each experiment owns a JSON-safe value inside its state record. The shared runtime does not define questions, options, response schemas, or philosophical interpretation. Later experiment modules will validate their own strongly typed data at this boundary.
- Progress separation: registry `availability` describes whether product code exists; session experiment `status` describes only the current user’s progress. These concepts use different names and types.
- React integration: `IndividualSessionProvider` exposes hydration readiness, persistence availability, progress summary, start/update/complete actions, and restart. `useExperimentSession(id)` scopes those operations for an experiment. The provider is mounted only on the `(individual)` route group, currently containing `/intro`; the static landing and design-system routes remain server-first.
- Hydration: localStorage is read only in a client effect. Until then, session is `null` and `ready` is false. Current Phase 3 screens do not render progress, so no incorrect progress flashes.

## Local persistence

- Status: CONFIRMED BY SPECIFICATION.
- Decision: Individual Mode uses browser-local persistence with an anonymous session id, versioned/validated state, refresh recovery, corruption fallback, and intentional restart.
- Open attention: do not use local persistence as a substitute for Class Mode realtime state.

- Phase 4 implementation: storage key is `reality-pending:individual-session`. One adapter owns parsing, validation, writing, clearing, creation, and restart. Missing state creates version 1; malformed JSON, unsupported versions, structural inconsistencies, and unknown experiment ids are replaced safely. Storage access failures fall back to an in-memory session and report `persistenceAvailable: false` without reaching the global error boundary. No migration is guessed when a future version is encountered.

## Supabase and realtime

- Status: CONFIRMED BY SPECIFICATION for Class Mode.
- Decision: use Supabase for anonymous realtime sessions, participant responses, host control, and aggregate results; never expose privileged keys; apply security policies.
- Open attention: Individual Mode must remain usable if Supabase is absent or unavailable. Exact schema and policies require implementation review.

## Experiment registry

- Status: CONFIRMED BY SPECIFICATION.
- Decision: central registry includes id, slug, title, short title, topic, accent, order, completion state, and discussion prompt.
- Rationale: supports progress and future modules while leaving interaction logic local to each experiment.

- Phase 4 implementation: the registry is the single ordering source for session initialization, previous/next lookup, progress totals, and available-experiment advancement. Visiting Intro alone does not start a user experiment.
- Phase 5 implementation: `simulation` is now `available`; the other six entries remain `planned`. Completing Simulation does not start or navigate to Replace the World.

### Phase 5 Simulation decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Route and entry: the real experiment lives at `/experiment/simulation`. Intro BEGIN ensures Simulation is started through the existing session API and navigates through the typed entry boundary. Direct visits create/recover a session and start only Simulation.
- Response schema: Simulation owns a version 1 typed state containing its meaningful stage, narrative position, tentative selection, and committed semantic position (`physical-reality`, `experiential-reality`, or `uncertain`). Animation and DOM state are not persisted.
- Interaction: a custom triangular conceptual field positions one marker among three semantic button regions. Pointer and touch users can select a region; keyboard and assistive-technology users operate the same real buttons. Dragging is not required.
- Persistence: narrative progress, tentative selection, commitment, reflection, and completion are stored through the shared JSON-safe session boundary. Malformed feature data falls back to the opening without affecting the global session recovery rules.
- Revision: a position can be changed before commitment and explicitly reconsidered from reflection. Once the experiment is globally complete, the response is locked for review rather than silently overwritten.
- Reflection: response-specific observations precede compact context for ontology, metaphysics, and skepticism. No choice is mapped one-to-one to a philosophical school and no global score is calculated.
- Completion boundary: completion remains on the real Simulation route, marks only `simulation` complete, and presents a restrained preserved-response state. There is no Experiment 02 placeholder route.
- Visual signature: a restrained structural layer resolves from one unstable boundary into a regular coordinate field after the simulation premise. It uses no glitch, terminal, particle, or science-fiction effects.

## Philosophical scoring

- Status: CONFIRMED BY SPECIFICATION.
- Decision: central deterministic rules map actual answers to broad dimensions and descriptive observations. Avoid arbitrary decimals, diagnosis, philosopher matching, and LLM-generated interpretations.
- Open attention: weights and templates must be reviewed for philosophical responsibility and tested with fixture sessions.

## Accessibility

- Status: CONFIRMED BY SPECIFICATION.
- Decision: semantic HTML, contrast, visible focus, keyboard/touch support, large targets, labels, reduced motion, color-independent meaning, and accessible fallbacks for drag interactions are release requirements.
- Open attention: validate actual mobile viewport and virtual-keyboard behavior, not only desktop emulation.

## Testing

- Status: CONFIRMED BY SPECIFICATION.
- Decision: use unit tests for scoring/state logic, component/interaction tests for important mechanics, and manual responsive/accessibility/realtime checks. Validate typecheck, lint, production build, and core flow.
- Open attention: avoid testing only snapshots; prioritize user decisions and persistence/reconnect behavior.

- Phase 4 implementation: Vitest runs focused Node-environment unit tests for session creation, JSON-safe raw data, progress transitions, registry routing, persistence round trips, clearing/restart, malformed data, unsupported versions, unknown experiments, and unavailable storage.
- Phase 5 implementation: domain tests cover valid Simulation positions, typed parsing/fallback, response save/load restoration, BEGIN starting Simulation, completion/progress, registry-derived next id, and the guarantee that Experiment 02 does not auto-start. Browser QA covers the real entry, selection, reload, reflection, and completion flow; no component-test dependency was added.

## Deployment

- Status: TECHNICAL RECOMMENDATION.
- Decision: deploy through the repository’s compatible hosting setup after production validation, preserving environment separation and documenting required configuration.
- Open attention: exact provider is not specified; confirm existing repository/hosting configuration before choosing one. No deployment is part of the documentation-only first task.

## Product boundaries

- Status: CONFIRMED BY SPECIFICATION.
- Decision: Individual Mode is the first milestone; Class Mode follows. Do not add accounts, social network features, LMS, leaderboard, chatbot-centered UX, long biographies, encyclopedia content, or automatic essay grading.
