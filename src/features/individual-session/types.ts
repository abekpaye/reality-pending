import type { ExperimentId } from "@/types/experiments";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type IndividualExperienceStatus = "not-started" | "in-progress" | "completed";
export type UserExperimentStatus = "not-started" | "in-progress" | "completed";

export interface ExperimentSessionState {
  status: UserExperimentStatus;
  data: JsonValue;
  startedAt: string | null;
  completedAt: string | null;
}

export interface IndividualSessionV1 {
  version: 1;
  sessionId: string;
  status: IndividualExperienceStatus;
  currentExperiment: ExperimentId | null;
  completedExperimentIds: ExperimentId[];
  experiments: Record<ExperimentId, ExperimentSessionState>;
  createdAt: string;
  updatedAt: string;
}

export type IndividualSession = IndividualSessionV1;

export interface SessionProgressSummary {
  currentExperimentIndex: number | null;
  completedCount: number;
  totalExperiments: number;
}
