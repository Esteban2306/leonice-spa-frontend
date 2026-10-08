import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import type { ScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";
import type { Category } from "@/src/features/admin/types/categories.types";
import type { ScheduleDay } from "@/src/features/admin/types/schedule.types";

import { CalendarSurface } from "../components/calendar-surface";
import { DayDetailPanel } from "../components/day-panel/day-detail-panel";
import { CalendarGrid } from "../components/grid/calendar-grid";
import {
  ScheduleExceptionDialog,
  type ScheduleDialogMode,
} from "../components/schedule/schedule-exception-dialog";
import { CalendarToolbar } from "../components/toolbar/calendar-toolbar";
import type {
  CalendarFilter,
  CalendarReservation,
  CalendarViewMode,
  DayScheduleSummary,
} from "../types/calendar.types";

interface CalendarViewProps {
  viewMode: CalendarViewMode;
  cursor: Date;
  today: Date;
  todayKey: string;
  nowMs: number;
  selectedDate: Date;
  periodLabel: string;

  availableFilters: readonly CalendarFilter[];
  activeFilterIds: readonly string[];
  searchQuery: string;

  reservationsByDate: Readonly<Record<string, readonly CalendarReservation[]>>;
  scheduleByDate: Readonly<Record<string, DayScheduleSummary>>;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;

  selectedDayReservations: readonly CalendarReservation[];
  selectedReservationId: string | null;
  scheduleDay: ScheduleDay | null;
  isScheduleDayLoading: boolean;
  categories: readonly Category[];

  scheduleDialog: ScheduleDialogMode | null;
  reservationActions: ReservationActions;
  scheduleActions: ScheduleActions;

  onScheduleDialogChange: (mode: ScheduleDialogMode | null) => void;
  onSelectDate: (date: Date) => void;
  onSelectReservation: (reservationId: string | null) => void;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToggleFilter: (filterId: string) => void;
  onClearFilters: () => void;
  onSearchChange: (query: string) => void;
  onViewClient: (clientId: string) => void;
}

export function CalendarView({
  viewMode,
  cursor,
  today,
  todayKey,
  nowMs,
  selectedDate,
  periodLabel,
  availableFilters,
  activeFilterIds,
  searchQuery,
  reservationsByDate,
  scheduleByDate,
  isLoading,
  isError,
  onRetry,
  selectedDayReservations,
  selectedReservationId,
  scheduleDay,
  isScheduleDayLoading,
  categories,
  scheduleDialog,
  reservationActions,
  scheduleActions,
  onScheduleDialogChange,
  onSelectDate,
  onSelectReservation,
  onToday,
  onPrevious,
  onNext,
  onViewModeChange,
  onToggleFilter,
  onClearFilters,
  onSearchChange,
  onViewClient,
}: CalendarViewProps) {
  return (
    <div className="grid h-auto min-h-0 grid-cols-1 gap-3 p-2 sm:p-4 md:h-full md:gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <CalendarSurface
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        toolbar={
          <CalendarToolbar
            viewMode={viewMode}
            periodLabel={periodLabel}
            availableFilters={availableFilters}
            activeFilterIds={activeFilterIds}
            searchQuery={searchQuery}
            onToday={onToday}
            onPrevious={onPrevious}
            onNext={onNext}
            onViewModeChange={onViewModeChange}
            onToggleFilter={onToggleFilter}
            onClearFilters={onClearFilters}
            onSearchChange={onSearchChange}
            onBlockDay={() => onScheduleDialogChange("block-day")}
            onBlockHours={() => onScheduleDialogChange("block-hours")}
            onOpenExtraHours={() => onScheduleDialogChange("open-hours")}
          />
        }
      >
        <CalendarGrid
          viewMode={viewMode}
          cursor={cursor}
          today={today}
          selectedDate={selectedDate}
          reservationsByDate={reservationsByDate}
          scheduleByDate={scheduleByDate}
          onSelectDate={onSelectDate}
        />
      </CalendarSurface>

      <DayDetailPanel
        date={selectedDate}
        todayKey={todayKey}
        nowMs={nowMs}
        reservations={selectedDayReservations}
        selectedReservationId={selectedReservationId}
        scheduleDay={scheduleDay}
        isScheduleLoading={isScheduleDayLoading}
        isSavingSchedule={scheduleActions.isSaving}
        actions={reservationActions}
        onSelectReservation={onSelectReservation}
        onRemoveException={scheduleActions.removeException}
        onViewClient={onViewClient}
      />

      {scheduleDialog && (
        <ScheduleExceptionDialog
          mode={scheduleDialog}
          date={selectedDate}
          categories={categories}
          actions={scheduleActions}
          onClose={() => onScheduleDialogChange(null)}
        />
      )}
    </div>
  );
}
