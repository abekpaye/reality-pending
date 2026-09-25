import type { IndividualSession } from "@/features/individual-session/types";
import { parseSimulationState } from "@/features/experiments/simulation/simulation.logic";
import { parseReplaceWorldState } from "@/features/experiments/replace-world/replace-world.logic";
import { parseEvidenceChainState } from "@/features/experiments/evidence-chain/evidence-chain.logic";
import { parseBrainVatState } from "@/features/experiments/brain-vat/brain-vat.logic";
import { parseAiConsciousnessState } from "@/features/experiments/ai-consciousness/ai-consciousness.logic";
import { parseTeleporterState } from "@/features/experiments/teleporter/teleporter.logic";
import {
  parseReplaceYourselfState,
  physicalPsychologicalPattern,
} from "@/features/experiments/replace-yourself/replace-yourself.logic";
import type {
  BroadPosition,
  DimensionDefinition,
  DimensionResult,
  MapDimensionId,
  PhilosophicalMapResult,
} from "./types";
export const dimensionDefinitions: DimensionDefinition[] = [
  {
    id: "reality",
    title: "REALITY",
    left: "MATERIAL BASIS",
    right: "EXPERIENTIAL CONTINUITY",
    description:
      "Whether reality depends more on physical origin or on stable experience and consequence.",
  },
  {
    id: "knowledge",
    title: "KNOWLEDGE",
    left: "CERTAINTY",
    right: "SKEPTICISM",
    description:
      "How strongly belief requires certainty and how far doubt remains open.",
  },
  {
    id: "mind",
    title: "MIND",
    left: "BIOLOGICAL REQUIREMENT",
    right: "FUNCTIONAL POSSIBILITY",
    description:
      "Whether mindedness depends on biology or may be supported by other functioning systems.",
  },
  {
    id: "identity",
    title: "IDENTITY",
    left: "BODILY CONTINUITY",
    right: "PSYCHOLOGICAL CONTINUITY",
    description:
      "Whether persistence of body or of memory and psychology carries more weight.",
  },
  {
    id: "technology",
    title: "TECHNOLOGY",
    left: "HUMAN-EXCLUSIVE",
    right: "OPEN TO MACHINE CONSCIOUSNESS",
    description:
      "How open the evidential standard is to consciousness in artificial systems.",
  },
];
type Contributions = Record<MapDimensionId, number[]>;
const empty = (): Contributions => ({
  reality: [],
  knowledge: [],
  mind: [],
  identity: [],
  technology: [],
});
const add = (c: Contributions, id: MapDimensionId, value: number) =>
  c[id].push(value);
