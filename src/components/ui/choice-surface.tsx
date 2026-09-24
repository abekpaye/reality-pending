import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ChoiceSurfaceProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  index?: string;
  children: ReactNode;
}

export function ChoiceSurface({ selected = false, index, children, className = "", ...props }: ChoiceSurfaceProps) {
  return (
    <button
      type="button"
      className={`choice-surface ${className}`.trim()}
      data-selected={selected || undefined}
      aria-pressed={selected}
      {...props}
    >
      {index && <span className="choice-surface__index" aria-hidden="true">{index}</span>}
      <span className="choice-surface__content">{children}</span>
      <span className="choice-surface__state" aria-hidden="true" />
    </button>
  );
}
