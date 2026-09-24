export type ExperimentId =
  | "simulation"
  | "replace-world"
  | "evidence-chain"
  | "brain-vat"
  | "ai-consciousness"
  | "teleporter"
  | "replace-yourself";

export type ExperimentAvailability = "planned" | "available";

export type AccentIdentifier = "blue" | "lime" | "yellow" | "violet" | "coral" | "blue-violet" | "magenta";

export type PhilosophicalTopic =
  | "Ontology"
  | "Metaphysics"
  | "Epistemology"
  | "Skepticism"
  | "Philosophy of Technology"
  | "Consciousness"
  | "Personal Identity"
  | "Philosophical Anthropology";

export interface ExperimentMetadata {
  id: ExperimentId;
  slug: string;
  order: number;
  title: string;
  shortTitle?: string;
  topics: PhilosophicalTopic[];
  accent: AccentIdentifier;
  discussionPrompt: string;
  availability: ExperimentAvailability;
}
