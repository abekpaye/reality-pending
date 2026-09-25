"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useExperimentSession } from "@/features/individual-session/provider";
import { experimentIds } from "@/features/individual-session/registry";
import { evidenceCopy, knowledgeLabels } from "./evidence-chain.copy";
import { initialEvidenceChainState, parseEvidenceChainState, recordConfidence, serializeEvidenceChainState } from "./evidence-chain.logic";
import { evidenceIds, type KnowledgePoint } from "./evidence-chain.types";
import styles from "./evidence-chain-experience.module.css";

export function EvidenceChainExperience() {
  const reduceMotion = useReducedMotion();
  const { ready, experiment, start, updateData, complete } = useExperimentSession("evidence-chain");
  const state = parseEvidenceChainState(experiment?.data ?? null);
  const stage = experiment?.status === "completed" ? "completed" : state.stage;
  useEffect(() => { if (ready && experiment?.status === "not-started") start(); }, [experiment?.status, ready, start]);
  useEffect(() => { if (ready) window.scrollTo({ top: 0, behavior: "auto" }); }, [ready, stage]);
  const save = (next: typeof state) => updateData(serializeEvidenceChainState(next));

  if (!ready || experiment === null) return <ApplicationShell mode="immersive" label="REALITY PENDING / 03"><main className={styles.loading}>Preparing the experiment.</main></ApplicationShell>;

  const activeEvidence = state.revealedCount > 0 ? evidenceIds[state.revealedCount - 1] : null;
  const nextEvidence = state.revealedCount < evidenceIds.length ? evidenceIds[state.revealedCount] : null;
  function assess() {
    if (state.knowledgeAt === null || state.mostImportant === null) return;
    save({ ...state, stage: "reflection" });
  }

  return (
    <ApplicationShell mode="immersive" label="REALITY PENDING / 03 — EVIDENCE CHAIN">
      <main className={styles.experience}>
        <header className={styles.header}><Link href="/" className={styles.quietLink}>Exit</Link><ProgressIndicator current={3} total={experimentIds.length} currentComplete={stage === "completed"} /></header>
        {stage === "updating" && (
          <section className={styles.updating}>
            <div className={styles.argument}>
              <p className={styles.eyebrow}>03 — EVIDENCE CHAIN</p>
              <h1>HOW DO YOU KNOW?</h1>
              <p className={styles.claim}>A silent metallic object appeared above the university courtyard this morning.</p>
              <EventImage />
              {activeEvidence ? (
                <motion.div key={activeEvidence} className={styles.evidence} initial={reduceMotion ? false : { opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}>
                  <span>{evidenceCopy[activeEvidence].source}</span><p>{evidenceCopy[activeEvidence].statement}</p>
                </motion.div>
              ) : <p className={styles.prompt}>You have only this image and claim. How confident are you that the event occurred?</p>}
            </div>
            <div className={styles.beliefPanel}>
              <label htmlFor="confidence">CONFIDENCE THAT THE EVENT OCCURRED</label>
              <output htmlFor="confidence">{state.confidence}<span>%</span></output>
              <input id="confidence" type="range" min="0" max="100" value={state.confidence} onChange={(event) => save({ ...state, confidence: Number(event.target.value) })} />
              <div className={styles.scale}><span>DOUBT</span><span>CERTAINTY</span></div>
              <ConfidenceTimeline history={state.history} current={state.confidence} />
              <Button onClick={() => save(recordConfidence(state))}>{nextEvidence ? "RECORD AND REVEAL EVIDENCE" : "RECORD FINAL CONFIDENCE"}</Button>
            </div>
          </section>
        )}
        {stage === "assessment" && (
          <section className={styles.assessment}>
            <p className={styles.eyebrow}>YOUR BELIEF MOVED</p><h1>WHEN, IF EVER, DID BELIEF BECOME KNOWLEDGE?</h1>
            <ConfidenceTimeline history={state.history} current={state.confidence} expanded />
            <fieldset><legend>Choose the closest point.</legend><div className={styles.pointGrid}>{(["initial-claim", ...evidenceIds, "never", "uncertain"] as KnowledgePoint[]).map(point => <button key={point} type="button" aria-pressed={state.knowledgeAt === point} onClick={() => save({ ...state, knowledgeAt: point })}>{knowledgeLabels[point]}</button>)}</div></fieldset>
            <fieldset><legend>Which evidence mattered most?</legend><div className={styles.pointGrid}>{evidenceIds.map(id => <button key={id} type="button" aria-pressed={state.mostImportant === id} onClick={() => save({ ...state, mostImportant: id })}>{evidenceCopy[id].source}</button>)}</div></fieldset>
            <Button disabled={state.knowledgeAt === null || state.mostImportant === null} onClick={assess}>REFLECT ON THE CHAIN</Button>
          </section>
        )}
        {stage === "reflection" && state.knowledgeAt && state.mostImportant && (
          <section className={styles.reflection}>
            <p className={styles.eyebrow}>PAUSE AND REFLECT</p><h1>Your confidence changed as the grounds for belief changed.</h1>
            <p>You placed the most weight on <strong>{evidenceCopy[state.mostImportant].source.toLowerCase()}</strong>. You located knowledge at: <strong>{knowledgeLabels[state.knowledgeAt].toLowerCase()}</strong>.</p>
            <div className={styles.context}><span>EPISTEMOLOGY</span><p>Evidence can strengthen justification without creating a universal numerical boundary between belief and knowledge. Your trajectory records what moved you; it does not prove when certainty became knowledge.</p></div>
            <div className={styles.actions}><Button variant="quiet" onClick={() => save({ ...state, stage: "assessment" })}>RECONSIDER</Button><Button onClick={() => complete(serializeEvidenceChainState({ ...state, stage: "completed" }))}>COMPLETE EXPERIMENT</Button></div>
          </section>
        )}
        {stage === "completed" && (
          <section className={styles.completed}><p className={styles.eyebrow}>03 / 07</p><h1>EVIDENCE CHAIN COMPLETE</h1><ConfidenceTimeline history={state.history} current={state.confidence} expanded /><Link href="/experiment/brain-vat" className={styles.nextLink}>Continue to 04 — Brain in a Vat</Link></section>
        )}
      </main>
    </ApplicationShell>
  );
}

function EventImage() { return <figure className={styles.eventImage} aria-label="A grainy image showing a metallic oval above a university courtyard"><div className={styles.building} /><div className={styles.oval} /><figcaption>UNVERIFIED IMAGE / 08:42</figcaption></figure>; }
function ConfidenceTimeline({ history, current, expanded = false }: { history: typeof initialEvidenceChainState.history; current: number; expanded?: boolean }) {
  const points = history.length ? history : [{ after: "initial-claim" as const, value: current }];
  return <figure className={styles.timeline} data-expanded={expanded}><figcaption>CONFIDENCE TRAJECTORY</figcaption><div className={styles.chart}>{points.map((point, index) => <div key={point.after} className={styles.point} style={{ left: `${points.length === 1 ? 0 : index / (points.length - 1) * 100}%`, bottom: `${point.value}%` }}><span>{point.value}</span></div>)}</div></figure>;
}
