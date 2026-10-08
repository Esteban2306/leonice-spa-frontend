import { CalendarSurface } from "../components/calendar-surface";
import { CalendarGrid } from "../components/grid/calendar-grid";
import { DayDetailPanel } from "../components/day-panel/day-detail-panel";
import { CalendarToolbar } from "../components/toolbar/calendar-toolbar";
import type {
  CalendarFilter,
  CalendarReservation,
  CalendarViewMode,
  ReservationActionHandlers,
  ScheduleActionHandlers,
} from "../types/calendar.types";

interface CalendarViewProps
  extends ReservationActionHandlers, ScheduleActionHandlers {
  viewMode: CalendarViewMode;
  cursor: Date;
  today: Date;
  selectedDate: Date;
  periodLabel: string;

  availableFilters: readonly CalendarFilter[];
  activeFilterIds: readonly string[];

  reservationsByDate: Readonly<Record<string, readonly CalendarReservation[]>>;
  selectedDayReservations: readonly CalendarReservation[];
  selectedReservationId: string | null;

  onCreateReservation: () => void;
  onSelectDate: (date: Date) => void;
  onSelectReservation: (reservationId: string | null) => void;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToggleFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

export function CalendarView({
  viewMode,
  cursor,
  today,
  selectedDate,
  periodLabel,
  availableFilters,
  activeFilterIds,
  reservationsByDate,
  selectedDayReservations,
  selectedReservationId,
  onCreateReservation,
  onSelectDate,
  onSelectReservation,
  onToday,
  onPrevious,
  onNext,
  onViewModeChange,
  onToggleFilter,
  onClearFilters,
  onBlockDay,
  onBlockHours,
  onEditSchedule,
  onViewClient,
  onReschedule,
  onCancel,
}: CalendarViewProps) {
  return (
    <div className="grid h-auto min-h-0 grid-cols-1 gap-3 md:h-full md:gap-4 xl:grid-cols-[minmax(0,1fr)_360px] p-2 sm:p-4">
      {" "}
      <CalendarSurface
        toolbar={
          <CalendarToolbar
            viewMode={viewMode}
            periodLabel={periodLabel}
            availableFilters={availableFilters}
            activeFilterIds={activeFilterIds}
            onCreateReservation={onCreateReservation}
            onToday={onToday}
            onPrevious={onPrevious}
            onNext={onNext}
            onViewModeChange={onViewModeChange}
            onToggleFilter={onToggleFilter}
            onClearFilters={onClearFilters}
            onBlockDay={onBlockDay}
            onBlockHours={onBlockHours}
            onEditSchedule={onEditSchedule}
          />
        }
      >
        <CalendarGrid
          viewMode={viewMode}
          cursor={cursor}
          today={today}
          selectedDate={selectedDate}
          reservationsByDate={reservationsByDate}
          onSelectDate={onSelectDate}
        />
      </CalendarSurface>
      <DayDetailPanel
        date={selectedDate}
        reservations={selectedDayReservations}
        selectedReservationId={selectedReservationId}
        onSelectReservation={onSelectReservation}
        onViewClient={onViewClient}
        onReschedule={onReschedule}
        onCancel={onCancel}
      />
    </div>
  );
}
