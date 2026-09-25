import{describe,expect,it}from"vitest";import{initialBrainVatState,isReasoningStrategy,parseBrainVatState,serializeBrainVatState}from"./brain-vat.logic";
describe("Brain in a Vat domain",()=>{
 it("accepts the five self-selected reasoning strategies",()=>{expect(isReasoningStrategy("sensory-trust")).toBe(true);expect(isReasoningStrategy("certainty-impossible")).toBe(true);expect(isReasoningStrategy("skeptic")).toBe(false)});
 it("round-trips private open response and strategy",()=>{const state={...initialBrainVatState,stage:"reflection" as const,premiseStep:2 as const,response:"Consistency would not prove an external source.",submitted:true,strategy:"logical-consistency" as const};expect(parseBrainVatState(serializeBrainVatState(state))).toEqual(state)});
 it("rejects oversized or malformed persisted writing",()=>{expect(parseBrainVatState({version:1,stage:"response",premiseStep:2,response:"x".repeat(3001),submitted:false,strategy:null})).toEqual(initialBrainVatState)});
});
