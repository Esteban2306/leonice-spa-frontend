import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import type { ScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";
import type { Category } from "@/src/features/admin/types/categories.types";
import type { ScheduleDay } from "@/src/features/admin/types/schedule.types";

import { CalendarSurface } from "../components/calendar-surface";
import { DayDetailPanel } from "../components/day-panel/day-detail-panel";
import { CalendarGrid } from "../components/grid/calendar-grid";
import { ScheduleExceptionDialog } from "../components/schedule/schedule-exception-dialog";
import {
  WeeklyScheduleDialog,
  type CalendarScheduleDialog,
} from "../components/schedule/weekly-schedule-dialog";
import { CalendarToolbar } from "../components/toolbar/calendar-toolbar";
import { BookingPanel } from "../components/booking/booking-panel";
import { BookingSetupDialog } from "../components/booking/booking-setup-dialog";
import type { CalendarBooking } from "./use-calendar-booking";
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

  scheduleDialog: CalendarScheduleDialog | null;
  reservationActions: ReservationActions;
  scheduleActions: ScheduleActions;

  onScheduleDialogChange: (mode: CalendarScheduleDialog | null) => void;
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
  onReschedule: (reservationId: string) => void;
  booking: CalendarBooking;
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
  onReschedule,
  booking,
}: CalendarViewProps) {
  const activeBooking = booking.booking;

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
            booking={activeBooking}
            isBookingLoading={booking.isAvailabilityLoading}
            onCreateReservation={booking.openSetup}
            onChangeBookingServices={booking.openSetup}
            onExitBooking={booking.exit}
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
            onEditWeeklySchedule={() => onScheduleDialogChange("weekly")}
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
          booking={
            activeBooking
              ? {
                  availabilityByDate: booking.availabilityByDate,
                  isLoading: booking.isAvailabilityLoading,
                }
              : null
          }
          onSelectDate={onSelectDate}
        />
      </CalendarSurface>

      {activeBooking ? (
        <BookingPanel
          key={`${activeBooking.mode}-${booking.slotIso ?? "none"}`}
          booking={activeBooking}
          date={selectedDate}
          day={booking.selectedDay}
          selectedSlotIso={booking.slotIso}
          clientSearch={booking.clientSearch}
          isSubmitting={booking.isSubmitting}
          onSelectSlot={booking.selectSlot}
          onCreate={(client, values) => void booking.create(client, values)}
          onReschedule={(notify) => void booking.reschedule(notify)}
        />
      ) : (
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
          onReschedule={onReschedule}
        />
      )}

      {booking.isSetupOpen && (
        <BookingSetupDialog
          categories={categories}
          treatments={booking.treatments}
          isLoadingCatalog={booking.isCatalogLoading}
          client={booking.presetClient}
          onClose={booking.closeSetup}
          onConfirm={booking.startCreate}
        />
      )}

      {scheduleDialog === "weekly" && (
        <WeeklyScheduleDialog
          actions={scheduleActions}
          onClose={() => onScheduleDialogChange(null)}
        />
      )}

      {scheduleDialog && scheduleDialog !== "weekly" && (
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
