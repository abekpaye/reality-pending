import type { ExperimentId } from "@/types/experiments";
import { startExperiment } from "@/features/individual-session/actions";
import type { IndividualSession } from "@/features/individual-session/types";
import { getExperimentPath } from "@/features/individual-session/routing";

export interface ExperienceStartBoundary {
  firstExperiment: ExperimentId;
  enabled: boolean;
  destination: string | null;
}

export const experienceStartBoundary: ExperienceStartBoundary = {
  firstExperiment: "simulation",
  enabled: true,
  destination: getExperimentPath("simulation"),
};

export interface PreparedExperienceStart {
  session: IndividualSession;
  destination: string | null;
}

export function prepareExperienceStart(session: IndividualSession): PreparedExperienceStart {
  if (!experienceStartBoundary.enabled || experienceStartBoundary.destination === null) {
    return { session, destination: null };
  }

  return {
    session: startExperiment(session, experienceStartBoundary.firstExperiment),
    destination: experienceStartBoundary.destination,
  };
}
