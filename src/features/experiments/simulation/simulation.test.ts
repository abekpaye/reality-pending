import { describe, expect, it } from "vitest";
import { completeExperiment, getNextExperimentId, getSessionProgress, startExperiment, updateExperimentData } from "@/features/individual-session/actions";
import { prepareExperienceStart } from "@/features/entry/experience-start";
import { createFreshIndividualSession } from "@/features/individual-session/model";
import { loadIndividualSession, saveIndividualSession } from "@/features/individual-session/storage";
import { isSimulationPosition, parseSimulationState, serializeSimulationState } from "./simulation.logic";
import type { SimulationResponseState } from "./simulation.types";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const selectedState: SimulationResponseState = {
  version: 1,
  stage: "reflection",
  narrativeStep: 2,
  selectedPosition: "experiential-reality",
  committedPosition: "experiential-reality",
};

function freshSession() {
  return createFreshIndividualSession({
    now: () => "2026-01-01T00:00:00.000Z",
    createId: () => "simulation-test-session",
  });
}

describe("Simulation domain behavior", () => {
  it("accepts only the three semantic positions", () => {
    expect(isSimulationPosition("physical-reality")).toBe(true);
    expect(isSimulationPosition("experiential-reality")).toBe(true);
    expect(isSimulationPosition("uncertain")).toBe(true);
    expect(isSimulationPosition("idealism")).toBe(false);
  });

  it("restores a valid response and rejects malformed experiment data", () => {
    expect(parseSimulationState(serializeSimulationState(selectedState))).toEqual(selectedState);
    expect(parseSimulationState({ version: 1, stage: "reflection", narrativeStep: 2, selectedPosition: null, committedPosition: null })).toMatchObject({ stage: "narrative" });
  });

  it("persists and reloads a committed Simulation response", () => {
    const storage = new MemoryStorage();
    const started = startExperiment(freshSession(), "simulation");
    const updated = updateExperimentData(started, "simulation", serializeSimulationState(selectedState));
    expect(saveIndividualSession(storage, updated)).toBe(true);
    const restored = loadIndividualSession(storage).session;
    expect(parseSimulationState(restored.experiments.simulation.data)).toEqual(selectedState);
  });

  it("completes Simulation without automatically starting Replace the World", () => {
    const started = prepareExperienceStart(freshSession()).session;
    const completed = completeExperiment(started, "simulation", serializeSimulationState({ ...selectedState, stage: "completed" }));
    expect(completed.experiments.simulation.status).toBe("completed");
    expect(completed.experiments["replace-world"].status).toBe("not-started");
    expect(completed.currentExperiment).toBeNull();
    expect(getSessionProgress(completed)).toMatchObject({ completedCount: 1, totalExperiments: 7 });
    expect(getNextExperimentId("simulation")).toBe("replace-world");
  });
});
