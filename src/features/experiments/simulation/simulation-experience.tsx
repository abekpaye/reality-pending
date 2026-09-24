"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { experimentIds } from "@/features/individual-session/registry";
import { useExperimentSession } from "@/features/individual-session/provider";
import { motionDurations, motionEase } from "@/lib/motion";
import { contextItems, narrativeMoments, positionCopy } from "./simulation.copy";
import { parseSimulationState, serializeSimulationState } from "./simulation.logic";
import type { SimulationPosition, SimulationResponseState } from "./simulation.types";
import styles from "./simulation-experience.module.css";

const positionOrder: SimulationPosition[] = ["physical-reality", "uncertain", "experiential-reality"];

export function SimulationExperience() {
  const reduceMotion = useReducedMotion();
  const { ready, experiment, start, updateData, complete } = useExperimentSession("simulation");
  const state = parseSimulationState(experiment?.data ?? null);
  const isCompleted = experiment?.status === "completed";
  const resolvedStage = isCompleted ? "completed" : state.stage;

  useEffect(() => {
    if (ready && experiment?.status === "not-started") start();
  }, [experiment?.status, ready, start]);

  useEffect(() => {
    if (ready) window.scrollTo({ top: 0, behavior: "auto" });
  }, [ready, resolvedStage]);

  function persist(next: SimulationResponseState) {
    updateData(serializeSimulationState(next));
  }

  function advanceNarrative() {
    if (state.narrativeStep < 2) {
      persist({ ...state, narrativeStep: (state.narrativeStep + 1) as 1 | 2 });
      return;
    }
    persist({ ...state, stage: "positioning" });
  }

  function selectPosition(position: SimulationPosition) {
    persist({ ...state, selectedPosition: position });
  }

  function commitPosition() {
    if (state.selectedPosition === null) return;
    persist({ ...state, stage: "reflection", committedPosition: state.selectedPosition });
  }

  function reconsider() {
    persist({ ...state, stage: "positioning", committedPosition: null });
  }

  function completeSimulation() {
    if (state.committedPosition === null) return;
    complete(serializeSimulationState({ ...state, stage: "completed" }));
  }

  if (!ready || experiment === null) {
    return (
      <ApplicationShell mode="immersive" label="REALITY PENDING / 01">
        <main className={styles.loading} aria-live="polite">Preparing the experiment.</main>
      </ApplicationShell>
    );
  }

  const substrateRevealed = resolvedStage !== "narrative" || state.narrativeStep > 0;

  return (
    <ApplicationShell mode="immersive" label="REALITY PENDING / 01 — SIMULATION">
      <main className={styles.experience} data-substrate={substrateRevealed ? "simulated" : "physical"}>
        <div className={styles.structure} aria-hidden="true" />
        <header className={styles.header}>
          <Link href="/" className={styles.returnLink}>Exit</Link>
          <ProgressIndicator
            current={1}
            total={experimentIds.length}
            label="Experiment progress"
            currentComplete={resolvedStage === "completed"}
          />
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {resolvedStage === "narrative" && (
            <motion.section
              key={`narrative-${state.narrativeStep}`}
              className={styles.narrative}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : motionDurations.standard, ease: motionEase }}
              aria-labelledby="simulation-narrative"
            >
              <p className={styles.eyebrow}>01 — SIMULATION</p>
              <div id="simulation-narrative" className={styles.narrativeCopy}>
                {narrativeMoments[state.narrativeStep].map((line, index) => (
                  <p key={line} className={index === 0 ? styles.primaryLine : styles.followingLine}>{line}</p>
                ))}
              </div>
              <button className={styles.advance} type="button" onClick={advanceNarrative}>
                <span>{state.narrativeStep === 2 ? "Consider what follows" : "Continue"}</span>
                <span aria-hidden="true">↓</span>
              </button>
            </motion.section>
          )}

          {resolvedStage === "positioning" && (
            <motion.section
              key="positioning"
              className={styles.positioning}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : motionDurations.scene, ease: motionEase }}
              aria-labelledby="simulation-question"
            >
              <p className={styles.eyebrow}>WHAT IS REAL?</p>
              <h1 id="simulation-question">HAS ANYTHING IMPORTANT ABOUT REALITY ACTUALLY CHANGED?</h1>
              <p className={styles.instruction}>Position yourself near the view that comes closest to your own.</p>

              <div className={styles.field} data-selection={state.selectedPosition ?? "none"}>
                <div className={styles.fieldLines} aria-hidden="true" />
                <motion.div
                  className={styles.marker}
                  layout
                  transition={reduceMotion ? { duration: 0 } : { duration: motionDurations.standard, ease: motionEase }}
                  aria-hidden="true"
                />
                {positionOrder.map((position) => {
                  const active = state.selectedPosition === position;
                  return (
                    <button
                      key={position}
                      type="button"
                      className={styles.position}
                      data-position={position}
                      data-active={active}
                      aria-pressed={active}
                      onClick={() => selectPosition(position)}
                    >
                      <span className={styles.positionTitle}>{positionCopy[position].title}</span>
                      <span className={styles.positionSupport}>{positionCopy[position].support}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.commit}>
                <Button onClick={commitPosition} disabled={state.selectedPosition === null}>THIS IS CLOSEST TO MY VIEW</Button>
              </div>
            </motion.section>
          )}

          {resolvedStage === "reflection" && state.committedPosition !== null && (
            <ReflectionScene
              key="reflection"
              position={state.committedPosition}
              reduceMotion={Boolean(reduceMotion)}
              onReconsider={reconsider}
              onComplete={completeSimulation}
            />
          )}

          {resolvedStage === "completed" && state.committedPosition !== null && (
            <motion.section
              key="completed"
              className={styles.completed}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : motionDurations.scene, ease: motionEase }}
              aria-labelledby="simulation-complete"
            >
              <p className={styles.eyebrow}>01 / {String(experimentIds.length).padStart(2, "0")}</p>
              <h1 id="simulation-complete">SIMULATION COMPLETE</h1>
              <div className={styles.completedPosition}>
                <p className={styles.completedLabel}>Your position</p>
                <p>{positionCopy[state.committedPosition].title}</p>
              </div>
              <p className={styles.completionNote}>Your response has been preserved. The next experiment is not yet available.</p>
              <Link href="/" className={styles.textLink}>Return to REALITY PENDING</Link>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </ApplicationShell>
  );
}

function ReflectionScene({
  position,
  reduceMotion,
  onReconsider,
  onComplete,
}: {
  position: SimulationPosition;
  reduceMotion: boolean;
  onReconsider(): void;
  onComplete(): void;
}) {
  const reflection = positionCopy[position].reflection;
  return (
    <motion.section
      className={styles.reflection}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : motionDurations.scene, ease: motionEase }}
      aria-labelledby="simulation-reflection"
    >
      <p className={styles.eyebrow}>PAUSE AND REFLECT</p>
      <h1 id="simulation-reflection">{reflection[0]}</h1>
      <p className={styles.reflectionLead}>{reflection[1]}</p>

      <div className={styles.context}>
        <p className={styles.contextHeading}>THIS QUESTION TOUCHES ON</p>
        <dl>
          {contextItems.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.question}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.contextNote}>These traditions ask how reality, experience and certainty relate. No single response settles the debate.</p>
      </div>

      <div className={styles.reflectionControls}>
        <Button variant="quiet" onClick={onReconsider}>RECONSIDER</Button>
        <Button onClick={onComplete}>COMPLETE EXPERIMENT</Button>
      </div>
    </motion.section>
  );
}
