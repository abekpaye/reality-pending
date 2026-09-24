import type { ReactNode } from "react";

interface ReflectionRegionProps {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function ReflectionRegion({ eyebrow = "Pause / Reflect", title, children }: ReflectionRegionProps) {
  return (
    <aside className="reflection-region">
      <div className="reflection-region__rule" aria-hidden="true"><span /></div>
      <div className="reflection-region__content">
        <p className="label-text">{eyebrow}</p>
        <h3>{title}</h3>
        <div className="body-secondary">{children}</div>
      </div>
    </aside>
  );
}
