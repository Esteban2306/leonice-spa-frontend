"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

const COMMIT_DELAY_MS = 700;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 50;

interface CapacityStepperProps {
  poolName: string;
  value: number;
  disabled?: boolean;
  onCommit: (value: number) => Promise<boolean>;
}

const STEP_BUTTON =
  "grid size-7 cursor-pointer place-items-center rounded-full border border-primary/25 text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary disabled:cursor-not-allowed disabled:opacity-40";

export function CapacityStepper({
  poolName,
  value,
  disabled,
  onCommit,
}: CapacityStepperProps) {
  const [draft, setDraft] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = draft ?? value;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const schedule = (next: number) => {
    setDraft(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      if (next === value) {
        setDraft(null);
        return;
      }
      void onCommit(next).then(() => setDraft(null));
    }, COMMIT_DELAY_MS);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0 truncate font-sans text-xs text-primary/75">
        {poolName}
      </span>
      <div
        role="group"
        aria-label={`Citas simultáneas en ${poolName}`}
        className="flex items-center gap-1.5"
      >
        <button
          type="button"
          aria-label={`Quitar una cita simultánea en ${poolName}`}
          disabled={disabled || shown <= MIN_CAPACITY}
          onClick={() => schedule(shown - 1)}
          className={STEP_BUTTON}
        >
          <Minus className="size-3.5" strokeWidth={2} />
        </button>
        <output
          aria-live="polite"
          className={`w-6 text-center font-sans text-sm font-semibold tabular-nums ${draft !== null ? "text-quaternary" : "text-primary"}`}
        >
          {shown}
        </output>
        <button
          type="button"
          aria-label={`Agregar una cita simultánea en ${poolName}`}
          disabled={disabled || shown >= MAX_CAPACITY}
          onClick={() => schedule(shown + 1)}
          className={STEP_BUTTON}
        >
          <Plus className="size-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
