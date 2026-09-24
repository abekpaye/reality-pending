# REALITY PENDING — Project Specification

## 1. Product identity

REALITY PENDING is an interactive philosophy lab for a university seminar. It must place people inside philosophical situations so that they experience a problem, make a decision, encounter a consequence or contradiction, reflect, and only then meet the relevant philosophical context.

It is not a quiz, survey, textbook, encyclopedia, slideshow, generic dashboard, personality test, philosopher-matching system, or automatic essay grader. There are no ordinary correct answers. The system describes response tendencies without diagnosing users or assigning philosophical identities.

Core questions: What is real? What can be known? Can sensory experience be trusted? What would count as evidence of machine consciousness? Would a perfect copy still be you? How much can change before someone becomes someone else?

## 2. Audience and modes

Primary users are university students and philosophy instructors; the experience must work especially well on smartphones. Secondary users are anyone interested in introductory philosophy. The interface language is English for the initial release.

### Individual Mode

Works without authentication and remains usable without Supabase. It stores an anonymous session, current experiment, progress, answers, experiment-specific state, philosophical dimension contributions, and completion status locally. Progress survives refresh and can be intentionally restarted. It ends in a Personal Philosophical Map.

### Class Mode

For a live seminar: a host creates a session, receives a short room code and QR/join link, students join anonymously without names, email, accounts, or student IDs, the host controls the current experiment and stages, participants respond, and the host reveals anonymous aggregate results and discussion prompts. Supabase Realtime is the intended backend. Host controls include create room, show code/QR, participant count, start/advance, reveal/hide results, show discussion prompt, next experiment, and finish. Participants need a quick join flow and waiting state. The host view is projection-friendly; the participant view is mobile-first.

## 3. Journey

LANDING → INTRO → 01 Simulation → 02 Replace the World → 03 Evidence Chain → 04 Brain in a Vat → 05 AI Consciousness → 06 The Teleporter → 07 Replace Yourself → YOUR PHILOSOPHICAL MAP → Explore Concepts / Discussion.

Landing copy: REALITY PENDING; An Interactive Philosophy Experiment; “What is real? What can you know? What makes you human?” Primary action ENTER THE EXPERIMENT; secondary actions CLASS MODE and EXPLORE CONCEPTS. Optional short line: “Think first. Decide second. Doubt everything.” Intro progressively reveals: this is not a test, there are no simple correct answers, and users should respond according to what they actually believe; it ends with BEGIN.

## 4. Experiments

Every experiment must use a meaningfully different mechanic and must be implemented as the actual interaction, not a placeholder or generic three-button question.

### 01 — WHAT IS REAL? (`simulation`)

Ontology, metaphysics, reality, appearance. Reveal that the universe is proven to be a simulation while memories, relationships, and experience remain unchanged. Ask whether anything important about reality changed. The user chooses among three spatial conceptual zones: physical external reality is required; experience can still be real; certainty is unavailable. Afterward, cautiously connect the response to realism, idealism, and skepticism. Signature: physical-to-simulated transition, electric blue.

### 02 — WHEN DOES REALITY STOP BEING REAL? (`replace-world`)

Ontology, continuity, digital simulation. Show a minimal scene (sky, wall, window, plant, desk, object, human silhouette). The user progressively replaces physical elements with simulated equivalents and can mark a threshold, choose that reality never stopped, or reject material origin as the right criterion. Record threshold and rejection state. Reflect the criterion used. Signature: transforming scene, lime.

### 03 — HOW DO YOU KNOW? (`evidence-chain`)

Epistemology, belief, evidence, justification, skepticism. Begin with an unusual university-event image and a 0–100 confidence control. Reveal evidence one item at a time: known sharer, AI-generation warning, three independent eyewitnesses, CCTV, official university confirmation. After each item, require or invite a confidence update and store every value. Animate a belief timeline; ask when belief became knowledge and which evidence mattered most. Connect belief, evidence, justification, knowledge, and skepticism without declaring a percentage to be knowledge. Signature: warm yellow confidence trajectory.

### 04 — CAN YOU TRUST YOUR EXPERIENCE? (`brain-vat`)

Radical skepticism, knowledge, sensory experience, certainty. Slowly reveal the brain-in-a-vat scenario and ask what evidence could prove it is not the user’s current situation. Provide a comfortable optional 1–3 sentence response with autosave, no grading, score, or classification. After submission, introduce radical skepticism and optionally let the user self-select a broad reasoning strategy: trust sensory experience, logical consistency, external verification, practical acceptance, or certainty may be impossible. Signature: quiet typography, negative space, soft violet.

### 05 — CAN A MACHINE BE CONSCIOUS? (`ai-consciousness`)

Philosophy of technology, AI, consciousness, mind, human identity. Present an AI saying it does not want to be turned off and feels afraid. Ask what would convince the user. Build an evidence set from verbal report, human-like behavior, long-term memory, pain reports, self-reflection, brain-like mechanisms, consistent behavior, nothing could establish consciousness, and unsure. Then ask whether AI should face a different evidence standard than humans. Use cautious interpretations: behavioral, internal-mechanism, biological, or skeptical weighting. Signature: restrained coral/orange-red technology language.

### 06 — WOULD YOU SURVIVE? (`teleporter`)

