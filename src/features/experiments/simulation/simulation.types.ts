export const simulationPositions = ["physical-reality", "experiential-reality", "uncertain"] as const;

export type SimulationPosition = (typeof simulationPositions)[number];
export type SimulationStage = "narrative" | "positioning" | "reflection" | "completed";

export interface SimulationResponseState {
  version: 1;
  stage: SimulationStage;
  narrativeStep: 0 | 1 | 2;
  selectedPosition: SimulationPosition | null;
  committedPosition: SimulationPosition | null;
}
