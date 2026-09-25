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

function EventImage() { return <figure className={styles.eventImage} aria-label="A grainy image showing a metallic object above a university courtyard"><svg viewBox="0 0 720 360" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="campus-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#27333b"/><stop offset="1" stopColor="#526068"/></linearGradient><linearGradient id="courtyard-ground" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b3e3c"/><stop offset="1" stopColor="#1e2224"/></linearGradient><linearGradient id="metal-object" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stopColor="#d1d4d1"/><stop offset="0.42" stopColor="#858d90"/><stop offset="1" stopColor="#30383c"/></linearGradient></defs><rect width="720" height="360" fill="url(#campus-sky)"/><g className={styles.clouds}><path d="M20 82c70-30 126-23 174 0"/><path d="M485 59c72-19 137-12 204 17"/></g><g className={styles.campusRear}><path d="M0 155h205v93H0z"/><path d="M495 133h225v116H495z"/><path d="M58 111h91l33 44H24z"/><path d="M535 93h103l41 40H501z"/></g><g className={styles.campusWindows}><path d="M24 177h34v42H24zM78 177h34v42H78zM132 177h34v42h-34zM522 155h34v48h-34zM579 155h34v48h-34zM636 155h34v48h-34z"/></g><g className={styles.campusCenter}><path d="M207 142h286v106H207z"/><path d="M241 106h218l34 36H207z"/><path d="M314 157h72v91h-72z"/><path d="M229 165h48v55h-48zM423 165h48v55h-48z"/></g><path className={styles.courtyardGround} d="M0 248h720v112H0z" fill="url(#courtyard-ground)"/><g className={styles.paving}><path d="M0 301h720M98 248L48 360M225 248l-9 112M495 248l14 112M621 248l62 112"/></g><g className={styles.campusTrees}><path d="M42 205v58M680 198v66"/><circle cx="42" cy="190" r="30"/><circle cx="680" cy="181" r="35"/></g><g className={styles.distantPeople}><path d="M154 273v30m-10 23 10-23 11 23m-20-38 9 9 10-9"/><circle cx="154" cy="265" r="7"/><path d="M554 282v26m-9 20 9-20 9 20m-17-34 8 8 9-8"/><circle cx="554" cy="275" r="6"/><path d="M597 269v24m-8 19 8-19 8 19"/><circle cx="597" cy="262" r="6"/></g><g className={styles.flyingObject} transform="translate(285 69) rotate(-7)"><ellipse cx="72" cy="31" rx="78" ry="26" fill="url(#metal-object)"/><path d="M16 32c35 16 84 20 116 2"/><ellipse cx="75" cy="23" rx="35" ry="11"/><path d="M35 48c22 8 52 10 75 1"/></g></svg><div className={styles.imageGrain} aria-hidden="true" /><div className={styles.focusMark} aria-hidden="true" /><figcaption>UNVERIFIED IMAGE / 08:42</figcaption></figure>; }
function ConfidenceTimeline({ history, current, expanded = false }: { history: typeof initialEvidenceChainState.history; current: number; expanded?: boolean }) {
  const points = history.length ? history : [{ after: "initial-claim" as const, value: current }];
  return <figure className={styles.timeline} data-expanded={expanded}><figcaption>CONFIDENCE TRAJECTORY</figcaption><div className={styles.chart}>{points.map((point, index) => <div key={point.after} className={styles.point} style={{ left: `${points.length === 1 ? 0 : index / (points.length - 1) * 100}%`, bottom: `${point.value}%` }}><span>{point.value}</span></div>)}</div></figure>;
}
