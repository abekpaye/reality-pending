import type { Metadata } from "next";
import { ReplaceWorldExperience } from "@/features/experiments/replace-world/replace-world-experience";

export const metadata: Metadata = { title: "When Does Reality Stop Being Real? — REALITY PENDING" };
export default function ReplaceWorldPage() { return <ReplaceWorldExperience />; }
