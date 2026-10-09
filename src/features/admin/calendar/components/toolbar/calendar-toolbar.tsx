import type {
  CalendarFilter,
  CalendarViewMode,
  ScheduleActionHandlers,
} from "../../types/calendar.types";
import { ActiveFilterChips } from "./active-filter-chips";
import { FilterMenu } from "./filter-menu";
import { PeriodNavigator } from "./period-navigator";
import { Plus } from "lucide-react";

import { BookingBanner } from "../booking/booking-banner";
import type { BookingSetup } from "../../types/calendar.types";
import { ScheduleActions } from "./schedule-actions";
import { ToolbarButton } from "./toolbar-button";
import { SearchField } from "./search-field";
import { ToolbarHeader } from "./toolbar-header";
import { ToolbarMobilePanel } from "./toolbar-mobile-panel";
import { ViewModeSwitch } from "./view-mode-switch";

interface CalendarToolbarProps extends ScheduleActionHandlers {
  viewMode: CalendarViewMode;
  periodLabel: string;
  availableFilters: readonly CalendarFilter[];
  activeFilterIds: readonly string[];
  searchQuery: string;
  booking: BookingSetup | null;
  isBookingLoading: boolean;

  onCreateReservation: () => void;
  onChangeBookingServices: () => void;
  onExitBooking: () => void;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToggleFilter: (filterId: string) => void;
  onClearFilters: () => void;
  onSearchChange: (query: string) => void;
}

export function CalendarToolbar({
  viewMode,
  periodLabel,
  availableFilters,
  activeFilterIds,
  searchQuery,
  booking,
  isBookingLoading,
  onCreateReservation,
  onChangeBookingServices,
  onExitBooking,
  onToday,
  onPrevious,
  onNext,
  onViewModeChange,
  onToggleFilter,
  onClearFilters,
  onSearchChange,
  onBlockDay,
  onBlockHours,
  onOpenExtraHours,
  onEditWeeklySchedule,
}: CalendarToolbarProps) {
  const activeFilters = availableFilters.filter((filter) =>
    activeFilterIds.includes(filter.id),
  );

  const filterMenu = (
    <FilterMenu
      availableFilters={availableFilters}
      activeFilterIds={activeFilterIds}
      onToggleFilter={onToggleFilter}
    />
  );

  const chips = (
    <ActiveFilterChips
      activeFilters={activeFilters}
      onToggleFilter={onToggleFilter}
      onClearFilters={onClearFilters}
    />
  );

  const scheduleActions = (
    <ScheduleActions
      onBlockDay={onBlockDay}
      onBlockHours={onBlockHours}
      onOpenExtraHours={onOpenExtraHours}
      onEditWeeklySchedule={onEditWeeklySchedule}
    />
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {booking ? (
        <BookingBanner
          booking={booking}
          isLoading={isBookingLoading}
          onChangeServices={onChangeBookingServices}
          onExit={onExitBooking}
        />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <ToolbarHeader onCreateReservation={onCreateReservation} />
          <div className="flex items-center gap-2">
            <SearchField value={searchQuery} onChange={onSearchChange} />
            <ToolbarButton
              icon={Plus}
              variant="solid"
              onClick={onCreateReservation}
              className="hidden shrink-0 sm:inline-flex"
            >
              Nueva reserva
            </ToolbarButton>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ViewModeSwitch
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        <PeriodNavigator
          periodLabel={periodLabel}
          onToday={onToday}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>

      {!booking && (
        <>
          <div className="flex flex-col gap-3 md:hidden">
            <ToolbarMobilePanel
              activeCount={activeFilterIds.length + (searchQuery ? 1 : 0)}
            >
              {filterMenu}
              {scheduleActions}
            </ToolbarMobilePanel>

            {chips}
          </div>

          <div className="hidden flex-wrap items-start justify-between gap-3 md:flex">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              {filterMenu}
              {chips}
            </div>

            {scheduleActions}
          </div>
        </>
      )}
    </div>
  );
}
