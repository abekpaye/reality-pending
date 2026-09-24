import { describe, expect, it } from "vitest";
import { prepareExperienceStart } from "@/features/entry/experience-start";
import { createFreshIndividualSession } from "@/features/individual-session/model";
import { getExperimentPath } from "@/features/individual-session/routing";

describe("Individual experience routing boundaries", () => {
  it("derives future experiment paths from registry slugs", () => {
    expect(getExperimentPath("simulation")).toBe("/experiment/simulation");
    expect(getExperimentPath("replace-yourself")).toBe("/experiment/replace-yourself");
  });

  it("prepares BEGIN to start Simulation without starting the next experiment", () => {
    const session = createFreshIndividualSession({
      now: () => "2026-01-01T00:00:00.000Z",
      createId: () => "not-started",
    });
    const prepared = prepareExperienceStart(session);
    expect(prepared.destination).toBe("/experiment/simulation");
    expect(prepared.session.currentExperiment).toBe("simulation");
    expect(prepared.session.experiments.simulation.status).toBe("in-progress");
    expect(prepared.session.experiments["replace-world"].status).toBe("not-started");
    expect(prepared.session.status).toBe("in-progress");
  });
});
