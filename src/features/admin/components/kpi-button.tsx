import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  dark: "border-secondary bg-secondary text-primary",
  light: "border-tertiary/25 bg-[#FCF6EB] text-secondary",
  gold: "border-tertiary/40 bg-quaternary/30 text-secondary",
} as const;

export type KpiTone = keyof typeof TONES;

interface KpiButtonProps {
  icon: LucideIcon;
  value: string;
  label: string;
  hint?: string;
  tone?: KpiTone;
  isActive?: boolean;
  numericFont?: boolean;
  onClick: () => void;
}

export function KpiButton({
  icon: Icon,
  value,
  label,
  hint,
  tone = "light",
  isActive,
  numericFont,
  onClick,
}: KpiButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "flex flex-col gap-2 rounded-[1.75rem] border p-4 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
        TONES[tone],
        isActive && "ring-2 ring-tertiary ring-offset-2 ring-offset-primary",
      )}
    >
      <Icon className="size-4.5 opacity-70" strokeWidth={1.8} />
      <span
        className={cn(
          "text-3xl leading-none",
          numericFont ? "font-sans font-light tabular-nums" : "font-heading",
        )}
      >
        {value}
      </span>
      <span className="font-sans text-sm">{label}</span>
      {hint && <span className="font-sans text-xs opacity-80">{hint}</span>}
    </button>
  );
}
