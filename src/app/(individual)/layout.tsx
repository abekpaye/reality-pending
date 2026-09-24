import type { ReactNode } from "react";
import { IndividualSessionProvider } from "@/features/individual-session/provider";

export default function IndividualExperienceLayout({ children }: { children: ReactNode }) {
  return <IndividualSessionProvider>{children}</IndividualSessionProvider>;
}
