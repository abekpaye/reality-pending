import { describe, expect, it } from "vitest";
import {
  completeExperiment,
  getSessionProgress,
  isExperimentComplete,
  startExperiment,
  startNextAvailableExperiment,
  updateExperimentData,
} from "@/features/individual-session/actions";
import { createFreshIndividualSession } from "@/features/individual-session/model";
import { experimentIds, getNextExperimentId, getPreviousExperimentId } from "@/features/individual-session/registry";
import { experimentRegistry } from "@/data/experiments";

const firstTime = "2026-01-01T00:00:00.000Z";
const secondTime = "2026-01-02T00:00:00.000Z";

function fresh() {
  return createFreshIndividualSession({ now: () => firstTime, createId: () => "session-one" });
}

describe("Individual Session model", () => {
  it("creates a stable versioned session for every registered experiment", () => {
    const session = fresh();
    expect(session).toMatchObject({
      version: 1,
      sessionId: "session-one",
      status: "not-started",
      currentExperiment: null,
      completedExperimentIds: [],
      createdAt: firstTime,
      updatedAt: firstTime,
    });
    expect(Object.keys(session.experiments)).toEqual(experimentIds);
    expect(session.experiments.simulation).toEqual({ status: "not-started", data: null, startedAt: null, completedAt: null });
  });

  it("starts an experiment without conflating app availability with user progress", () => {
    const session = startExperiment(fresh(), "simulation", () => secondTime);
    expect(session.status).toBe("in-progress");
    expect(session.currentExperiment).toBe("simulation");
    expect(session.experiments.simulation.status).toBe("in-progress");
    expect(session.experiments.simulation.startedAt).toBe(secondTime);
  });

  it("stores JSON-safe experiment data without a question schema", () => {
    const session = updateExperimentData(fresh(), "evidence-chain", { confidence: [20, 45, 72] }, () => secondTime);
    expect(session.experiments["evidence-chain"].data).toEqual({ confidence: [20, 45, 72] });
    expect(session.experiments["evidence-chain"].status).toBe("in-progress");
  });

  it("marks completion and reports registry-derived progress", () => {
    const session = completeExperiment(fresh(), "simulation", { position: "uncertain" }, () => secondTime);
    expect(isExperimentComplete(session, "simulation")).toBe(true);
    expect(session.completedExperimentIds).toEqual(["simulation"]);
    expect(session.currentExperiment).toBeNull();
    expect(getSessionProgress(session)).toEqual({ currentExperimentIndex: null, completedCount: 1, totalExperiments: 7 });
  });

  it("derives previous, next, and next available experiments from the registry", () => {
    expect(getPreviousExperimentId("simulation")).toBeNull();
    expect(getNextExperimentId("simulation")).toBe("replace-world");

    const registry = experimentRegistry.map((experiment) => (
      experiment.id === "replace-world" ? { ...experiment, availability: "available" as const } : experiment
    ));
    const session = startNextAvailableExperiment(fresh(), "simulation", registry, () => secondTime);
    expect(session.currentExperiment).toBe("replace-world");
  });
});
