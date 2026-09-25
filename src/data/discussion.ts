import type{ExperimentId}from"@/types/experiments";
export interface DiscussionEntry{experimentId:ExperimentId;prompt:string;challenge:string;counterfactual:string}
export const discussions:DiscussionEntry[]=[
 {experimentId:"simulation",prompt:"What, if anything, is missing from a simulated world that contains genuine experience and consequence?",challenge:"Would your answer change if the simulation had no external observer?",counterfactual:"Suppose the physical world outside is less stable than the simulation."},
 {experimentId:"replace-world",prompt:"At what point, if any, did the world stop being real?",challenge:"Was your boundary about material, continuity, function, or familiarity?",counterfactual:"Reverse the process: begin simulated and replace each element with matter."},
 {experimentId:"evidence-chain",prompt:"When did belief become knowledge, and what changed at that moment?",challenge:"Could highly reliable evidence still support a false conclusion?",counterfactual:"Suppose the official institution has a documented reason to mislead you."},
 {experimentId:"brain-vat",prompt:"What could count as evidence from outside all possible experience?",challenge:"Does inability to prove the external world make ordinary knowledge impossible?",counterfactual:"Suppose the simulated world is more coherent than the external one."},
 {experimentId:"ai-consciousness",prompt:"Should behavioral evidence count differently for an AI than for another human?",challenge:"What evidence do you actually possess for human consciousness?",counterfactual:"The AI has a biological brain but communicates only through text."},
 {experimentId:"teleporter",prompt:"If the Mars person has all your memories, what would make that person not you?",challenge:"Can identity branch, or must identity always be one-to-one?",counterfactual:"The Earth original survives for only ten seconds after the copy wakes."},
 {experimentId:"replace-yourself",prompt:"Where, if anywhere, did identity cease to continue?",challenge:"Did you treat gradual change differently from instant replacement?",counterfactual:"All psychological traits return later, but in a completely new body."},
];
