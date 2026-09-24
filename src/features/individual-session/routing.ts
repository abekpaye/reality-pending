import { orderedExperiments } from "@/features/individual-session/registry";
import type { ExperimentId } from "@/types/experiments";

export function getExperimentPath(id: ExperimentId): `/experiment/${string}` {
  const experiment = orderedExperiments.find((item) => item.id === id);
  if (!experiment) throw new Error(`Unknown experiment id: ${id}`);
  return `/experiment/${experiment.slug}`;
}
