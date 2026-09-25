import type { JsonValue } from "@/features/individual-session/types";
import type { ExperimentId } from "@/types/experiments";
export type ClassStatus = "waiting" | "active" | "finished";
export interface ClassSession {
  id: string;
  roomCode: string;
  status: ClassStatus;
  activeExperiment: ExperimentId | null;
  resultsRevealed: boolean;
  discussionVisible: boolean;
  expiresAt: string;
}
export interface HostCredentials {
  sessionId: string;
  roomCode: string;
  hostToken: string;
}
export interface ParticipantCredentials {
  sessionId: string;
  participantId: string;
  participantToken: string;
  roomCode: string;
}
export interface ClassResponse {
  experimentId: ExperimentId;
  payload: JsonValue;
}
export interface HostSnapshot {
  participantCount: number;
  responses: ClassResponse[];
}
