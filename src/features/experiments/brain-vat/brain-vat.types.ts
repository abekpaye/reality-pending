export const reasoningStrategies = ["sensory-trust", "logical-consistency", "external-verification", "practical-acceptance", "certainty-impossible"] as const;
export type ReasoningStrategy = (typeof reasoningStrategies)[number];
export type BrainVatStage = "premise" | "response" | "reflection" | "completed";
export interface BrainVatResponseState { version: 1; stage: BrainVatStage; premiseStep: 0 | 1 | 2; response: string; submitted: boolean; strategy: ReasoningStrategy | null }
