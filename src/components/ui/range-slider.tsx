"use client";

import { useId, useState } from "react";

interface RangeSliderProps {
  label: string;
  minLabel?: string;
  maxLabel?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
}

export function RangeSlider({ label, minLabel = "Less", maxLabel = "More", defaultValue = 54, min = 0, max = 100 }: RangeSliderProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const position = ((value - min) / (max - min)) * 100;

  return (
    <div className="range-field" style={{ "--range-position": `${position}%` } as React.CSSProperties}>
      <div className="range-field__heading">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{value}</output>
      </div>
      <input id={id} type="range" min={min} max={max} value={value} onChange={(event) => setValue(Number(event.target.value))} />
      <div className="range-field__limits" aria-hidden="true"><span>{minLabel}</span><span>{maxLabel}</span></div>
    </div>
  );
}
