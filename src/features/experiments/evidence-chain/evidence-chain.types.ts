export const evidenceIds = ["known-sharer", "ai-warning", "eyewitnesses", "cctv", "official-confirmation"] as const;
export type EvidenceId = (typeof evidenceIds)[number];
export type KnowledgePoint = "initial-claim" | EvidenceId | "never" | "uncertain";
export type EvidenceChainStage = "updating" | "assessment" | "reflection" | "completed";

export interface ConfidenceSnapshot { after: "initial-claim" | EvidenceId; value: number }
export interface EvidenceChainResponseState {
  version: 1;
  stage: EvidenceChainStage;
  revealedCount: number;
  confidence: number;
  history: ConfidenceSnapshot[];
  knowledgeAt: KnowledgePoint | null;
  mostImportant: EvidenceId | null;
}
