import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="tooltip">
      <span className="tooltip__trigger" tabIndex={0} aria-describedby={`tooltip-${label.replaceAll(" ", "-").toLowerCase()}`}>{children}</span>
      <span className="tooltip__content" role="tooltip" id={`tooltip-${label.replaceAll(" ", "-").toLowerCase()}`}>{label}</span>
    </span>
  );
}
