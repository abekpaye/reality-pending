import type { JsonValue } from "@/features/individual-session/types";
import { evidenceIds, type ConfidenceSnapshot, type EvidenceChainResponseState, type EvidenceId, type KnowledgePoint } from "./evidence-chain.types";

export const initialEvidenceChainState: EvidenceChainResponseState = { version: 1, stage: "updating", revealedCount: 0, confidence: 50, history: [], knowledgeAt: null, mostImportant: null };
export const clampConfidence = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
export function recordConfidence(state: EvidenceChainResponseState): EvidenceChainResponseState {
  const after = state.revealedCount === 0 ? "initial-claim" : evidenceIds[state.revealedCount - 1];
  const snapshot: ConfidenceSnapshot = { after, value: clampConfidence(state.confidence) };
  const history = [...state.history.filter((item) => item.after !== after), snapshot];
  return state.revealedCount === evidenceIds.length
    ? { ...state, stage: "assessment", history }
    : { ...state, revealedCount: state.revealedCount + 1, history };
}
export function isKnowledgePoint(value: unknown): value is KnowledgePoint { return value === "initial-claim" || value === "never" || value === "uncertain" || evidenceIds.includes(value as EvidenceId); }
export function parseEvidenceChainState(value: JsonValue | null): EvidenceChainResponseState {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return initialEvidenceChainState;
  const validStage = value.stage === "updating" || value.stage === "assessment" || value.stage === "reflection" || value.stage === "completed";
  const validCount = Number.isInteger(value.revealedCount) && Number(value.revealedCount) >= 0 && Number(value.revealedCount) <= evidenceIds.length;
  const validConfidence = typeof value.confidence === "number" && value.confidence >= 0 && value.confidence <= 100;
  const knowledgeAt = value.knowledgeAt;
  const mostImportant = value.mostImportant;
  const history = value.history;
  if (value.version !== 1 || !validStage || !validCount || !validConfidence || !Array.isArray(history) || !(knowledgeAt === null || isKnowledgePoint(knowledgeAt)) || !(mostImportant === null || evidenceIds.includes(mostImportant as EvidenceId))) return initialEvidenceChainState;
  const validHistory = history.every((item) => item !== null && typeof item === "object" && !Array.isArray(item) && isKnowledgePoint(item.after) && item.after !== "never" && item.after !== "uncertain" && typeof item.value === "number" && item.value >= 0 && item.value <= 100);
  if (!validHistory) return initialEvidenceChainState;
  return { version: 1, stage: value.stage as EvidenceChainResponseState["stage"], revealedCount: Number(value.revealedCount), confidence: Number(value.confidence), history: history as unknown as ConfidenceSnapshot[], knowledgeAt: knowledgeAt as KnowledgePoint | null, mostImportant: mostImportant as EvidenceId | null };
}
export function serializeEvidenceChainState(state: EvidenceChainResponseState): JsonValue { return { ...state, history: state.history.map(item => ({ ...item })) }; }
