import type { JsonValue } from "@/features/individual-session/types";
import { reasoningStrategies, type BrainVatResponseState, type ReasoningStrategy } from "./brain-vat.types";
export const initialBrainVatState: BrainVatResponseState = { version: 1, stage: "premise", premiseStep: 0, response: "", submitted: false, strategy: null };
export function isReasoningStrategy(value: unknown): value is ReasoningStrategy { return reasoningStrategies.includes(value as ReasoningStrategy); }
export function parseBrainVatState(value: JsonValue | null): BrainVatResponseState {
  if(value===null||typeof value!=="object"||Array.isArray(value)) return initialBrainVatState;
  const stage=value.stage; const step=value.premiseStep;
  if(value.version!==1||!(stage==="premise"||stage==="response"||stage==="reflection"||stage==="completed")||!(step===0||step===1||step===2)||typeof value.response!=="string"||value.response.length>3000||typeof value.submitted!=="boolean"||!(value.strategy===null||isReasoningStrategy(value.strategy))) return initialBrainVatState;
  return {version:1,stage,premiseStep:step,response:value.response,submitted:value.submitted,strategy:value.strategy as ReasoningStrategy|null};
}
export function serializeBrainVatState(state: BrainVatResponseState): JsonValue { return {...state}; }
