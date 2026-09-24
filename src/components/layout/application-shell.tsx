import type { ReactNode } from "react";

interface ApplicationShellProps {
  children: ReactNode;
  label?: string;
  mode?: "standard" | "public" | "immersive";
}

export function ApplicationShell({ children, label = "REALITY PENDING", mode = "standard" }: ApplicationShellProps) {
  return (
    <div className="app-shell" data-mode={mode}>
      <header className="app-shell__header">
        <span className="app-shell__mark" aria-hidden="true">RP</span>
        <span className="app-shell__label">{label}</span>
      </header>
      {children}
      <div className="app-shell__edge" aria-hidden="true" />
    </div>
  );
}