export function broadPosition(value: number): BroadPosition {
  return value <= -1.25
    ? "strong-left"
    : value < -0.35
      ? "left"
      : value <= 0.35
        ? "balanced"
        : value < 1.25
          ? "right"
          : "strong-right";
}
export function buildPhilosophicalMap(
  session: IndividualSession,
): PhilosophicalMapResult {
  const c = empty(),
    observations: string[] = [];
  if (session.experiments.simulation.status === "completed") {
    const s = parseSimulationState(session.experiments.simulation.data);
    if (s.committedPosition === "physical-reality") add(c, "reality", -2);
    if (s.committedPosition === "experiential-reality") add(c, "reality", 2);
    if (s.committedPosition === "uncertain") {
      add(c, "reality", 0);
      add(c, "knowledge", 2);
    }
  }
  if (session.experiments["replace-world"].status === "completed") {
    const s = parseReplaceWorldState(session.experiments["replace-world"].data);
    add(
      c,
      "reality",
      s.criterion === "threshold"
        ? -1
        : s.criterion === "never-stopped"
          ? 1
          : 2,
    );
    if (s.criterion === "threshold" && s.thresholdAfter)
      observations.push(
        `You located a boundary of reality during material replacement, after ${s.thresholdAfter.replace("-", " ")}.`,
      );
    else
      observations.push(
        "You did not treat progressive material replacement as a simple boundary of reality.",
      );
  }
  if (session.experiments["evidence-chain"].status === "completed") {
    const s = parseEvidenceChainState(
      session.experiments["evidence-chain"].data,
    );
    add(
      c,
      "knowledge",
      s.knowledgeAt === "never" || s.knowledgeAt === "uncertain"
        ? 2
        : s.knowledgeAt === "initial-claim"
          ? -2
          : s.knowledgeAt === "official-confirmation"
            ? -1
            : 0,
    );
    if (s.mostImportant)
      observations.push(
        `In the evidence chain, ${s.mostImportant.replaceAll("-", " ")} carried the most weight for you.`,
      );
  }
  if (session.experiments["brain-vat"].status === "completed") {
    const s = parseBrainVatState(session.experiments["brain-vat"].data);
    add(
      c,
      "knowledge",
      s.strategy === "certainty-impossible"
        ? 2
        : s.strategy === "sensory-trust"
          ? -1
          : s.strategy === "practical-acceptance"
            ? 1
            : 0,
    );
  }
  if (session.experiments["ai-consciousness"].status === "completed") {
    const s = parseAiConsciousnessState(
      session.experiments["ai-consciousness"].data,
    );
    if (s.limit === "nothing") {
      add(c, "mind", -2);
      add(c, "technology", -2);
    } else if (s.limit === "unsure") {
      add(c, "mind", 0);
      add(c, "technology", 0);
    } else {
      const functional = s.selectedEvidence.some(
        (id) => id !== "brain-like-mechanism",
      );
      add(c, "mind", functional ? 1 : -1);
      add(c, "technology", s.selectedEvidence.length >= 4 ? 2 : 1);
    }
    add(
      c,
      "technology",
      s.standard === "same-as-humans"
        ? 1
        : s.standard === "higher-than-humans"
          ? -1
          : 0,
    );
    observations.push(
      s.limit === "nothing"
        ? "You did not regard available evidence as sufficient to establish machine consciousness."
        : `You treated ${s.selectedEvidence.length} kinds of evidence as relevant to possible machine consciousness.`,
    );
  }
  if (session.experiments.teleporter.status === "completed") {
    const s = parseTeleporterState(session.experiments.teleporter.data);
    add(c, "identity", s.survival === "yes" ? 1 : s.survival === "no" ? -1 : 0);
    add(c, "mind", s.survival === "yes" ? 1 : s.survival === "no" ? -1 : 0);
    const top = s.ranking[0];
    add(
      c,
      "identity",
      top === "body"
        ? -2
        : top === "memory" || top === "consciousness"
          ? 2
          : top === "continuity"
            ? 1
            : 0,
    );
    observations.push(
      `In the teleporter case, you ranked ${top.replace("-", " ")} as the strongest condition of identity.`,
    );
  }
  if (session.experiments["replace-yourself"].status === "completed") {
    const s = parseReplaceYourselfState(
        session.experiments["replace-yourself"].data,
      ),
      p = physicalPsychologicalPattern(s);
    add(
      c,
      "identity",
      !p.physicalNotSame && p.psychologicalNotSame
        ? 2
        : p.physicalNotSame
          ? -1
          : 0,
    );
    if (!p.physicalNotSame && p.psychologicalNotSame)
      observations.push(
        "Your identity judgments were more resistant to physical replacement than to psychological change.",
      );
    else
      observations.push(
        "Your identity judgments did not reduce neatly to a physical-versus-psychological divide.",
      );
  }
  const dimensions: DimensionResult[] = dimensionDefinitions.map((def) => {
    const values = c[def.id],
      value = values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;
    return {
      ...def,
      value,
      contributors: values.length,
      position: broadPosition(value),
    };
  });
  return {
    dimensions,
    observations: observations.slice(0, 5),
    completeExperiments: session.completedExperimentIds.length,
  };
}
