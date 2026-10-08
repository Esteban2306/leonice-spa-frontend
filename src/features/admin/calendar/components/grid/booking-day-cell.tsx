import type { AvailabilityDay } from "@/src/features/admin/types/reservations.types";

import { AVAILABILITY_REASON_LABELS } from "../../lib/booking";
import type { CalendarViewMode } from "../../types/calendar.types";

interface BookingDayCellProps {
  date: Date;
  variant: CalendarViewMode;
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth: boolean;
  availability: AvailabilityDay | null;
  isLoading: boolean;
  onSelect: (date: Date) => void;
}

const LABEL_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function BookingDayCell({
  date,
  variant,
  isToday,
  isSelected,
  isOutsideMonth,
  availability,
  isLoading,
  onSelect,
}: BookingDayCellProps) {
  const isAvailable = Boolean(availability?.available);
  const isActive = isSelected && isAvailable;
  const slotCount = availability?.slots.length ?? 0;
  const status = isLoading
    ? "Consultando…"
    : isAvailable
      ? `${slotCount} ${slotCount === 1 ? "horario" : "horarios"}`
      : availability?.reason
        ? AVAILABILITY_REASON_LABELS[availability.reason]
        : "No disponible";

  const tone = isActive
    ? "border-secondary bg-secondary text-primary"
    : isAvailable
      ? "border-green-700/30 bg-white text-secondary hover:border-green-700 hover:bg-green-50"
      : "border-transparent bg-secondary/[0.04] text-secondary/35";

  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={() => onSelect(date)}
      aria-pressed={isActive}
      aria-label={`${LABEL_FORMATTER.format(date)}, ${status}`}
      className={`flex w-full flex-col gap-1 rounded-xl border p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed md:rounded-2xl md:p-2.5 ${
        variant === "month" ? "min-h-16 md:min-h-24" : "min-h-20 md:min-h-40"
      } ${tone} ${isOutsideMonth && !isActive ? "opacity-40" : ""} ${
        isAvailable ? "cursor-pointer" : ""
      }`}
    >
      <span
        className={`grid size-6 place-items-center rounded-full font-sans text-xs md:size-7 md:text-sm ${
          isToday ? "bg-tertiary font-semibold text-secondary" : ""
        }`}
      >
        {date.getDate()}
      </span>

      <span
        className={`hidden font-sans text-[11px] md:block ${
          isAvailable && !isActive ? "text-green-800" : ""
        } ${isLoading ? "animate-pulse" : ""}`}
      >
        {status}
      </span>

      {isAvailable && (
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full md:hidden ${
            isActive ? "bg-quaternary" : "bg-green-700"
          }`}
        />
      )}
    </button>
  );
}
