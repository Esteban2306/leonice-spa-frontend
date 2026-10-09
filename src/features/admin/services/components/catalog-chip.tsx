import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONES = {
  neutral: "border-secondary/15 bg-white text-secondary/70",
  gold: "border-tertiary/45 bg-quaternary/30 text-secondary",
  green: "border-green-300 bg-green-50 text-green-800",
  amber: "border-amber-300 bg-amber-50 text-amber-900",
  muted: "border-secondary/10 bg-secondary/5 text-secondary/75",
  onDark: "border-primary/25 bg-primary/10 text-primary",
} as const;

export type ChipTone = keyof typeof TONES;

interface CatalogChipProps {
  tone?: ChipTone;
  icon?: ReactNode;
  children: ReactNode;
}

export function CatalogChip({
  tone = "neutral",
  icon,
  children,
}: CatalogChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-sans text-[11px] leading-5 whitespace-nowrap",
        TONES[tone],
      )}
    >
      {icon}
      {children}
    </span>
  );
}
