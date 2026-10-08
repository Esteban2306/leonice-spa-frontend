import { ChevronLeft, ChevronRight } from "lucide-react";

import { ToolbarButton } from "./toolbar-button";

interface PeriodNavigatorProps {
  periodLabel: string;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ARROW_CLASS =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-secondary/15 bg-white text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function PeriodNavigator({
  periodLabel,
  onToday,
  onPrevious,
  onNext,
}: PeriodNavigatorProps) {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <ToolbarButton onClick={onToday} className="shrink-0">
        Hoy
      </ToolbarButton>

      <button
        type="button"
        onClick={onPrevious}
        aria-label="Periodo anterior"
        className={ARROW_CLASS}
      >
        <ChevronLeft className="size-4" />
      </button>

      <span
        aria-live="polite"
        className="min-w-0 flex-1 truncate text-center font-sans text-sm capitalize text-secondary sm:min-w-40 sm:flex-none"
      >
        {periodLabel}
      </span>

      <button
        type="button"
        onClick={onNext}
        aria-label="Periodo siguiente"
        className={ARROW_CLASS}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
