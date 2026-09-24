"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  completeExperiment as completeExperimentState,
  getSessionProgress,
  startExperiment as startExperimentState,
  updateExperimentData as updateExperimentDataState,
} from "@/features/individual-session/actions";
import {
  loadIndividualSession,
  restartIndividualSession,
  saveIndividualSession,
} from "@/features/individual-session/storage";
import type { IndividualSession, JsonValue, SessionProgressSummary } from "@/features/individual-session/types";
import type { ExperimentId } from "@/types/experiments";

interface IndividualSessionContextValue {
  session: IndividualSession | null;
  ready: boolean;
  persistenceAvailable: boolean;
  progress: SessionProgressSummary | null;
  startExperiment(id: ExperimentId): void;
  updateExperimentData(id: ExperimentId, data: JsonValue): void;
  completeExperiment(id: ExperimentId, data?: JsonValue): void;
  restartExperience(): void;
}

const IndividualSessionContext = createContext<IndividualSessionContextValue | null>(null);

export function IndividualSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<IndividualSession | null>(null);
  const [ready, setReady] = useState(false);
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);

  useEffect(() => {
    const result = loadIndividualSession(window.localStorage);
    setSession(result.session);
    setPersistenceAvailable(result.persisted);
    setReady(true);
  }, []);

  const updateSession = useCallback((transition: (current: IndividualSession) => IndividualSession) => {
    setSession((current) => {
      if (current === null) return current;
      const next = transition(current);
      if (!saveIndividualSession(window.localStorage, next)) setPersistenceAvailable(false);
      return next;
    });
  }, []);

  const startExperiment = useCallback((id: ExperimentId) => {
    updateSession((current) => startExperimentState(current, id));
  }, [updateSession]);

  const updateExperimentData = useCallback((id: ExperimentId, data: JsonValue) => {
    updateSession((current) => updateExperimentDataState(current, id, data));
  }, [updateSession]);

  const completeExperiment = useCallback((id: ExperimentId, data?: JsonValue) => {
    updateSession((current) => completeExperimentState(current, id, data));
  }, [updateSession]);

  const restartExperience = useCallback(() => {
    const result = restartIndividualSession(window.localStorage);
    setSession(result.session);
    setPersistenceAvailable(result.persisted);
  }, []);

  const value = useMemo<IndividualSessionContextValue>(() => ({
    session,
    ready,
    persistenceAvailable,
    progress: session ? getSessionProgress(session) : null,
    startExperiment,
    updateExperimentData,
    completeExperiment,
    restartExperience,
  }), [completeExperiment, persistenceAvailable, ready, restartExperience, session, startExperiment, updateExperimentData]);

  return (
    <IndividualSessionContext.Provider value={value}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <output
          hidden
          aria-hidden="true"
          data-individual-session-probe
          data-ready={String(ready)}
          data-persistence-available={String(persistenceAvailable)}
          data-session-id={session?.sessionId ?? ""}
          data-session-status={session?.status ?? "unavailable"}
        />
      )}
    </IndividualSessionContext.Provider>
  );
}

export function useIndividualSession(): IndividualSessionContextValue {
  const context = useContext(IndividualSessionContext);
  if (context === null) throw new Error("useIndividualSession must be used within IndividualSessionProvider");
  return context;
}

export function useExperimentSession(id: ExperimentId) {
  const context = useIndividualSession();
  const experiment = context.session?.experiments[id] ?? null;
  return {
    ready: context.ready,
    persistenceAvailable: context.persistenceAvailable,
    experiment,
    start: () => context.startExperiment(id),
    updateData: (data: JsonValue) => context.updateExperimentData(id, data),
    complete: (data?: JsonValue) => context.completeExperiment(id, data),
  };
}
