"use client";
import { motion,useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useExperimentSession } from "@/features/individual-session/provider";
import { experimentIds } from "@/features/individual-session/registry";
import { premiseLines,strategyCopy } from "./brain-vat.copy";
import { parseBrainVatState,serializeBrainVatState } from "./brain-vat.logic";
import { reasoningStrategies,type BrainVatResponseState } from "./brain-vat.types";
import styles from "./brain-vat-experience.module.css";

export function BrainVatExperience(){
 const reduceMotion=useReducedMotion(); const {ready,experiment,start,updateData,complete}=useExperimentSession("brain-vat");
 const state=parseBrainVatState(experiment?.data??null); const stage=experiment?.status==="completed"?"completed":state.stage;
 useEffect(()=>{if(ready&&experiment?.status==="not-started")start()},[experiment?.status,ready,start]);
 useEffect(()=>{if(ready)window.scrollTo({top:0,behavior:"auto"})},[ready,stage]);
 const save=(next:BrainVatResponseState)=>updateData(serializeBrainVatState(next));
 if(!ready||experiment===null)return <ApplicationShell mode="immersive" label="REALITY PENDING / 04"><main className={styles.loading}>Preparing the experiment.</main></ApplicationShell>;
 function advance(){if(state.premiseStep<2)save({...state,premiseStep:(state.premiseStep+1) as 1|2});else save({...state,stage:"response"})}
 function submit(){save({...state,stage:"reflection",submitted:true})}
 return <ApplicationShell mode="immersive" label="REALITY PENDING / 04 — BRAIN IN A VAT"><main className={styles.experience}>
  <header className={styles.header}><Link href="/" className={styles.link}>Exit</Link><ProgressIndicator current={4} total={experimentIds.length} currentComplete={stage==="completed"}/></header>
  {stage==="premise"&&<motion.section key={state.premiseStep} className={styles.premise} initial={reduceMotion?false:{opacity:0,y:14}} animate={{opacity:1,y:0}}>
   <p className={styles.eyebrow}>04 — BRAIN IN A VAT</p><p className={styles.step}>0{state.premiseStep+1}</p><h1>{premiseLines[state.premiseStep]}</h1>
   <button type="button" className={styles.advance} onClick={advance}>{state.premiseStep===2?"Sit with the question":"Continue"}<span aria-hidden="true">↓</span></button>
  </motion.section>}
  {stage==="response"&&<section className={styles.response}>
   <p className={styles.eyebrow}>CAN YOU TRUST YOUR EXPERIENCE?</p><h1>What evidence could prove that this is not your situation right now?</h1>
   <p className={styles.optional}>Write one to three sentences if useful. Your response is private, optional, and not evaluated.</p>
   <label htmlFor="vat-response">Your reflection <span>autosaved locally</span></label>
   <textarea id="vat-response" value={state.response} maxLength={3000} rows={6} placeholder="What would count as evidence from outside experience?" onChange={event=>save({...state,response:event.target.value})}/>
   <Button onClick={submit}>{state.response.trim()?"KEEP THIS RESPONSE":"CONTINUE WITHOUT WRITING"}</Button>
  </section>}
  {stage==="reflection"&&<section className={styles.reflection}>
   <p className={styles.eyebrow}>RADICAL SKEPTICISM</p><h1>The challenge is not that experience is usually false. It is that experience alone may be unable to certify its own source.</h1>
   {state.response.trim()&&<blockquote>{state.response}</blockquote>}
   <fieldset><legend>Which broad strategy comes closest to your response?</legend><div className={styles.strategies}>{reasoningStrategies.map(strategy=><button key={strategy} type="button" aria-pressed={state.strategy===strategy} onClick={()=>save({...state,strategy})}>{strategyCopy[strategy].title}</button>)}</div></fieldset>
   {state.strategy&&<motion.p className={styles.strategyReflection} initial={reduceMotion?false:{opacity:0}} animate={{opacity:1}}>{strategyCopy[state.strategy].reflection}</motion.p>}
   <div className={styles.actions}><Button variant="quiet" onClick={()=>save({...state,stage:"response",submitted:false})}>RETURN TO RESPONSE</Button><Button disabled={!state.strategy} onClick={()=>complete(serializeBrainVatState({...state,stage:"completed"}))}>COMPLETE EXPERIMENT</Button></div>
  </section>}
  {stage==="completed"&&<section className={styles.completed}><p className={styles.eyebrow}>04 / 07</p><h1>BRAIN IN A VAT COMPLETE</h1>{state.strategy&&<p>{strategyCopy[state.strategy].reflection}</p>}<Link className={styles.next} href="/experiment/ai-consciousness">Continue to 05 — AI Consciousness</Link></section>}
 </main></ApplicationShell>
}
