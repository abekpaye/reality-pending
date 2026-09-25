import { describe, expect, it } from "vitest";
import { evidenceIds } from "./evidence-chain.types";
import { initialEvidenceChainState, parseEvidenceChainState, recordConfidence, serializeEvidenceChainState } from "./evidence-chain.logic";

describe("Evidence Chain domain", () => {
  it("records one confidence value for each evidential moment", () => {
    let state = initialEvidenceChainState;
    const values = [32, 55, 28, 63, 82, 94];
    for (const value of values) state = recordConfidence({ ...state, confidence: value });
    expect(state.stage).toBe("assessment");
    expect(state.history.map(item => item.value)).toEqual(values);
    expect(state.history).toHaveLength(evidenceIds.length + 1);
  });

  it("replaces rather than duplicates a snapshot for the same moment", () => {
    const once = recordConfidence({ ...initialEvidenceChainState, confidence: 20 });
    const restoredAtInitial = { ...once, revealedCount: 0, confidence: 40 };
    const twice = recordConfidence(restoredAtInitial);
    expect(twice.history).toHaveLength(1);
    expect(twice.history[0].value).toBe(40);
  });

  it("round-trips a completed assessment", () => {
    const value = { ...initialEvidenceChainState, stage: "completed" as const, revealedCount: 5, confidence: 91, history: [{ after: "initial-claim" as const, value: 42 }], knowledgeAt: "cctv" as const, mostImportant: "cctv" as const };
    expect(parseEvidenceChainState(serializeEvidenceChainState(value))).toEqual(value);
  });

  it("rejects invalid confidence history", () => {
    expect(parseEvidenceChainState({ version: 1, stage: "updating", revealedCount: 1, confidence: 50, history: [{ after: "cctv", value: 140 }], knowledgeAt: null, mostImportant: null })).toEqual(initialEvidenceChainState);
  });
});
