export const replacementElements = ["sky", "wall", "window", "plant", "desk", "object", "person"] as const;
export type ReplacementElement = (typeof replacementElements)[number];
export type RealityCriterion = "threshold" | "never-stopped" | "origin-not-criterion";
export type ReplaceWorldStage = "transforming" | "reflection" | "completed";

export interface ReplaceWorldResponseState {
  version: 1;
  stage: ReplaceWorldStage;
  replacedCount: number;
  criterion: RealityCriterion | null;
  thresholdAfter: ReplacementElement | null;
}
