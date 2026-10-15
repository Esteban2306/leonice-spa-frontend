"use client";

import { useState } from "react";

import { formatPesos } from "@/src/features/landing/lib/format";

interface PriceRangeProps {
  bounds: { min: number; max: number };
  value: { min: number | null; max: number | null };
  onCommit: (value: { min: number | null; max: number | null }) => void;
}

const STEP = 1000;

export function PriceRange({ bounds, value, onCommit }: PriceRangeProps) {
  const [low, setLow] = useState(value.min ?? bounds.min);
  const [high, setHigh] = useState(value.max ?? bounds.max);

  const span = Math.max(bounds.max - bounds.min, 1);
  const left = ((low - bounds.min) / span) * 100;
  const right = ((high - bounds.min) / span) * 100;
  const disabled = bounds.max <= bounds.min;

  const commit = () =>
    onCommit({
      min: low <= bounds.min ? null : low,
      max: high >= bounds.max ? null : high,
    });

  return (
    <div className="flex min-w-[15rem] flex-col gap-2">
      <div className="flex items-baseline justify-between font-sans text-xs font-bold tabular-nums text-[#7a5a2c]">
        <span>{formatPesos(low)}</span>
        <span>{formatPesos(high)}</span>
      </div>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#062112]/10" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#BF9250]"
          style={{ left: `${left}%`, right: `${100 - right}%` }}
        />
        <input
          type="range"
          aria-label="Precio mínimo"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={low}
          disabled={disabled}
          onChange={(event) => setLow(Math.min(Number(event.target.value), high))}
          onPointerUp={commit}
          onKeyUp={commit}
          className="catalog-range absolute inset-0 w-full"
        />
        <input
          type="range"
          aria-label="Precio máximo"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={high}
          disabled={disabled}
          onChange={(event) => setHigh(Math.max(Number(event.target.value), low))}
          onPointerUp={commit}
          onKeyUp={commit}
          className="catalog-range absolute inset-0 w-full"
        />
      </div>
    </div>
  );
}
