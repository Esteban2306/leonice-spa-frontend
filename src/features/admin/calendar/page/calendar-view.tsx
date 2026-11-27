import { useState } from "react";

import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import type { ScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";
import type { Category } from "@/src/features/admin/types/categories.types";
import type { ScheduleDay } from "@/src/features/admin/types/schedule.types";

import { CalendarSurface } from "../components/calendar-surface";
import { DayStrip } from "../components/day-strip";
import { DayDetailPanel } from "../components/day-panel/day-detail-panel";
import { CalendarGrid } from "../components/grid/calendar-grid";
import { ScheduleExceptionDialog } from "../components/schedule/schedule-exception-dialog";
import { DayHoursDialog } from "../components/schedule/day-hours-dialog";
import {
  WeeklyScheduleDialog,
  type CalendarScheduleDialog,
} from "../components/schedule/weekly-schedule-dialog";
import { CalendarToolbar } from "../components/toolbar/calendar-toolbar";
import { BookingPanel } from "../components/booking/booking-panel";
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
  hasData: boolean;
  onCollapseMonth: () => void;
  onRetry: () => void;

  selectedDayReservations: readonly CalendarReservation[];
  selectedDayHidden: readonly CalendarReservation[];
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
  onCreateReservation: () => void;
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
  hasData,
  onCollapseMonth,
  onRetry,
  selectedDayReservations,
  selectedDayHidden,
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
  onCreateReservation,
}: CalendarViewProps) {
  const activeBooking = booking.booking;
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  // Al reagendar hace falta el mes para ver qué días tienen cupo.
  const isSurfaceShown = isMonthOpen || activeBooking !== null;

  return (
    <div className="grid h-auto min-h-0 grid-cols-1 content-start gap-3 p-2 sm:p-4 md:gap-4 xl:h-full xl:grid-cols-[minmax(0,1fr)_380px] xl:content-stretch">
      {!activeBooking && (
        <DayStrip
          selectedDate={selectedDate}
          todayKey={todayKey}
          reservationsByDate={reservationsByDate}
          isMonthOpen={isMonthOpen}
          onSelectDate={(date) => {
            setIsMonthOpen(false);
            onSelectDate(date);
          }}
          onToggleMonth={() => {
            if (isMonthOpen) onCollapseMonth();
            setIsMonthOpen(!isMonthOpen);
          }}
          isUnknown={!hasData}
          hasFilters={activeFilterIds.length > 0 || searchQuery !== ""}
          onClearFilters={onClearFilters}
          onCreateReservation={onCreateReservation}
        />
      )}

      <div className={isSurfaceShown ? "contents" : "hidden xl:contents"}>
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
            onCreateReservation={onCreateReservation}
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
            onEditDayHours={() => onScheduleDialogChange("day-hours")}
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
          onSelectDate={(date) => {
            setIsMonthOpen(false);
            onSelectDate(date);
          }}
        />
      </CalendarSurface>
      </div>

      {activeBooking ? (
        <BookingPanel
          key={`${activeBooking.mode}-${booking.slotIso ?? "none"}`}
          booking={activeBooking}
          date={selectedDate}
          day={booking.selectedDay}
          selectedSlotIso={booking.slotIso}
          isSubmitting={booking.isSubmitting}
          onSelectSlot={booking.selectSlot}
          onReschedule={(notify) => void booking.reschedule(notify)}
        />
      ) : (
        <DayDetailPanel
          date={selectedDate}
          todayKey={todayKey}
          nowMs={nowMs}
          reservations={selectedDayReservations}
          hiddenReservations={selectedDayHidden}
          isError={isError && !hasData}
          isOutdated={isError && hasData}
          isLoading={isLoading}
          onRetry={onRetry}
          selectedReservationId={selectedReservationId}
          scheduleDay={scheduleDay}
          isScheduleLoading={isScheduleDayLoading}
          isSavingSchedule={scheduleActions.isSaving}
          actions={reservationActions}
          onSelectReservation={onSelectReservation}
          onRemoveException={scheduleActions.removeException}
          onRemoveDayOverride={scheduleActions.removeDayOverride}
          onViewClient={onViewClient}
          onReschedule={onReschedule}
        />
      )}

      {scheduleDialog === "weekly" && (
        <WeeklyScheduleDialog
          actions={scheduleActions}
          onClose={() => onScheduleDialogChange(null)}
        />
      )}

      {scheduleDialog === "day-hours" && (
        <DayHoursDialog
          date={selectedDate}
          current={scheduleDay?.override ?? null}
          actions={scheduleActions}
          onClose={() => onScheduleDialogChange(null)}
        />
      )}

      {scheduleDialog &&
        scheduleDialog !== "weekly" &&
        scheduleDialog !== "day-hours" && (
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
