"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import {
  MAX_VARIANT_PRICE_PESOS,
  formatPesosInput,
  parsePesos,
} from "../lib/product-catalog";

interface InlinePriceProps {
  value: number;
  label: string;
  disabled?: boolean;
  onCommit: (pesos: number) => Promise<boolean>;
}

export function InlinePrice({
  value,
  label,
  disabled,
  onCommit,
}: InlinePriceProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const cancelled = useRef(false);
  const shown = draft ?? formatPesosInput(value);
  const parsed = draft === null ? value : parsePesos(draft);
  const isInvalid =
    draft !== null && (parsed === null || parsed > MAX_VARIANT_PRICE_PESOS);

  const commit = async () => {
    if (cancelled.current) {
      cancelled.current = false;
      setDraft(null);
      return;
    }
    if (draft === null) return;
    if (parsed === null || isInvalid || parsed === value) {
      setDraft(null);
      return;
    }
    setIsSaving(true);
    const ok = await onCommit(parsed);
    setIsSaving(false);
    if (ok) setDraft(null);
  };

  return (
    <div
      className={cn(
        "flex h-10 w-36 items-center justify-end gap-1 rounded-xl border px-3 transition-colors focus-within:border-tertiary focus-within:ring-2 focus-within:ring-tertiary/40",
        isInvalid
          ? "border-red-400 bg-red-50"
          : draft !== null
            ? "border-tertiary bg-white"
            : "border-secondary/10 bg-white/50 hover:border-secondary/20 hover:bg-white",
        isSaving && "opacity-60",
      )}
    >
      <span aria-hidden="true" className="font-sans text-sm text-secondary/50">
        $
      </span>
      <input
        inputMode="numeric"
        aria-label={`Precio de ${label} en pesos`}
        aria-invalid={isInvalid}
        disabled={disabled || isSaving}
        value={shown}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            cancelled.current = true;
            event.currentTarget.blur();
          }
        }}
        size={Math.max(shown.length, 4)}
        className="min-w-0 bg-transparent text-right font-sans text-sm font-semibold text-secondary tabular-nums outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
