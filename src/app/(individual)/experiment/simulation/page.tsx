import type { Metadata } from "next";
import { SimulationExperience } from "@/features/experiments/simulation/simulation-experience";

export const metadata: Metadata = {
  title: "What Is Real? — REALITY PENDING",
  description: "Simulation, the first experiment in REALITY PENDING.",
};

export default function SimulationPage() {
  return <SimulationExperience />;
}
