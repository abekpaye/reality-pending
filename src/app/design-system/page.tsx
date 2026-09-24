"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { ChoiceSurface } from "@/components/ui/choice-surface";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { RangeSlider } from "@/components/ui/range-slider";
import { ReflectionRegion } from "@/components/ui/reflection-region";
import { ReflectiveTextarea } from "@/components/ui/reflective-textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { experimentRegistry } from "@/data/experiments";
import { motionEase, narrativeLine, narrativeSequence, sceneEntrance } from "@/lib/motion";
import type { AccentIdentifier } from "@/types/experiments";

const accentOptions: Array<{ id: AccentIdentifier; name: string }> = [
  { id: "blue", name: "Electric blue" },
  { id: "lime", name: "Lime" },
  { id: "coral", name: "Coral" },
  { id: "violet", name: "Soft violet" },
  { id: "yellow", name: "Warm yellow" },
];

export default function DesignSystemPage() {
  const [accent, setAccent] = useState<AccentIdentifier>("blue");
  const [choice, setChoice] = useState(1);
  const reduceMotion = useReducedMotion();

  return (
    <ApplicationShell label="REALITY PENDING / INTERNAL REVIEW">
      <main className="design-system" data-accent={accent}>
        <motion.header className="ds-intro" initial={reduceMotion ? false : "hidden"} animate="visible" variants={sceneEntrance}>
          <div>
            <p className="label-text">Internal visual review / 02</p>
            <h1>Design as a way<br />of holding doubt.</h1>
          </div>
          <p className="body-large">A restrained system for questions that should feel larger than the interface around them.</p>
        </motion.header>

        <section className="ds-section" aria-labelledby="type-heading">
          <SectionHeader index="01" title="Typography" note="Geist Sans / responsive editorial scale" id="type-heading" />
          <div className="type-specimen">
            <p className="display-text">REALITY<br />PENDING</p>
            <p className="question-text">What would count as proof?</p>
            <h3 className="experiment-title">The shape of uncertainty</h3>
            <h4 className="section-title">Section title with a quieter weight</h4>
            <p className="body-large">The body scale holds enough air for careful reading without turning every statement into a proclamation.</p>
            <p className="body-secondary">Secondary text recedes, but remains comfortably readable across the experience.</p>
            <p className="label-text">Small label / tracked intentionally</p>
            <p className="meta-text">Metadata / 13px / supporting context</p>
            <p className="micro-text">Microcopy is reserved for truly secondary information.</p>
          </div>
        </section>

        <section className="ds-section" aria-labelledby="color-heading">
          <SectionHeader index="02" title="Color & accent" note="Neutral by default. One active signal at a time." id="color-heading" />
          <div className="accent-switcher" role="group" aria-label="Preview accent color">
            {accentOptions.map((option) => (
              <button key={option.id} type="button" data-accent-choice={option.id} aria-pressed={accent === option.id} onClick={() => setAccent(option.id)}>
                <span aria-hidden="true" />{option.name}
              </button>
            ))}
          </div>
          <div className="color-field">
            <div className="color-field__neutral"><span>Background</span><span>Surface</span><span>Elevated</span></div>
            <div className="color-field__accent"><span>Active accent</span><strong>Selective, never decorative.</strong></div>
          </div>
        </section>

        <section className="ds-section" aria-labelledby="controls-heading">
          <SectionHeader index="03" title="Interaction language" note="Clear state without enterprise chrome." id="controls-heading" />
          <div className="button-row">
            <Button>Continue</Button>
            <Button variant="secondary">Consider another view</Button>
            <Button variant="quiet">Not yet</Button>
            <Button disabled>Unavailable</Button>
          </div>
          <div className="choice-layout">
            <ChoiceSurface index="A" selected={choice === 1} onClick={() => setChoice(1)}>Experience is enough to make something real.</ChoiceSurface>
            <ChoiceSurface index="B" selected={choice === 2} onClick={() => setChoice(2)}>Reality must exist independently of experience.</ChoiceSurface>
            <ChoiceSurface index="C" disabled>Disabled state remains legible.</ChoiceSurface>
          </div>
          <div className="utility-row">
            <Tooltip label="A small amount of context, available on focus">Focus this note</Tooltip>
            <span className="meta-text">Tooltips remain exceptional, not structural.</span>
          </div>
        </section>

        <section className="ds-section ds-section--split" aria-labelledby="progress-heading">
          <div>
            <SectionHeader index="04" title="Progress & continuum" note="Orientation without reward mechanics." id="progress-heading" />
            <ProgressIndicator current={3} />
          </div>
          <RangeSlider label="Confidence" minLabel="Uncertain" maxLabel="Certain" />
        </section>

        <section className="ds-section" aria-labelledby="reflection-heading">
          <SectionHeader index="05" title="Reflection" note="A shift in tempo, not a success state." id="reflection-heading" />
          <div className="reflection-layout">
            <ReflectionRegion title="Your response changes the criterion, not just the answer.">
              <p>This region creates a deliberate pause before philosophical context appears. It uses rhythm and a single structural line instead of an alert box.</p>
            </ReflectionRegion>
            <ReflectiveTextarea label="What would change your mind?" hint="Optional / 1–3 sentences" placeholder="Begin with the evidence you would trust…" rows={5} />
          </div>
        </section>

        <section className="ds-section" aria-labelledby="motion-heading">
          <SectionHeader index="06" title="Motion" note="Short, directional, and information-preserving." id="motion-heading" />
          <motion.div className="motion-specimen" variants={narrativeSequence} initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            {["A premise arrives.", "A condition changes.", "Your position becomes visible."].map((line, index) => (
              <motion.p key={line} variants={narrativeLine}><span>0{index + 1}</span>{line}</motion.p>
            ))}
            <motion.div className="motion-specimen__trace" initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.62, ease: motionEase }} />
          </motion.div>
        </section>

        <section className="ds-section" aria-labelledby="accents-heading">
          <SectionHeader index="07" title="Experiment Accent Preview" note="Metadata only. No experiment interaction is represented here." id="accents-heading" />
          <ol className="experiment-accents">
            {experimentRegistry.map((experiment) => (
              <li key={experiment.id} data-experiment-accent={experiment.accent}>
                <span className="experiment-accents__number">{String(experiment.order).padStart(2, "0")}</span>
                <span className="experiment-accents__title">{experiment.shortTitle}</span>
                <span className="experiment-accents__line" aria-hidden="true" />
                <span className="experiment-accents__accent">{experiment.accent}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="ds-footer">
          <span>REALITY PENDING</span>
          <span>Design system / Phase 02</span>
        </footer>
      </main>
    </ApplicationShell>
  );
}

function SectionHeader({ index, title, note, id }: { index: string; title: string; note: string; id: string }) {
  return (
    <header className="ds-section__header">
      <span>{index}</span>
      <h2 id={id}>{title}</h2>
      <p>{note}</p>
    </header>
  );
}
