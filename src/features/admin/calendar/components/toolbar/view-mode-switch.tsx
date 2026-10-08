import type { CalendarViewMode } from "../../types/calendar.types";

interface ViewModeSwitchProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

const OPTIONS: ReadonlyArray<{ value: CalendarViewMode; label: string }> = [
  { value: "month", label: "Mes" },
  { value: "week", label: "Semana" },
];

export function ViewModeSwitch({
  viewMode,
  onViewModeChange,
}: ViewModeSwitchProps) {
  return (
    <div
      role="group"
      aria-label="Vista del calendario"
      className="flex w-full items-center gap-1 rounded-full border border-secondary/15 bg-white p-1 sm:inline-flex sm:w-auto"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === viewMode;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onViewModeChange(option.value)}
            className={`h-8 cursor-pointer rounded-full px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary max-sm:flex-1 ${
              isActive
                ? "bg-secondary text-primary"
                : "text-secondary/65 hover:bg-secondary/5"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
