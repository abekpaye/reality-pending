import {
  experimentIds,
  getExperimentIndex,
  getNextAvailableExperimentId,
  getNextExperimentId,
  getPreviousExperimentId,
} from "@/features/individual-session/registry";
import type { IndividualSession, JsonValue, SessionProgressSummary } from "@/features/individual-session/types";
import type { ExperimentId, ExperimentMetadata } from "@/types/experiments";

function timestamp(now?: () => string): string {
  return (now ?? (() => new Date().toISOString()))();
}

export function startExperiment(session: IndividualSession, id: ExperimentId, now?: () => string): IndividualSession {
  if (session.experiments[id].status === "completed") return session;
  const updatedAt = timestamp(now);
  return {
    ...session,
    status: "in-progress",
    currentExperiment: id,
    updatedAt,
    experiments: {
      ...session.experiments,
      [id]: {
        ...session.experiments[id],
        status: "in-progress",
        startedAt: session.experiments[id].startedAt ?? updatedAt,
      },
    },
  };
}

export function updateExperimentData(
  session: IndividualSession,
  id: ExperimentId,
  data: JsonValue,
  now?: () => string,
): IndividualSession {
  const started = session.experiments[id].status === "not-started" ? startExperiment(session, id, now) : session;
  return {
    ...started,
    updatedAt: timestamp(now),
    experiments: {
      ...started.experiments,
      [id]: { ...started.experiments[id], data },
    },
  };
}

export function completeExperiment(
  session: IndividualSession,
  id: ExperimentId,
  data?: JsonValue,
  now?: () => string,
): IndividualSession {
  const completedAt = timestamp(now);
  const completedExperimentIds = experimentIds.filter(
    (experimentId) => experimentId === id || session.completedExperimentIds.includes(experimentId),
  );
  const allComplete = completedExperimentIds.length === experimentIds.length;

  return {
    ...session,
    status: allComplete ? "completed" : "in-progress",
    currentExperiment: session.currentExperiment === id ? null : session.currentExperiment,
    completedExperimentIds,
    updatedAt: completedAt,
    experiments: {
      ...session.experiments,
      [id]: {
        ...session.experiments[id],
        status: "completed",
        data: data === undefined ? session.experiments[id].data : data,
        startedAt: session.experiments[id].startedAt ?? completedAt,
        completedAt,
      },
    },
  };
}

export function startNextAvailableExperiment(
  session: IndividualSession,
  after: ExperimentId,
  registry?: readonly ExperimentMetadata[],
  now?: () => string,
): IndividualSession {
  const next = getNextAvailableExperimentId(after, registry);
  return next ? startExperiment(session, next, now) : session;
}

export function getSessionProgress(session: IndividualSession): SessionProgressSummary {
  return {
    currentExperimentIndex: session.currentExperiment === null ? null : getExperimentIndex(session.currentExperiment),
    completedCount: session.completedExperimentIds.length,
    totalExperiments: experimentIds.length,
  };
}

export function isExperimentComplete(session: IndividualSession, id: ExperimentId): boolean {
  return session.experiments[id].status === "completed";
}

export { getNextExperimentId, getPreviousExperimentId };
