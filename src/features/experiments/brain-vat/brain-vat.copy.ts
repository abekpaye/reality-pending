import type { ReasoningStrategy } from "./brain-vat.types";
export const premiseLines = [
  "Imagine that every sensation you have is being produced artificially.",
  "Your body is elsewhere. Your world is an experience supplied to a brain.",
  "The experience is perfectly consistent. Nothing inside it reveals the deception.",
] as const;
export const strategyCopy: Record<ReasoningStrategy,{title:string;reflection:string}>={
  "sensory-trust":{title:"TRUST SENSORY EXPERIENCE",reflection:"You gave ordinary experience provisional authority, even without a guarantee from outside it."},
  "logical-consistency":{title:"LOOK FOR LOGICAL CONSISTENCY",reflection:"You placed weight on whether experience forms a coherent world, rather than on direct access to its source."},
  "external-verification":{title:"SEEK EXTERNAL VERIFICATION",reflection:"You looked for independent confirmation, while the scenario questions whether anything can count as genuinely external."},
  "practical-acceptance":{title:"ACCEPT WHAT WORKS IN PRACTICE",reflection:"You treated practical reliability as enough for living, even if absolute certainty remains unavailable."},
  "certainty-impossible":{title:"CERTAINTY MAY BE IMPOSSIBLE",reflection:"You accepted that the scenario may block conclusive proof without making everyday judgment impossible."},
};
