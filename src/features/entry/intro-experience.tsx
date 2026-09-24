"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { experienceStartBoundary } from "@/features/entry/experience-start";
import { useIndividualSession } from "@/features/individual-session/provider";
import { motionDurations, motionEase } from "@/lib/motion";

const statements = [
  "THIS IS NOT A TEST.",
  "THERE ARE NO SIMPLE CORRECT ANSWERS.",
  "RESPOND ACCORDING TO WHAT YOU ACTUALLY BELIEVE.",
] as const;

export function IntroExperience() {
  const [step, setStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const { ready, startExperiment } = useIndividualSession();
  const complete = step === statements.length - 1;

  function advance() {
    setStep((current) => Math.min(current + 1, statements.length - 1));
  }

  function begin() {
    if (!ready || !experienceStartBoundary.enabled || experienceStartBoundary.destination === null) return;
    startExperiment(experienceStartBoundary.firstExperiment);
    router.push(experienceStartBoundary.destination);
  }

  return (
    <ApplicationShell mode="immersive" label="REALITY PENDING / INTRO">
      <main className="intro-scene">
        <nav className="intro-scene__nav" aria-label="Intro navigation">
          <Link href="/">Return</Link>
          <span>Before we begin</span>
        </nav>

        <div className="intro-scene__sequence" aria-live="polite">
          <div className="intro-scene__history" aria-hidden="true">
            {statements.slice(0, step).map((statement, index) => (
              <motion.p key={statement} initial={false} animate={{ opacity: 0.28 - index * 0.04 }}>{statement}</motion.p>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className="intro-scene__current"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : motionDurations.standard, ease: motionEase }}
            >
              <p className="intro-scene__number">0{step + 1}</p>
              <h1>{statements[step]}</h1>
              {complete && <p className="intro-scene__support">Your answers will shape a map of the assumptions you rely on.</p>}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="intro-scene__controls">
          <div className="intro-scene__progress" aria-label={`Intro statement ${step + 1} of ${statements.length}`}>
            <span>{String(step + 1).padStart(2, "0")}</span>
            <span aria-hidden="true">/</span>
            <span>{String(statements.length).padStart(2, "0")}</span>
          </div>

          {!complete ? (
            <Button onClick={advance}>CONTINUE</Button>
          ) : (
            <div className="intro-scene__begin">
              <p className="label-text">READY?</p>
              <Button onClick={begin} disabled={!ready || !experienceStartBoundary.enabled}>BEGIN</Button>
              <p className="micro-text">01 / Simulation</p>
            </div>
          )}
        </div>
      </main>
    </ApplicationShell>
  );
}
