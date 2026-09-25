import { describe, expect, it } from "vitest";
import { aggregateResponses } from "./aggregation";
import type { ClassResponse } from "./types";
describe("Class response aggregation", () => {
  it("counts Simulation positions", () => {
    const responses: ClassResponse[] = [
      {
        experimentId: "simulation",
        payload: { committedPosition: "uncertain" },
      },
      {
        experimentId: "simulation",
        payload: { committedPosition: "uncertain" },
      },
      {
        experimentId: "simulation",
        payload: { committedPosition: "physical-reality" },
      },
    ];
    expect(aggregateResponses("simulation", responses).data).toEqual(
      expect.arrayContaining([
        { label: "uncertain", value: 2 },
        { label: "physical-reality", value: 1 },
      ]),
    );
  });
  it("averages Evidence Chain trajectories", () => {
    const responses: ClassResponse[] = [
      {
        experimentId: "evidence-chain",
        payload: { history: [{ value: 20 }, { value: 80 }] },
      },
      {
        experimentId: "evidence-chain",
        payload: { history: [{ value: 40 }, { value: 60 }] },
      },
    ];
    expect(aggregateResponses("evidence-chain", responses).series).toEqual([
      30, 70,
    ]);
  });
  it("accepts the compact class confidence response", () => {
    const responses: ClassResponse[] = [
      { experimentId: "evidence-chain", payload: { confidence: 64 } },
      { experimentId: "evidence-chain", payload: { confidence: 86 } },
    ];
    expect(aggregateResponses("evidence-chain", responses).series).toEqual([
      75,
    ]);
  });
  it("aggregates Brain in a Vat strategies without raw writing", () => {
    const responses: ClassResponse[] = [
      {
        experimentId: "brain-vat",
        payload: {
          strategy: "practical-acceptance",
          response: "private words",
        },
      },
    ];
    const aggregate = aggregateResponses("brain-vat", responses);
    expect(aggregate.data).toEqual([
      { label: "practical-acceptance", value: 1 },
    ]);
    expect(JSON.stringify(aggregate)).not.toContain("private words");
  });
  it("finds identity thresholds", () => {
    const responses: ClassResponse[] = [
      {
        experimentId: "replace-yourself",
        payload: {
          checkpoints: [
            { after: 2, judgment: "same" },
            { after: 8, judgment: "not-same" },
          ],
        },
      },
    ];
    expect(aggregateResponses("replace-yourself", responses).data).toEqual([
      { label: "after 8", value: 1 },
    ]);
  });
});
