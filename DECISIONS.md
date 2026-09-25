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

### Phases 14–16 Class Mode decisions

- Status: REPOSITORY IMPLEMENTATION COMPLETE; LIVE EXTERNAL VERIFICATION PENDING CONFIGURATION.
- Data model: class sessions contain only public room state. Host token hashes are isolated in a table with no anonymous grants; participant token hashes and raw responses are also inaccessible directly. Security-definer RPCs create/join rooms, authorize host mutations, upsert participant responses, and return host-only aggregates.
- Privacy: participants are random UUIDs with bearer tokens, never names, emails, accounts, or student identifiers. Brain in a Vat aggregation reads only the explicit structured strategy and never returns raw writing by default.
- Security: RLS is enabled on every table, public clients receive only the anonymous key, payload size and experiment ids are constrained, room expiry is enforced at join, and neither service-role credentials nor plaintext tokens are stored in database rows.
- Realtime strategy: safe class-session state is published through Supabase Realtime for host-controlled experiment/status/reveal updates. Participant counts and response aggregates use an authorized host snapshot refresh, avoiding broad select policies over participant or response tables.
- Host UX: `/class/host` creates a room, renders a QR/join URL and code, reports anonymous participant count, controls active experiment and session status, reveals/hides results and prompts, and finishes the room.
- Participant UX: `/class/join` accepts a six-character room code, persists only anonymous room credentials, follows host state through realtime, submits one upsertable structured response per active experiment, and provides waiting/submitted/finished/error states.
- Aggregate visualizations: one typed aggregation function produces position distributions, replacement thresholds, mean confidence trajectories, structured skeptical strategies, AI evidence frequency, teleporter branch combinations, and identity thresholds. Rendering changes between trajectories, branches, and distributions rather than repeating one chart.
- Missing configuration: `/class` exposes a deliberate connection-required state when public Supabase values are absent. `SETUP_REQUIRED.md` contains the exact migration and environment steps; no credential is invented and live realtime is not claimed as verified.

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

### Phase 6 Replace the World decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Mechanic: `/experiment/replace-world` presents one continuously visible room whose sky, wall, window, plant, desk, object, and person are replaced in registry-independent narrative order. Each replaced element acquires the same restrained synthetic coordinate structure while retaining its function and silhouette.
- Response schema: version 1 stores replacement count, the chosen criterion (`threshold`, `never-stopped`, or `origin-not-criterion`), and the exact element after which a threshold was marked. Transient motion is excluded.
- Decision timing: a threshold can be marked after any replacement; continuity and origin objections remain available throughout. This makes the interaction about locating or rejecting a boundary rather than completing a prescribed sequence.
- Revision and completion: users may reconsider before completion. Completed responses are restored for review, mark only Experiment 02 complete, and link to the real next experiment only when that route exists.
- Responsive strategy: desktop pairs the editorial argument with a large transforming scene; mobile stacks the same scene and decisions without reducing them to answer cards. All decisions are ordinary semantic buttons and no gesture is required.

### Phase 7 Evidence Chain decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Mechanic: `/experiment/evidence-chain` pairs an unverified campus-event image with a large 0–100 confidence control. The user records confidence before evidence and after each of five ordered evidence events, producing an actual belief trajectory rather than a single answer.
- Response schema: version 1 stores the current evidence count, current confidence, one semantic snapshot per evidential moment, the self-reported point at which belief became knowledge, and the evidence judged most important.
- Knowledge boundary: no percentage is interpreted as knowledge. The user identifies a point or explicitly chooses that knowledge was never reached or remains uncertain; reflection distinguishes increased justification from a universal certainty threshold.
- Visualization: a warm-yellow trajectory grows from the recorded snapshots and remains available in assessment, reflection, and completion. The chart is supplemental to labelled values and does not carry meaning through color alone.
- Accessibility and responsive behavior: the native range input retains keyboard/touch semantics. Evidence, assessment choices, and trajectory values remain in document order; mobile stacks the claim and belief panel while desktop holds them in productive tension.

