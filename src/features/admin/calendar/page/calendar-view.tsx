import type {
  CalendarReservation,
  CalendarViewMode,
} from "../types/calendar.types";
import { CalendarGrid } from "../components/calendar-grid";
import { CalendarToolbar } from "../components/calendar-toolbar";
import { DayDetailPanel } from "../components/day-detail-panel";

interface CalendarViewProps {
  currentMonth: Date;
  selectedDate: Date;
  viewMode: CalendarViewMode;
  reservations: CalendarReservation[];
  selectedDayReservations: CalendarReservation[];
  activeFilters: string[];

  onSelectDate: (date: Date) => void;
  onToday: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (month: Date) => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
}

export function CalendarView({
  currentMonth,
  selectedDate,
  viewMode,
  reservations,
  selectedDayReservations,
  activeFilters,
  onSelectDate,
  onToday,
  onPreviousMonth,
  onNextMonth,
  onMonthChange,
  onViewModeChange,
  onToggleFilter,
  onClearFilters,
}: CalendarViewProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <CalendarToolbar
        currentMonth={currentMonth}
        viewMode={viewMode}
        activeFilters={activeFilters}
        onToday={onToday}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
        onViewModeChange={onViewModeChange}
        onToggleFilter={onToggleFilter}
        onClearFilters={onClearFilters}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] gap-4">
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          reservations={reservations}
          onSelectDate={onSelectDate}
          onMonthChange={onMonthChange}
        />

        <DayDetailPanel
          date={selectedDate}
          reservations={selectedDayReservations}
        />
      </div>
    </div>
  );
}
