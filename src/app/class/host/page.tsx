import type { Metadata } from "next";
import { HostConsole } from "@/features/class-mode/host-console";
export const metadata: Metadata = { title: "Host a Seminar — REALITY PENDING" };
export default function Page() {
  return <HostConsole />;
}
