import type { Metadata } from "next";
import { ClassModeEntry } from "@/features/class-mode/class-mode-entry";
export const metadata: Metadata = { title: "Class Mode — REALITY PENDING" };
export default function Page() {
  return <ClassModeEntry />;
}
