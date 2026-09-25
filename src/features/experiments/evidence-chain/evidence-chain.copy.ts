import type { EvidenceId } from "./evidence-chain.types";

export const evidenceCopy: Record<EvidenceId, { source: string; statement: string }> = {
  "known-sharer": { source: "PERSONAL SOURCE", statement: "The image was shared by someone you know and generally trust." },
  "ai-warning": { source: "PLATFORM NOTICE", statement: "The platform flags the image as potentially AI-generated." },
  eyewitnesses: { source: "INDEPENDENT REPORTS", statement: "Three people who do not know one another say they witnessed the event." },
  cctv: { source: "CAMPUS CCTV", statement: "Security footage shows the same object crossing the university courtyard." },
  "official-confirmation": { source: "UNIVERSITY STATEMENT", statement: "The university confirms that the event occurred and that an investigation is underway." },
};

export const knowledgeLabels = {
  "initial-claim": "The first image",
  "known-sharer": "A known sharer",
  "ai-warning": "The AI warning",
  eyewitnesses: "Independent witnesses",
  cctv: "CCTV footage",
  "official-confirmation": "Official confirmation",
  never: "It never became knowledge",
  uncertain: "I remain uncertain",
} as const;
