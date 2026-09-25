"use client";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { experimentIds } from "@/features/individual-session/registry";
import { useIndividualSession } from "@/features/individual-session/provider";
import { getExperimentPath } from "@/features/individual-session/routing";
import { buildPhilosophicalMap } from "./scoring";
import type { BroadPosition } from "./types";
import styles from "./philosophical-map-experience.module.css";
const positionLabels: Record<BroadPosition, string> = {
  "strong-left": "STRONGLY TENDS LEFT",
  left: "TENDS LEFT",
  balanced: "HOLDS THE TENSION",
  right: "TENDS RIGHT",
  "strong-right": "STRONGLY TENDS RIGHT",
};
const positionOffsets: Record<BroadPosition, number> = {
  "strong-left": 10,
  left: 30,
  balanced: 50,
  right: 70,
  "strong-right": 90,
};
export function PhilosophicalMapExperience() {
  const { ready, session, restartExperience } = useIndividualSession();
  const reduce = useReducedMotion();
  if (!ready || !session)
    return (
      <ApplicationShell mode="immersive">
        <main className={styles.loading}>Assembling your map.</main>
      </ApplicationShell>
    );
  const result = buildPhilosophicalMap(session);
  if (result.completeExperiments < experimentIds.length) {
    const next =
      experimentIds.find(
        (id) => session.experiments[id].status !== "completed",
      ) ?? "simulation";
    return (
      <ApplicationShell mode="immersive" label="REALITY PENDING / MAP">
        <main className={styles.incomplete}>
          <p>YOUR PHILOSOPHICAL MAP</p>
          <h1>The map forms after all seven experiments.</h1>
          <span>
            {result.completeExperiments} / {experimentIds.length} complete
          </span>
          <Link href={getExperimentPath(next)}>Continue the experience</Link>
        </main>
      </ApplicationShell>
    );
  }
  return (
    <ApplicationShell
      mode="immersive"
      label="REALITY PENDING / YOUR PHILOSOPHICAL MAP"
    >
      <main className={styles.map}>
        <header>
          <p className={styles.eyebrow}>
            SEVEN EXPERIMENTS / ONE PROVISIONAL MAP
          </p>
          <h1>YOUR PHILOSOPHICAL MAP</h1>
          <p>
            This is not a score or a type. It describes where your recorded
            decisions placed weight when certainty, reality, mind and identity
            came apart.
          </p>
        </header>
        <section
          className={styles.dimensions}
          aria-label="Five philosophical dimensions"
        >
          {result.dimensions.map((dimension, index) => {
            const pct = positionOffsets[dimension.position];
            return (
              <motion.article
                key={dimension.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : index * 0.08 }}
              >
                <div className={styles.dimensionHeading}>
                  <h2>{dimension.title}</h2>
                  <span>{positionLabels[dimension.position]}</span>
                </div>
                <div
                  className={styles.axis}
                  aria-label={`${dimension.title}: ${positionLabels[dimension.position].toLowerCase()}, between ${dimension.left} and ${dimension.right}`}
                >
                  <i style={{ left: `${pct}%` }} />
                  <b />
                  <div>
                    <span>{dimension.left}</span>
                    <span>{dimension.right}</span>
                  </div>
                </div>
                <p>{dimension.description}</p>
              </motion.article>
            );
          })}
        </section>
        <section className={styles.observations}>
          <p className={styles.eyebrow}>WHAT YOUR RESPONSES TENDED TO DO</p>
          <ol>
            {result.observations.map((observation, index) => (
              <li key={observation}>
                <span>0{index + 1}</span>
                <p>{observation}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.thinkers}>
          <p className={styles.eyebrow}>QUESTIONS WITH A HISTORY</p>
          <p>
            Your responses touch questions raised by Descartes about certainty,
            Locke about memory and identity, Turing about evidence for minded
            behavior, and Searle about whether behavior and computation are
            enough. These are connections between problems—not matches between
            you and a thinker.
          </p>
        </section>
        <footer>
          <Link className={styles.concepts} href="/concepts">
            Explore the concepts
          </Link>
          <Button
            variant="quiet"
            onClick={() => {
              if (
                window.confirm(
                  "Restart Individual Mode and erase this local response history?",
                )
              )
                restartExperience();
            }}
          >
            RESTART EXPERIENCE
          </Button>
        </footer>
      </main>
    </ApplicationShell>
  );
}
