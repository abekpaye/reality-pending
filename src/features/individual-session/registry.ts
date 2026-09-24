import { experimentRegistry } from "@/data/experiments";
import type { ExperimentId, ExperimentMetadata } from "@/types/experiments";

export const orderedExperiments = [...experimentRegistry].sort((left, right) => left.order - right.order);
export const experimentIds = orderedExperiments.map((experiment) => experiment.id);

const experimentIdSet = new Set<ExperimentId>(experimentIds);

export function isExperimentId(value: unknown): value is ExperimentId {
  return typeof value === "string" && experimentIdSet.has(value as ExperimentId);
}

export function getExperimentIndex(id: ExperimentId): number {
  return experimentIds.indexOf(id);
}

export function getPreviousExperimentId(id: ExperimentId): ExperimentId | null {
  const index = getExperimentIndex(id);
  return index > 0 ? experimentIds[index - 1] : null;
}

export function getNextExperimentId(id: ExperimentId): ExperimentId | null {
  const index = getExperimentIndex(id);
  return index >= 0 && index < experimentIds.length - 1 ? experimentIds[index + 1] : null;
}

export function getNextAvailableExperimentId(
  id: ExperimentId,
  registry: readonly ExperimentMetadata[] = orderedExperiments,
): ExperimentId | null {
  const ordered = [...registry].sort((left, right) => left.order - right.order);
  const currentIndex = ordered.findIndex((experiment) => experiment.id === id);
  if (currentIndex < 0) return null;
  return ordered.slice(currentIndex + 1).find((experiment) => experiment.availability === "available")?.id ?? null;
}
