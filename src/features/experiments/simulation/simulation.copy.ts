import type { SimulationPosition } from "./simulation.types";

export const narrativeMoments = [
  ["Scientists have proven something impossible."],
  ["Our universe is a simulation."],
  ["Your memories remain.", "The people you love remain.", "Everything you have experienced still feels exactly the same."],
] as const;

export const positionCopy: Record<SimulationPosition, { title: string; support: string; reflection: readonly [string, string] }> = {
  "physical-reality": {
    title: "REALITY REQUIRES A PHYSICAL WORLD",
    support: "If the world is simulated, something fundamental about its reality has changed.",
    reflection: [
      "Your response placed weight on the world behind experience.",
      "You treated physical origin as an important part of what makes something real.",
    ],
  },
  "experiential-reality": {
    title: "EXPERIENCE CAN STILL BE REAL",
    support: "A simulated world may still contain genuine experiences, relationships and consequences.",
    reflection: [
      "Your response placed weight on lived experience.",
      "The substrate changed, but experience and consequence still mattered.",
    ],
  },
  uncertain: {
    title: "WE CANNOT KNOW WITH CERTAINTY",
    support: "If we cannot access anything outside the simulation, certainty may be impossible.",
    reflection: [
      "Your response resisted certainty.",
      "Without access to anything outside the simulation, you questioned whether the distinction can be settled.",
    ],
  },
};

export const contextItems = [
  { term: "ONTOLOGY", question: "What kinds of things are real?" },
  { term: "METAPHYSICS", question: "What is the underlying nature of reality?" },
  { term: "SKEPTICISM", question: "What can we know with certainty?" },
] as const;
