import type { Metadata } from "next";
import { IntroExperience } from "@/features/entry/intro-experience";

export const metadata: Metadata = {
  title: "Before We Begin — REALITY PENDING",
  description: "Prepare to enter the Reality Pending philosophy experiment.",
};

export default function IntroPage() {
  return <IntroExperience />;
}
