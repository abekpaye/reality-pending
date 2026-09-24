import type { TextareaHTMLAttributes } from "react";

interface ReflectiveTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function ReflectiveTextarea({ label, hint, id = "reflection-field", ...props }: ReflectiveTextareaProps) {
  return (
    <div className="reflective-field">
      <div className="reflective-field__heading">
        <label htmlFor={id}>{label}</label>
        {hint && <span>{hint}</span>}
      </div>
      <textarea id={id} {...props} />
      <span className="reflective-field__line" aria-hidden="true" />
    </div>
  );
}