### Phase 8 Brain in a Vat decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Mechanic: `/experiment/brain-vat` slows the rhythm to three user-controlled premise reveals followed by an optional open response. It deliberately avoids a primary choice mechanic and keeps the writing surface visually integrated with the editorial scene.
- Privacy and persistence: the response autosaves locally through the Individual Session boundary, is capped at 3,000 characters, remains optional, and is never graded or automatically classified. Raw writing is not intended for public Class Mode aggregation.
- Self-interpretation: after submission, users may identify the broad reasoning strategy closest to their own. The categories are user-selected descriptions—not inferred labels—and each receives cautious reflection.
- Response schema: version 1 stores meaningful premise progress, writing, submission status, and optional strategy. Browser reload restores the exact writing and stage without storing cursor or animation state.
- Mobile behavior: the composition favors negative space and a full-width text surface, with stacked strategy controls and bottom-safe actions suitable for a phone keyboard.

### Phase 9 AI Consciousness decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Mechanic: `/experiment/ai-consciousness` begins with a restrained two-part encounter, then asks users to construct an evidential standard from seven distinct signs rather than choose whether the AI is conscious.
- Exclusivity: “nothing could establish consciousness” and “unsure what would count” are explicit alternatives that clear positive evidence; selecting positive evidence clears either alternative. This prevents contradictory persisted sets.
- Comparative standard: a separate stage asks whether AI should face the same, a higher, or a different kind of standard than humans, with uncertainty available. Reflection considers the burden of evidence without declaring the machine conscious or unconscious.
- Response schema: version 1 stores encounter progress, a typed evidence set, an exclusive evidential limit, and the comparative standard. It stores no synthetic consciousness verdict or philosophical score.
- Visual and responsive strategy: evidence is composed as a numbered coral field/constellation rather than checkbox cards. Mobile uses a dense two-column evidence field and linear standards; all visual nodes remain semantic toggle buttons.

### Phase 10 Teleporter decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Branching mechanic: `/experiment/teleporter` first asks about destructive transport, then preserves the Earth original and asks who is original. The second judgment is meaningful only in light of the first and both remain in the persisted response.
- Ranking: body, memory, consciousness, unbroken continuity, uniqueness, and soul/essence form one ordered list. Dedicated up/down controls are the primary accessible method, work equally for keyboard and touch, and avoid making drag precision a requirement.
- Response schema: version 1 stores both branch judgments and a validated permutation of all six identity factors. Invalid or duplicate rankings recover to the initial canonical order.
- Reflection: the result names the tension between the two branch answers and the top-ranked condition without assigning a theory of personal identity.
- Visual strategy: one Earth–scan–Mars diagram changes meaning when the original remains. Mobile preserves the branch diagram and uses full-width ranking rows with 44px reorder controls.

### Phase 11 Replace Yourself decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Continuous mechanic: `/experiment/replace-yourself` keeps one figure, one cumulative sequence, and one replacement history visible while ten physical and psychological features change. It does not route through ten repeated question pages.
- Checkpoints: identity judgments occur only after replacements 2, 4, 6, 8, and 10. Each checkpoint records same person, no longer the same person, or unsure while preserving the full cumulative context.
- Response schema: version 1 stores replacement count and one validated judgment per reached checkpoint. Derived logic identifies the first judgment change and separates physical-stage from psychological-stage effects without treating either as philosophically decisive.
- Reflection: copy reports patterns such as physical continuity surviving while psychological change altered judgment, but avoids assigning a personal-identity theory. Completion leads to the real Philosophical Map boundary.
- Visual and mobile strategy: a single evolving figure, physical/psychological meters, and struck-through replacement ledger communicate accumulation. Mobile stacks these elements but preserves the continuous scene and semantic controls.

## Philosophical scoring

- Status: CONFIRMED BY SPECIFICATION.
- Decision: central deterministic rules map actual answers to broad dimensions and descriptive observations. Avoid arbitrary decimals, diagnosis, philosopher matching, and LLM-generated interpretations.
- Open attention: weights and templates must be reviewed for philosophical responsibility and tested with fixture sessions.

