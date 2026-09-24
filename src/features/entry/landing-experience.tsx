"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { motionEase, narrativeLine, narrativeSequence } from "@/lib/motion";

export function LandingExperience() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  function enterExperience() {
    if (leaving) return;
    setLeaving(true);
    if (reduceMotion) {
      router.push("/intro");
      return;
    }
    window.setTimeout(() => router.push("/intro"), 260);
  }

  return (
    <ApplicationShell mode="public">
      <AnimatePresence>
        {!leaving && (
          <motion.main
            className="landing"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, transition: { duration: 0.24, ease: motionEase } }}
            variants={narrativeSequence}
          >
            <motion.div className="landing__context" variants={narrativeLine}>
              <span>Interactive philosophy lab</span>
              <span>University seminar / 01</span>
            </motion.div>

            <motion.div className="landing__identity" variants={narrativeLine}>
              <h1>
                <span>REALITY</span>
                <span className="landing__pending">PENDING<span aria-hidden="true" className="pending-mark" /></span>
              </h1>
              <p>An Interactive Philosophy Experiment</p>
            </motion.div>

            <motion.div className="landing__questions" variants={narrativeLine} aria-label="Questions explored by Reality Pending">
              <p>What is real?</p>
              <p>What can you know?</p>
              <p>What makes you human?</p>
            </motion.div>

            <motion.div className="landing__entry" variants={narrativeLine}>
              <Button className="landing__cta" onClick={enterExperience}>
                ENTER THE EXPERIMENT
              </Button>
              <p>Think first. Decide second. Doubt everything.</p>
            </motion.div>

            <div className="landing__boundary" aria-hidden="true"><span /></div>
          </motion.main>
        )}
      </AnimatePresence>
    </ApplicationShell>
  );
}
