import type { JsonValue } from "@/features/individual-session/types";
import { replacementElements, type RealityCriterion, type ReplaceWorldResponseState } from "./replace-world.types";

export const initialReplaceWorldState: ReplaceWorldResponseState = {
  version: 1,
  stage: "transforming",
  replacedCount: 0,
  criterion: null,
  thresholdAfter: null,
};

export function parseReplaceWorldState(value: JsonValue | null): ReplaceWorldResponseState {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return initialReplaceWorldState;
  const validStage = value.stage === "transforming" || value.stage === "reflection" || value.stage === "completed";
  const validCount = Number.isInteger(value.replacedCount) && Number(value.replacedCount) >= 0 && Number(value.replacedCount) <= replacementElements.length;
  const validCriterion = value.criterion === null || value.criterion === "threshold" || value.criterion === "never-stopped" || value.criterion === "origin-not-criterion";
  const validThreshold = value.thresholdAfter === null || replacementElements.includes(value.thresholdAfter as (typeof replacementElements)[number]);
  if (value.version !== 1 || !validStage || !validCount || !validCriterion || !validThreshold) return initialReplaceWorldState;
  if ((value.stage === "reflection" || value.stage === "completed") && value.criterion === null) return initialReplaceWorldState;
  return {
    version: 1,
    stage: value.stage as ReplaceWorldResponseState["stage"],
    replacedCount: Number(value.replacedCount),
    criterion: value.criterion as ReplaceWorldResponseState["criterion"],
    thresholdAfter: value.thresholdAfter as ReplaceWorldResponseState["thresholdAfter"],
  };
}

export function decideReality(state: ReplaceWorldResponseState, criterion: RealityCriterion): ReplaceWorldResponseState {
  return {
    ...state,
    stage: "reflection",
    criterion,
    thresholdAfter: criterion === "threshold" && state.replacedCount > 0 ? replacementElements[state.replacedCount - 1] : null,
  };
}

export function serializeReplaceWorldState(state: ReplaceWorldResponseState): JsonValue {
  return { ...state };
}
