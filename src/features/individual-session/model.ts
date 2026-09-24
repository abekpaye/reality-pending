import { experimentIds, isExperimentId } from "@/features/individual-session/registry";
import type { ExperimentSessionState, IndividualSession, JsonValue } from "@/features/individual-session/types";
import type { ExperimentId } from "@/types/experiments";

export const INDIVIDUAL_SESSION_SCHEMA_VERSION = 1 as const;

export interface SessionFactoryOptions {
  now?: () => string;
  createId?: () => string;
}

function createAnonymousSessionId(): string {
  return crypto.randomUUID();
}

function createEmptyExperimentState(): ExperimentSessionState {
  return { status: "not-started", data: null, startedAt: null, completedAt: null };
}

export function createFreshIndividualSession(options: SessionFactoryOptions = {}): IndividualSession {
  const timestamp = (options.now ?? (() => new Date().toISOString()))();
  const createId = options.createId ?? createAnonymousSessionId;
  const experiments = Object.fromEntries(
    experimentIds.map((id) => [id, createEmptyExperimentState()]),
  ) as Record<ExperimentId, ExperimentSessionState>;

  return {
    version: INDIVIDUAL_SESSION_SCHEMA_VERSION,
    sessionId: createId(),
    status: "not-started",
    currentExperiment: null,
    completedExperimentIds: [],
    experiments,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(value).every(isJsonValue);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isExperimentState(value: unknown): value is ExperimentSessionState {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const state = value as Record<string, unknown>;
  return (
    (state.status === "not-started" || state.status === "in-progress" || state.status === "completed") &&
    isJsonValue(state.data) &&
    (state.startedAt === null || isIsoDate(state.startedAt)) &&
    (state.completedAt === null || isIsoDate(state.completedAt))
  );
}

export function isIndividualSession(value: unknown): value is IndividualSession {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const session = value as Record<string, unknown>;
  if (session.version !== INDIVIDUAL_SESSION_SCHEMA_VERSION) return false;
  if (typeof session.sessionId !== "string" || session.sessionId.length === 0) return false;
  if (session.status !== "not-started" && session.status !== "in-progress" && session.status !== "completed") return false;
  if (session.currentExperiment !== null && !isExperimentId(session.currentExperiment)) return false;
  if (!Array.isArray(session.completedExperimentIds) || !session.completedExperimentIds.every(isExperimentId)) return false;
  if (new Set(session.completedExperimentIds).size !== session.completedExperimentIds.length) return false;
  if (!isIsoDate(session.createdAt) || !isIsoDate(session.updatedAt)) return false;
  if (typeof session.experiments !== "object" || session.experiments === null || Array.isArray(session.experiments)) return false;

  const experiments = session.experiments as Record<string, unknown>;
  const keys = Object.keys(experiments);
  if (keys.length !== experimentIds.length || !keys.every(isExperimentId)) return false;
  if (!experimentIds.every((id) => isExperimentState(experiments[id]))) return false;

  const completed = new Set(session.completedExperimentIds);
  if (experimentIds.some((id) => (experiments[id] as ExperimentSessionState).status === "completed" !== completed.has(id))) return false;
  if (session.currentExperiment !== null && (experiments[session.currentExperiment] as ExperimentSessionState).status !== "in-progress") return false;
  if (session.status === "completed" && completed.size !== experimentIds.length) return false;
  if (
    session.status === "not-started" &&
    (session.currentExperiment !== null || completed.size > 0 || experimentIds.some((id) => (experiments[id] as ExperimentSessionState).status !== "not-started"))
  ) return false;
  return true;
}
