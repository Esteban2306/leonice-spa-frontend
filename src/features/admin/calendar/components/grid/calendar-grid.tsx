import type {
  CalendarReservation,
  CalendarViewMode,
  DayScheduleSummary,
} from "../../types/calendar.types";
import { getVisibleDays, toDateKey } from "../../lib/calendar-dates";
import { CalendarLegend } from "./calendar-legend";
import { DayCell } from "./day-cell";
import { WeekdayHeader } from "./weekday-header";

interface CalendarGridProps {
  viewMode: CalendarViewMode;
  cursor: Date;
  today: Date;
  selectedDate: Date;
  reservationsByDate: Readonly<Record<string, readonly CalendarReservation[]>>;
  scheduleByDate: Readonly<Record<string, DayScheduleSummary>>;
  onSelectDate: (date: Date) => void;
}

const NO_RESERVATIONS: readonly CalendarReservation[] = [];

const GRID_LAYOUT: Record<CalendarViewMode, string> = {
  month: "grid grid-cols-7 gap-1 md:gap-2",
  week: "grid grid-cols-1 gap-2 md:grid-cols-7",
};

export function CalendarGrid({
  viewMode,
  cursor,
  today,
  selectedDate,
  reservationsByDate,
  scheduleByDate,
  onSelectDate,
}: CalendarGridProps) {
  const days = getVisibleDays(cursor, viewMode);

  const todayKey = toDateKey(today);
  const selectedKey = toDateKey(selectedDate);

  return (
    <div className="flex flex-col gap-3">
      <WeekdayHeader variant={viewMode} />

      <div className={GRID_LAYOUT[viewMode]}>
        {days.map((date) => {
          const key = toDateKey(date);

          return (
            <DayCell
              key={key}
              date={date}
              variant={viewMode}
              isToday={key === todayKey}
              isSelected={key === selectedKey}
              isOutsideMonth={
                viewMode === "month" && date.getMonth() !== cursor.getMonth()
              }
              reservations={reservationsByDate[key] ?? NO_RESERVATIONS}
              schedule={scheduleByDate[key] ?? null}
              onSelect={onSelectDate}
            />
          );
        })}
      </div>

      <CalendarLegend />
    </div>
  );
}
