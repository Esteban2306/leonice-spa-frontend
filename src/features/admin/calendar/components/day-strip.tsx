import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { addDays, getWeekDays, toDateKey } from "../lib/calendar-dates";
import type { CalendarReservation } from "../types/calendar.types";

interface DayStripProps {
  selectedDate: Date;
  todayKey: string;
  reservationsByDate: Readonly<Record<string, readonly CalendarReservation[]>>;
  isMonthOpen: boolean;
  /** Sin datos cargados no se puede decir cuántas citas hay. */
  isUnknown: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
  onSelectDate: (date: Date) => void;
  onToggleMonth: () => void;
  onCreateReservation: () => void;
}

const weekdayFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
});
const monthFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});
const fullFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const ROUND_BUTTON =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-secondary/20 bg-white text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

/** En pantallas angostas la semana queda arriba y las citas del día debajo. */
export function DayStrip({
  selectedDate,
  todayKey,
  reservationsByDate,
  isMonthOpen,
  isUnknown,
  hasFilters,
  onClearFilters,
  onSelectDate,
  onToggleMonth,
  onCreateReservation,
}: DayStripProps) {
  const selectedKey = toDateKey(selectedDate);
  const month = monthFormatter.format(selectedDate);

  return (
    <section
      aria-label="Semana"
      className="flex flex-col gap-3 rounded-3xl border border-tertiary/30 bg-[#FCF6EB] p-3 xl:hidden"
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Semana anterior"
          onClick={() => onSelectDate(addDays(selectedDate, -7))}
          className={ROUND_BUTTON}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <p className="font-sans text-base font-bold text-secondary">
          {month.charAt(0).toUpperCase() + month.slice(1)}
        </p>
        <button
          type="button"
          aria-label="Semana siguiente"
          onClick={() => onSelectDate(addDays(selectedDate, 7))}
          className={ROUND_BUTTON}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getWeekDays(selectedDate).map((date) => {
          const key = toDateKey(date);
          const isSelected = key === selectedKey;
          const total = reservationsByDate[key]?.length ?? 0;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isSelected}
              aria-current={key === todayKey ? "date" : undefined}
              aria-label={
                isUnknown
                  ? fullFormatter.format(date)
                  : `${fullFormatter.format(date)}, ${total === 1 ? "1 cita" : `${total} citas`}`
              }
              onClick={() => onSelectDate(date)}
              className={`flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-2xl border font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                isSelected
                  ? "border-secondary bg-secondary text-primary"
                  : key === todayKey
                    ? "border-tertiary bg-quaternary/30 text-secondary"
                    : "border-secondary/15 bg-white text-secondary"
              }`}
            >
              <span className="text-xs">
                {weekdayFormatter.format(date).replace(".", "")}
              </span>
              <span className="text-lg font-bold">{date.getDate()}</span>
              <span className="h-4 text-xs">{total > 0 ? total : ""}</span>
            </button>
          );
        })}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="min-h-11 cursor-pointer rounded-xl border border-amber-300 bg-amber-50 px-3 font-sans text-sm text-amber-950"
        >
          Estás viendo solo una parte · <strong>Quitar filtros</strong>
        </button>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-expanded={isMonthOpen}
          onClick={onToggleMonth}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-secondary/25 bg-white font-sans text-sm text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          {isMonthOpen ? "Ocultar el mes" : "Ver mes y filtros"}
        </button>
        <button
          type="button"
          onClick={onCreateReservation}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary font-sans text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva reserva
        </button>
      </div>
    </section>
  );
}
