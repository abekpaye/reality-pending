import type { ClassResponse } from "./types";
import type { ExperimentId } from "@/types/experiments";
import type { JsonValue } from "@/features/individual-session/types";
export interface AggregateDatum {
  label: string;
  value: number;
}
export interface ClassAggregate {
  kind:
    | "positions"
    | "thresholds"
    | "trajectory"
    | "strategies"
    | "evidence"
    | "branches"
    | "identity-thresholds";
  total: number;
  data: AggregateDatum[];
  series?: number[];
}
const count = (labels: string[]): AggregateDatum[] =>
  Object.entries(
    labels.reduce<Record<string, number>>(
      (acc, label) => ({ ...acc, [label]: (acc[label] ?? 0) + 1 }),
      {},
    ),
  ).map(([label, value]) => ({ label, value }));
export function aggregateResponses(
  id: ExperimentId,
  responses: ClassResponse[],
): ClassAggregate {
  const items = responses.filter((r) => r.experimentId === id),
    objects = items
      .map((r) => r.payload)
      .filter(
        (p): p is Record<string, JsonValue> =>
          p !== null && typeof p === "object" && !Array.isArray(p),
      );
  switch (id) {
    case "simulation":
      return {
        kind: "positions",
        total: items.length,
        data: count(
          objects.map((p) => String(p.committedPosition ?? "unanswered")),
        ),
      };
    case "replace-world":
      return {
        kind: "thresholds",
        total: items.length,
        data: count(
          objects.map((p) =>
            p.criterion === "threshold"
              ? String(p.thresholdAfter ?? "threshold")
              : String(p.criterion ?? "unanswered"),
          ),
        ),
      };
    case "evidence-chain": {
      const histories = objects.map((p) =>
        Array.isArray(p.history)
          ? p.history
          : typeof p.confidence === "number"
            ? [{ value: p.confidence }]
            : [],
      );
      const max = Math.max(0, ...histories.map((h) => h.length));
      const series = Array.from({ length: max }, (_, i) => {
        const values = histories
          .map((h) =>
            Number((h[i] as Record<string, JsonValue> | undefined)?.value),
          )
          .filter(Number.isFinite);
        return values.length
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 0;
      });
      return { kind: "trajectory", total: items.length, data: [], series };
    }
    case "brain-vat":
      return {
        kind: "strategies",
        total: items.length,
        data: count(objects.map((p) => String(p.strategy ?? "unanswered"))),
      };
    case "ai-consciousness":
      return {
        kind: "evidence",
        total: items.length,
        data: count(
          objects.flatMap((p) =>
            Array.isArray(p.selectedEvidence)
              ? p.selectedEvidence.map(String)
              : [String(p.limit ?? "unanswered")],
          ),
        ),
      };
    case "teleporter":
      return {
        kind: "branches",
        total: items.length,
        data: count(
          objects.map(
            (p) =>
              `${String(p.survival ?? "?")} / ${String(p.original ?? "?")}`,
          ),
        ),
      };
    case "replace-yourself":
      return {
        kind: "identity-thresholds",
        total: items.length,
        data: count(
          objects.map((p) => {
            if (typeof p.classPattern === "string") return p.classPattern;
            const cps = Array.isArray(p.checkpoints) ? p.checkpoints : [];
            const changed = cps.find(
              (cp) =>
                cp !== null &&
                typeof cp === "object" &&
                !Array.isArray(cp) &&
                cp.judgment === "not-same",
            );
            return changed &&
              typeof changed === "object" &&
              !Array.isArray(changed)
              ? `after ${String(changed.after)}`
              : "no boundary";
          }),
        ),
      };
  }
}
