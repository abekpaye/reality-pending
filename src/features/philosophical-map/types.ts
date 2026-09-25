export type MapDimensionId =
  "reality" | "knowledge" | "mind" | "identity" | "technology";
export type BroadPosition =
  "strong-left" | "left" | "balanced" | "right" | "strong-right";
export interface DimensionDefinition {
  id: MapDimensionId;
  title: string;
  left: string;
  right: string;
  description: string;
}
export interface DimensionResult extends DimensionDefinition {
  position: BroadPosition;
  value: number;
  contributors: number;
}
export interface PhilosophicalMapResult {
  dimensions: DimensionResult[];
  observations: string[];
  completeExperiments: number;
}
