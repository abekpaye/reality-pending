import type { RealityCriterion, ReplacementElement } from "./replace-world.types";

export const replacementCopy: Record<ReplacementElement, { label: string; line: string }> = {
  sky: { label: "THE SKY", line: "The sky is replaced by a perfect simulation." },
  wall: { label: "THE WALL", line: "The wall now has no physical surface." },
  window: { label: "THE WINDOW", line: "The view remains, generated rather than reflected." },
  plant: { label: "THE PLANT", line: "The plant grows according to a model." },
  desk: { label: "THE DESK", line: "The desk still supports everything placed upon it." },
  object: { label: "THE OBJECT", line: "The object keeps its history, but not its matter." },
  person: { label: "THE PERSON", line: "The person remembers you, responds, and insists nothing has changed." },
};

export const criterionReflection: Record<RealityCriterion, { title: string; body: string }> = {
  threshold: {
    title: "For you, reality crossed a boundary.",
    body: "Your response treated continuity as limited: enough replacement eventually changed what the scene was, even while its appearance and effects remained.",
  },
  "never-stopped": {
    title: "For you, the scene remained real.",
    body: "Your response placed more weight on continuity of experience and consequence than on the material origin of each element.",
  },
  "origin-not-criterion": {
    title: "You rejected the premise of the threshold.",
    body: "Your response questioned whether physical origin is the relevant measure of reality at all, rather than deciding how much replacement is too much.",
  },
};