### Phase 12 Philosophical Map decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Interpretation engine: one pure central function reads validated experiment responses and accumulates only declared contributions to five dimensions. A dimension uses the mean of its available contributions, then maps it to one of five broad positions; the UI never displays the underlying number.
- Scope: experiments contribute only where their mechanic provides relevant evidence. No experiment is forced to affect every dimension, and incomplete dimensions remain explicitly balanced with zero contributors rather than receiving invented data.
- Observations: 3–5 deterministic statements are selected from actual response details such as a replacement threshold, most important evidence, selected AI evidence, teleporter ranking, and physical/psychological identity pattern.
- Presentation: `/map` provides labelled continua and text descriptions as the accessible primary representation; animated markers are enhancement only. The page explicitly denies score/type status and frames Descartes, Locke, Turing, and Searle as connected questions rather than personality matches.
- Incomplete access: direct visits before all experiments are complete show truthful progress and route to the first incomplete registry experiment. No result is fabricated from missing responses.

### Phase 13 Concepts and discussion decisions

- Status: TECHNICAL RECOMMENDATION, IMPLEMENTED.
- Concept registry: eight compact entries define only an explanation, central question, local significance, related experiments, and one or two connected thinkers. `/concepts` is a scannable editorial reference and links back to the experiments where each idea was encountered.
- Discussion registry: every experiment has one primary seminar prompt, one follow-up challenge, and one counterfactual variation. `/discussion` presents them as facilitation material rather than statistics or canned conclusions.
- Information architecture: Explore Concepts and Seminar Discussion now appear as quiet secondary landing destinations and at the end of the Philosophical Map. They remain visually subordinate to entering the experience.
- Attribution: thinker names identify relevant problems only; no quotations, biographies, or claims that a response makes the user similar to a thinker are included.

## Accessibility

- Status: CONFIRMED BY SPECIFICATION.
- Decision: semantic HTML, contrast, visible focus, keyboard/touch support, large targets, labels, reduced motion, color-independent meaning, and accessible fallbacks for drag interactions are release requirements.
- Open attention: validate actual mobile viewport and virtual-keyboard behavior, not only desktop emulation.

- Phase 17 validation: every public, experiment, map, concept, discussion, and Class Mode route was automatically checked at 320×700, 390×844, 768×900, and 1440×900 with zero horizontal-overflow findings. Custom mechanics expose native buttons, range inputs, textareas, or explicit reorder controls; global focus visibility and reduced-motion collapse remain active. Mobile-specific layouts adapt scene geometry, ordering, controls, and charts rather than only scaling desktop typography.

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

## Final audit and deployment status

- Phase 18 content audit: all visible experiment, reflection, map, concept, and discussion copy was reviewed against `PROJECT_SPEC.md`. No fabricated quotation, correct/incorrect language, philosopher matching, categorical identity diagnosis, or hidden numerical score remains. Interpretations describe the weight placed by responses and preserve contested alternatives.
- Phase 19 responsive QA: all 16 product/internal routes were checked at 320×700, 390×844, 768×900, and 1440×900; no horizontal overflow was detected. A real persisted browser session completed all seven experiments and reached the full Philosophical Map. Reload restoration, semantic control state, autosave, progress, and browser console were inspected during the flow.
- Phase 19 performance: experiment code remains route-split, static concept/discussion pages ship minimal client JavaScript, Supabase and QR dependencies are isolated to Class Mode routes, and no large media asset or looping decorative system was introduced.
- Dependency audit: npm reports one high and one moderate advisory in Next.js's bundled PostCSS. The offered automatic remediation upgrades to Next.js 16 and is breaking, so it was not force-applied during final QA. The application does not accept user-controlled CSS input; a planned framework upgrade should still resolve this dependency advisory.
- Phase 20 deployment: repository build/run documentation and rollback instructions are complete. Actual publication and live Supabase verification remain blocked by a hosting target and external public Supabase configuration that are not present in this environment.
