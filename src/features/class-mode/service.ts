import type { RealtimeChannel } from "@supabase/supabase-js";
import { isExperimentId } from "@/features/individual-session/registry";
import type {
  ClassSession,
  ClassStatus,
  HostCredentials,
  HostSnapshot,
  ParticipantCredentials,
} from "./types";
import { getSupabaseClient } from "./supabase";
import type { ExperimentId } from "@/types/experiments";
import type { JsonValue } from "@/features/individual-session/types";
const unavailable = () =>
  new Error(
    "Class Mode is not configured. Add the public Supabase environment values described in SETUP_REQUIRED.md.",
  );
function mapSession(row: Record<string, unknown>): ClassSession {
  return {
    id: String(row.id),
    roomCode: String(row.room_code),
    status: row.status as ClassStatus,
    activeExperiment: isExperimentId(row.active_experiment)
      ? row.active_experiment
      : null,
    resultsRevealed: Boolean(row.results_revealed),
    discussionVisible: Boolean(row.discussion_visible),
    expiresAt: String(row.expires_at),
  };
}
export async function createClassSession(): Promise<HostCredentials> {
  const client = getSupabaseClient();
  if (!client) throw unavailable();
  const { data, error } = await client.rpc("create_class_session");
  if (error || !data?.[0])
    throw new Error(error?.message ?? "Unable to create a class session.");
  const row = data[0];
  return {
    sessionId: row.session_id,
    roomCode: row.room_code,
    hostToken: row.host_token,
  };
}
export async function joinClassSession(
  roomCode: string,
): Promise<ParticipantCredentials> {
  const client = getSupabaseClient();
  if (!client) throw unavailable();
  const normalized = roomCode.replace(/\s/g, "").toUpperCase();
  const { data, error } = await client.rpc("join_class_session", {
    p_room_code: normalized,
  });
  if (error || !data?.[0])
    throw new Error(
      error?.message.includes("ROOM_UNAVAILABLE")
        ? "That room is unavailable or has expired."
        : (error?.message ?? "Unable to join the room."),
    );
  const row = data[0];
  return {
    sessionId: row.session_id,
    participantId: row.participant_id,
    participantToken: row.participant_token,
    roomCode: normalized,
  };
}
export async function getClassSessionByCode(
  roomCode: string,
): Promise<ClassSession | null> {
  const client = getSupabaseClient();
  if (!client) throw unavailable();
  const { data, error } = await client
    .from("class_sessions")
    .select(
      "id,room_code,status,active_experiment,results_revealed,discussion_visible,expires_at",
    )
    .eq("room_code", roomCode.toUpperCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSession(data) : null;
}
export async function updateClassSession(
  credentials: HostCredentials,
  next: {
    status: ClassStatus;
    activeExperiment: ExperimentId | null;
    resultsRevealed: boolean;
    discussionVisible: boolean;
  },
): Promise<ClassSession> {
  const client = getSupabaseClient();
  if (!client) throw unavailable();
  const { data, error } = await client.rpc("update_class_session", {
    p_session_id: credentials.sessionId,
    p_host_token: credentials.hostToken,
    p_status: next.status,
    p_active_experiment: next.activeExperiment,
    p_results_revealed: next.resultsRevealed,
    p_discussion_visible: next.discussionVisible,
  });
  if (error || !data)
    throw new Error(error?.message ?? "Unable to update the class session.");
  return mapSession(data);
}
export async function submitClassResponse(
  credentials: ParticipantCredentials,
  experimentId: ExperimentId,
  payload: JsonValue,
) {
  const client = getSupabaseClient();
  if (!client) throw unavailable();
  const { error } = await client.rpc("submit_class_response", {
    p_session_id: credentials.sessionId,
    p_participant_id: credentials.participantId,
    p_participant_token: credentials.participantToken,
    p_experiment_id: experimentId,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
}
export async function getHostSnapshot(
  credentials: HostCredentials,
): Promise<HostSnapshot> {
  const client = getSupabaseClient();
  if (!client) throw unavailable();
  const { data, error } = await client.rpc("get_host_snapshot", {
    p_session_id: credentials.sessionId,
    p_host_token: credentials.hostToken,
  });
  if (error || !data)
    throw new Error(error?.message ?? "Unable to load the host snapshot.");
  const record = data as {
    participantCount?: number;
    responses?: Array<{ experimentId: unknown; payload: JsonValue }>;
  };
  return {
    participantCount: Number(record.participantCount ?? 0),
    responses: (record.responses ?? [])
      .filter((item) => isExperimentId(item.experimentId))
      .map((item) => ({
        experimentId: item.experimentId as ExperimentId,
        payload: item.payload,
      })),
  };
}
export function subscribeToClassSession(
  roomCode: string,
  onChange: (session: ClassSession) => void,
): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};
  const channel: RealtimeChannel = client
    .channel(`class-session:${roomCode}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "class_sessions",
        filter: `room_code=eq.${roomCode}`,
      },
      (payload) => onChange(mapSession(payload.new)),
    )
    .subscribe();
  return () => {
    void client.removeChannel(channel);
  };
}
const HOST_KEY = "reality-pending:class-host";
const PARTICIPANT_KEY = "reality-pending:class-participant";
export function saveHostCredentials(value: HostCredentials) {
  sessionStorage.setItem(HOST_KEY, JSON.stringify(value));
}
export function loadHostCredentials(): HostCredentials | null {
  try {
    return JSON.parse(
      sessionStorage.getItem(HOST_KEY) ?? "null",
    ) as HostCredentials | null;
  } catch {
    return null;
  }
}
export function saveParticipantCredentials(value: ParticipantCredentials) {
  localStorage.setItem(PARTICIPANT_KEY, JSON.stringify(value));
}
export function loadParticipantCredentials(): ParticipantCredentials | null {
  try {
    return JSON.parse(
      localStorage.getItem(PARTICIPANT_KEY) ?? "null",
    ) as ParticipantCredentials | null;
  } catch {
    return null;
  }
}
