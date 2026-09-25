import { describe, expect, it } from "vitest";
import { completeExperiment, startExperiment } from "@/features/individual-session/actions";
import { createFreshIndividualSession } from "@/features/individual-session/model";
import { decideReality, initialReplaceWorldState, parseReplaceWorldState, serializeReplaceWorldState } from "./replace-world.logic";

describe("Replace the World domain", () => {
  it("records the exact replacement after which a threshold was marked", () => {
    const decided = decideReality({ ...initialReplaceWorldState, replacedCount: 4 }, "threshold");
    expect(decided.thresholdAfter).toBe("plant");
    expect(parseReplaceWorldState(serializeReplaceWorldState(decided))).toEqual(decided);
  });

  it("keeps non-threshold criteria distinct", () => {
    expect(decideReality({ ...initialReplaceWorldState, replacedCount: 7 }, "never-stopped").thresholdAfter).toBeNull();
    expect(decideReality({ ...initialReplaceWorldState, replacedCount: 2 }, "origin-not-criterion").criterion).toBe("origin-not-criterion");
  });

  it("completes only Replace the World", () => {
    const fresh = createFreshIndividualSession({ createId: () => "replace-world-test" });
    const started = startExperiment(fresh, "replace-world");
    const response = decideReality({ ...initialReplaceWorldState, replacedCount: 3 }, "threshold");
    const completed = completeExperiment(started, "replace-world", serializeReplaceWorldState({ ...response, stage: "completed" }));
    expect(completed.experiments["replace-world"].status).toBe("completed");
    expect(completed.experiments["evidence-chain"].status).toBe("not-started");
  });

  it("recovers from structurally invalid feature data", () => {
    expect(parseReplaceWorldState({ version: 1, stage: "reflection", replacedCount: 99, criterion: "threshold", thresholdAfter: "sky" })).toEqual(initialReplaceWorldState);
  });
});