Personal identity, continuity, memory, body, self. Stage 1: scan a body, create an exact Mars copy with all memories/personality/emotions, destroy the original; ask yes/no/unsure. Stage 2: keep the original and ask who is original: Earth, Mars, both, neither, or the scenario exposes a problem. Stage 3: accessible drag-and-drop ranking of body, memory, consciousness, continuity, uniqueness, and soul/essence, with a non-drag fallback. Reflect tensions across stages without overclaiming. Signature: Earth → scan → Mars branch, blue-violet.

### 07 — WHAT MAKES YOU YOU? (`replace-yourself`)

Philosophical anthropology, identity, body, mind, memory, selfhood. Maintain one evolving identity visualization while replacing hair, skin, arm, heart, eyes, brain portions, memories, personality, voice, and emotional patterns. At meaningful stages ask same person / not / unsure within the continuous interaction. Track the judgment-change point and physical versus psychological effects. Reflect patterns such as physical replacement rarely changing judgment while memory replacement did. Signature: culminating continuous replacement, magenta/violet.

## 5. Results and discussion

The Personal Philosophical Map is a descriptive map, not a score, type, diagnosis, or philosopher match. Dimensions are Reality (material ↔ experiential), Knowledge (certainty ↔ skepticism), Mind (biological requirement ↔ functional/machine-compatible), Identity (bodily ↔ psychological continuity), and Technology (human-exclusive ↔ openness to machine consciousness). Use centrally defined deterministic rules and broad positions (strong-left through strong-right or balanced); avoid false precision. Generate 3–5 concise deterministic template observations such as experiential continuity, evidence requirements, or memory versus bodily continuity.

Optionally connect ideas to Plato, René Descartes, John Locke, Alan Turing, and John Searle. Phrase these as questions raised by responses, never as “you are X.” Explore Concepts is compact and scannable: Philosophy, Ontology, Metaphysics, Epistemology, Skepticism, Consciousness, Personal Identity, and Philosophy of Technology. Each gets a short explanation, central question, why it matters, the experiment where it appeared, and one or two relevant thinkers.

Discussion prompts should follow relevant results, e.g. what is missing from a fully real simulation, when belief becomes knowledge, whether behavioral evidence is enough for AI, what makes a copy not-you, and where identity resides. Class visualizations should vary by experiment: position distribution, threshold distribution, confidence trajectory, structured strategies only for Brain in a Vat, evidence frequency, teleporter branches, and identity-change threshold. Do not expose raw Brain in a Vat writing by default.

## 6. Design system

Visual thesis: modern, minimalist, intelligent, slightly futuristic editorial interaction design combining technology and philosophy; expressive but not childish, corporate, generic SaaS, or cyberpunk. Base dark palette: background `#0B0D10`, surface `#11151B`, border `#1D2430`, primary `#F5F7FA`, secondary `#A9B2C3`. Accents are contextual: blue `#4DA3FF`, lime `#B7FF3C`, coral `#FF6B6B`, violet `#9A7CFF`, yellow `#FFD84D`; do not use every accent on one screen. Use a clean modern sans serif such as Inter, Manrope, Sora, or Geist with strong hierarchy, large editorial headings, short text blocks, and generous line-height.

Use one idea per screen, whitespace, near-full-screen moments where useful, and composition rather than rounded cards. Avoid excessive glassmorphism, gradient text, glowing borders, badges, pills, repeated three-column grids, generic dashboard chrome, meaningless icons, random animation, and excessive shadows. Motion must communicate progression, transformation, uncertainty, consequence, comparison, or reveal; honor `prefers-reduced-motion`.

## 7. Accessibility and mobile

Use semantic HTML, sufficient contrast, visible focus, touch targets, readable labels, keyboard support, and no color-only meaning. Drag interactions need accessible fallbacks. Support reduced motion. Test 320, 375, 390, 430px and tablet widths; prevent horizontal scrolling. Sliders must work by touch, text inputs with virtual keyboards, and viewport-height changes must not hide controls. Charts must remain legible on mobile. Class Mode must be intentionally smartphone-first, not merely shrunk desktop.

## 8. Technical requirements

Preferred stack: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Supabase. Preserve compatible existing tooling. Keep clean separation among application shell, experiments, philosophical content, session state, scoring, Class Mode, visualizations, and reusable interaction primitives. Maintain a central experiment registry with id, slug, title, short title, topic, accent, order, completion state, and discussion prompt; do not force unique experiments into one weak generic schema.

Individual state must be local and resilient to refresh/corruption. Class data must include session, room code, host token, anonymous participant id, active experiment, response, timestamps, and status; never put privileged keys in the browser. Handle invalid/expired rooms, disconnects, unavailable realtime, failed submissions, corrupted local state, refresh, and missing configuration. Add `.env.example` where needed. Provide maintainable TypeScript, tests for important logic, README, linting, production-build validation, and no committed secrets.

## 9. Non-goals and success criteria

Do not build social networking, accounts, LMS features, an encyclopedia, a central AI chatbot, leaderboards, competitive scoring, long biographies, or automatic philosophical essay grading. Do not add speculative features that weaken the core.

Success means users do not describe this as a quiz; experiments feel different; interaction communicates the problem before theory; the result is reflective rather than judgmental; the interface is professional; mobile interaction is intentional; class results generate discussion; the site is understandable without a long explanation; and technology and interaction design visibly support the philosophical experience.

## 10. Future scope

The current scope is only the first five course topics and the seven experiments above. Future modules should be possible without making the current architecture complex. English/Russian toggle, sound, downloadable/shareable results, and exported seminar summaries are optional and must not delay the core experience.
