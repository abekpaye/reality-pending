import type { Variants } from "framer-motion";

export const motionDurations = {
  quick: 0.18,
  standard: 0.36,
  scene: 0.62,
} as const;

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const sceneEntrance: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: motionDurations.scene, ease: motionEase } },
};

export const narrativeSequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

export const narrativeLine: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: motionDurations.standard, ease: motionEase } },
};

export const reflectionReveal: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: motionDurations.standard, ease: motionEase } },
};
