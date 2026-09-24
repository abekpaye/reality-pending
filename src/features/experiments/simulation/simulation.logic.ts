import type { JsonValue } from "@/features/individual-session/types";
import { simulationPositions, type SimulationPosition, type SimulationResponseState } from "./simulation.types";

export const initialSimulationState: SimulationResponseState = {
  version: 1,
  stage: "narrative",
  narrativeStep: 0,
  selectedPosition: null,
  committedPosition: null,
};

export function isSimulationPosition(value: unknown): value is SimulationPosition {
  return typeof value === "string" && simulationPositions.includes(value as SimulationPosition);
}

export function parseSimulationState(value: JsonValue | null): SimulationResponseState {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return initialSimulationState;
  const stage = value.stage;
  const narrativeStep = value.narrativeStep;
  const selectedPosition = value.selectedPosition;
  const committedPosition = value.committedPosition;
  const validStage = stage === "narrative" || stage === "positioning" || stage === "reflection" || stage === "completed";
  const validStep = narrativeStep === 0 || narrativeStep === 1 || narrativeStep === 2;
  const validSelected = selectedPosition === null || isSimulationPosition(selectedPosition);
  const validCommitted = committedPosition === null || isSimulationPosition(committedPosition);

  if (value.version !== 1 || !validStage || !validStep || !validSelected || !validCommitted) return initialSimulationState;
  if ((stage === "reflection" || stage === "completed") && committedPosition === null) return initialSimulationState;

  return { version: 1, stage, narrativeStep, selectedPosition, committedPosition };
}

export function serializeSimulationState(state: SimulationResponseState): JsonValue {
  return {
    version: state.version,
    stage: state.stage,
    narrativeStep: state.narrativeStep,
    selectedPosition: state.selectedPosition,
    committedPosition: state.committedPosition,
  };
}
