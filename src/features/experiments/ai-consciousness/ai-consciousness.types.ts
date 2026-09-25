export const aiEvidenceIds=["verbal-report","human-behavior","long-memory","pain-reports","self-reflection","brain-like-mechanism","consistent-behavior"] as const;
export type AiEvidenceId=(typeof aiEvidenceIds)[number];
export type EvidenceLimit="nothing"|"unsure"|null;
export type EvidenceStandard="same-as-humans"|"higher-than-humans"|"different-kind"|"uncertain";
export type AiConsciousnessStage="encounter"|"evidence"|"standard"|"reflection"|"completed";
export interface AiConsciousnessResponseState{version:1;stage:AiConsciousnessStage;encounterStep:0|1;selectedEvidence:AiEvidenceId[];limit:EvidenceLimit;standard:EvidenceStandard|null}
