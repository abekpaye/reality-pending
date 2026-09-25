import type { Metadata } from "next";
import { Suspense } from "react";
import { ParticipantRoom } from "@/features/class-mode/participant-room";
export const metadata: Metadata = { title: "Join a Seminar — REALITY PENDING" };
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ParticipantRoom />
    </Suspense>
  );
}
