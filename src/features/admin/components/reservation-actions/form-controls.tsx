import type { ReactNode, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-sans text-xs uppercase tracking-[0.16em] text-secondary/55"
      >
        {label}
      </label>
      {children}
      {hint && <p className="font-sans text-xs text-secondary/55">{hint}</p>}
    </div>
  );
}

export const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-secondary/15 bg-white px-3 font-sans text-sm text-secondary outline-none transition-colors placeholder:text-secondary/35 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40";

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(INPUT_CLASS, "h-auto min-h-20 resize-y py-2", className)}
      {...props}
    />
  );
}

interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function CheckboxField({
  id,
  checked,
  onChange,
  label,
  description,
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-secondary/10 bg-white/60 p-3"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 cursor-pointer accent-secondary"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-sans text-sm text-secondary">{label}</span>
        {description && (
          <span className="font-sans text-xs text-secondary/55">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

interface ChoicePillsProps<T extends string> {
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function ChoicePills<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: ChoicePillsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex w-full items-center gap-1 rounded-full border border-secondary/15 bg-white p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 flex-1 cursor-pointer rounded-full px-3 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
              isActive
                ? "bg-secondary text-primary"
                : "text-secondary/65 hover:bg-secondary/5",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
