"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useExperimentSession } from "@/features/individual-session/provider";
import { experimentIds } from "@/features/individual-session/registry";
import { motionDurations, motionEase } from "@/lib/motion";
import { criterionReflection, replacementCopy } from "./replace-world.copy";
import { decideReality, parseReplaceWorldState, serializeReplaceWorldState } from "./replace-world.logic";
import { replacementElements, type RealityCriterion } from "./replace-world.types";
import styles from "./replace-world-experience.module.css";

export function ReplaceWorldExperience() {
  const reduceMotion = useReducedMotion();
  const { ready, experiment, start, updateData, complete } = useExperimentSession("replace-world");
  const state = parseReplaceWorldState(experiment?.data ?? null);
  const stage = experiment?.status === "completed" ? "completed" : state.stage;

  useEffect(() => {
    if (ready && experiment?.status === "not-started") start();
  }, [experiment?.status, ready, start]);

  useEffect(() => {
    if (ready) window.scrollTo({ top: 0, behavior: "auto" });
  }, [ready, stage]);

  function replaceNext() {
    if (state.replacedCount >= replacementElements.length) return;
    updateData(serializeReplaceWorldState({ ...state, replacedCount: state.replacedCount + 1 }));
  }

  function decide(criterion: RealityCriterion) {
    updateData(serializeReplaceWorldState(decideReality(state, criterion)));
  }

  function reconsider() {
    updateData(serializeReplaceWorldState({ ...state, stage: "transforming", criterion: null, thresholdAfter: null }));
  }

  function finish() {
    complete(serializeReplaceWorldState({ ...state, stage: "completed" }));
  }

  if (!ready || experiment === null) {
    return <ApplicationShell mode="immersive" label="REALITY PENDING / 02"><main className={styles.loading}>Preparing the experiment.</main></ApplicationShell>;
  }

  const currentElement = state.replacedCount < replacementElements.length ? replacementElements[state.replacedCount] : null;
  const lastElement = state.replacedCount > 0 ? replacementElements[state.replacedCount - 1] : null;

  return (
    <ApplicationShell mode="immersive" label="REALITY PENDING / 02 — REPLACE THE WORLD">
      <main className={styles.experience}>
        <header className={styles.header}>
          <Link href="/" className={styles.quietLink}>Exit</Link>
          <ProgressIndicator current={2} total={experimentIds.length} currentComplete={stage === "completed"} />
        </header>

        {stage === "transforming" && (
          <motion.section className={styles.transforming} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>02 — REPLACE THE WORLD</p>
              <h1>WHEN DOES REALITY STOP BEING REAL?</h1>
              <p className={styles.lead}>{lastElement ? replacementCopy[lastElement].line : "This room is physical. Replace it, one part at a time, without changing how it appears or behaves."}</p>
              <div className={styles.counter} aria-label={`${state.replacedCount} of ${replacementElements.length} elements simulated`}>
                <span>{String(state.replacedCount).padStart(2, "0")}</span><span>/</span><span>{String(replacementElements.length).padStart(2, "0")}</span>
                <span>SIMULATED</span>
              </div>
            </div>

            <WorldScene replacedCount={state.replacedCount} reduceMotion={Boolean(reduceMotion)} />

            <div className={styles.controls}>
              {currentElement ? (
                <Button onClick={replaceNext}>REPLACE {replacementCopy[currentElement].label}</Button>
              ) : (
                <p className={styles.allReplaced}>Every visible element has been replaced. The scene still behaves exactly as before.</p>
              )}
              <div className={styles.decisions}>
                <button type="button" onClick={() => decide("threshold")} disabled={state.replacedCount === 0}>REALITY CHANGED HERE</button>
                <button type="button" onClick={() => decide("never-stopped")}>IT NEVER STOPPED BEING REAL</button>
                <button type="button" onClick={() => decide("origin-not-criterion")}>ORIGIN IS NOT THE RIGHT CRITERION</button>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "reflection" && state.criterion !== null && (
          <motion.section className={styles.reflection} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : motionDurations.scene, ease: motionEase }}>
            <p className={styles.eyebrow}>PAUSE AND REFLECT</p>
            <h1>{criterionReflection[state.criterion].title}</h1>
            <p className={styles.reflectionBody}>{criterionReflection[state.criterion].body}</p>
            {state.criterion === "threshold" && state.thresholdAfter && (
              <p className={styles.thresholdStatement}>Your boundary appeared after replacing <strong>{replacementCopy[state.thresholdAfter].label.toLowerCase()}</strong>, with {state.replacedCount} of {replacementElements.length} elements simulated.</p>
            )}
            <div className={styles.context}>
              <span>CONTINUITY</span>
              <p>If every relation and consequence is preserved, what must remain unchanged for the world itself to remain the same?</p>
            </div>
            <div className={styles.reflectionControls}>
              <Button variant="quiet" onClick={reconsider}>RECONSIDER</Button>
              <Button onClick={finish}>COMPLETE EXPERIMENT</Button>
            </div>
          </motion.section>
        )}

        {stage === "completed" && state.criterion !== null && (
          <section className={styles.completed}>
            <p className={styles.eyebrow}>02 / {String(experimentIds.length).padStart(2, "0")}</p>
            <h1>REPLACE THE WORLD COMPLETE</h1>
            <p>{criterionReflection[state.criterion].title}</p>
            <Link href="/experiment/evidence-chain" className={styles.nextLink}>Continue to 03 — Evidence Chain <span aria-hidden="true">↗</span></Link>
          </section>
        )}
      </main>
    </ApplicationShell>
  );
}

function WorldScene({ replacedCount, reduceMotion }: { replacedCount: number; reduceMotion: boolean }) {
  return (
    <figure className={styles.scene} aria-label={`A room with ${replacedCount} of ${replacementElements.length} elements replaced by simulated equivalents`}>
      <div className={styles.sky} data-simulated={replacedCount >= 1} />
      <div className={styles.wall} data-simulated={replacedCount >= 2} />
      <div className={styles.window} data-simulated={replacedCount >= 3}><span /></div>
      <div className={styles.plant} data-simulated={replacedCount >= 4}><i /><i /><i /></div>
      <div className={styles.desk} data-simulated={replacedCount >= 5} />
      <div className={styles.object} data-simulated={replacedCount >= 6} />
      <motion.div className={styles.person} data-simulated={replacedCount >= 7} animate={reduceMotion ? undefined : { x: [0, 1.5, 0] }} transition={{ duration: 3.5, repeat: Infinity }}><span /></motion.div>
      <figcaption>PHYSICAL <span aria-hidden="true">↔</span> SIMULATED</figcaption>
    </figure>
  );
}
