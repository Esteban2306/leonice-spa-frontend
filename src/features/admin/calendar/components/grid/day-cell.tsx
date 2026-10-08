import type {
  CalendarReservation,
  CalendarViewMode,
} from "../../types/calendar.types";
import { DayCellDots } from "./day-cell-dots";
import { DayCellReservation } from "./day-cell-reservation";

interface DayCellProps {
  date: Date;
  variant: CalendarViewMode;
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth: boolean;
  reservations: readonly CalendarReservation[];
  onSelect: (date: Date) => void;
}

const PREVIEW_LIMIT: Record<CalendarViewMode, number> = {
  month: 2,
  week: 8,
};

// Valores sin prefijo = mobile; `md:` = valores originales de desktop.
const LAYOUT: Record<CalendarViewMode, string> = {
  month:
    "min-h-16 items-center gap-1 p-1 md:min-h-28 md:items-stretch md:gap-1.5 md:p-2.5",
  week: "min-h-0 items-stretch gap-2 p-3 md:min-h-72 md:gap-1.5 md:p-2.5",
};

const NUMBER_SIZE: Record<CalendarViewMode, string> = {
  month: "size-6 text-xs md:size-7 md:text-sm",
  week: "size-7 text-sm",
};

const TOP_ROW: Record<CalendarViewMode, string> = {
  month: "justify-center md:justify-between",
  week: "justify-between",
};

const BADGE_VISIBILITY: Record<CalendarViewMode, string> = {
  month: "hidden md:grid",
  week: "grid",
};

const BODY_VISIBILITY: Record<CalendarViewMode, string> = {
  month: "hidden md:flex",
  week: "flex",
};

const LABEL_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
});

export function DayCell({
  date,
  variant,
  isToday,
  isSelected,
  isOutsideMonth,
  reservations,
  onSelect,
}: DayCellProps) {
  const isWeek = variant === "week";
  const total = reservations.length;
  const visible = reservations.slice(0, PREVIEW_LIMIT[variant]);
  const hidden = total - visible.length;

  const tone = isSelected
    ? "border-secondary bg-secondary text-primary"
    : "border-tertiary/20 bg-white/70 text-secondary hover:bg-quaternary/25";

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      aria-pressed={isSelected}
      aria-current={isToday ? "date" : undefined}
      aria-label={`${LABEL_FORMATTER.format(date)}, ${total} ${
        total === 1 ? "reserva" : "reservas"
      }`}
      className={`flex w-full cursor-pointer flex-col rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary md:rounded-2xl ${
        LAYOUT[variant]
      } ${tone} ${isOutsideMonth && !isSelected ? "opacity-50" : ""}`}
    >
      <span className={`flex items-start ${TOP_ROW[variant]}`}>
        <span className="flex items-center gap-2">
          <span
            className={`grid place-items-center rounded-full font-sans ${
              NUMBER_SIZE[variant]
            } ${isToday ? "bg-tertiary font-semibold text-secondary" : ""}`}
          >
            {date.getDate()}
          </span>

          {isWeek && (
            <span className="font-sans text-sm capitalize md:hidden">
              {WEEKDAY_FORMATTER.format(date)}
            </span>
          )}
        </span>

        {total > 0 && (
          <span
            className={`size-6 place-items-center rounded-full border font-sans text-[11px] ${
              BADGE_VISIBILITY[variant]
            } ${isSelected ? "border-primary/30" : "border-tertiary/40"}`}
          >
            {total}
          </span>
        )}
      </span>

      {!isWeek && <DayCellDots total={total} isSelected={isSelected} />}

      <span className={`flex-col gap-1 ${BODY_VISIBILITY[variant]}`}>
        {visible.map((reservation) => (
          <DayCellReservation
            key={reservation.id}
            reservation={reservation}
            isOnSelectedDay={isSelected}
          />
        ))}

        {hidden > 0 && (
          <span className="px-1 font-sans text-[11px] opacity-60">
            + {hidden} más
          </span>
        )}

        {total === 0 && !isOutsideMonth && (
          <span className="px-1 font-sans text-[11px] italic opacity-40">
            Sin reservas
          </span>
        )}
      </span>
    </button>
  );
}
