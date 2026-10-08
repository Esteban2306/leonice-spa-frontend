import type {
  CalendarFilter,
  CalendarViewMode,
  ScheduleActionHandlers,
} from "../../types/calendar.types";
import { ActiveFilterChips } from "./active-filter-chips";
import { FilterMenu } from "./filter-menu";
import { PeriodNavigator } from "./period-navigator";
import { ScheduleActions } from "./schedule-actions";
import { ToolbarHeader } from "./toolbar-header";
import { ToolbarMobilePanel } from "./toolbar-mobile-panel";
import { ViewModeSwitch } from "./view-mode-switch";

interface CalendarToolbarProps extends ScheduleActionHandlers {
  viewMode: CalendarViewMode;
  periodLabel: string;
  availableFilters: readonly CalendarFilter[];
  activeFilterIds: readonly string[];

  onCreateReservation: () => void;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToggleFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

export function CalendarToolbar({
  viewMode,
  periodLabel,
  availableFilters,
  activeFilterIds,
  onCreateReservation,
  onToday,
  onPrevious,
  onNext,
  onViewModeChange,
  onToggleFilter,
  onClearFilters,
  onBlockDay,
  onBlockHours,
  onEditSchedule,
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
      onEditSchedule={onEditSchedule}
    />
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <ToolbarHeader onCreateReservation={onCreateReservation} />

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

      <div className="flex flex-col gap-3 md:hidden">
        <ToolbarMobilePanel activeCount={activeFilterIds.length}>
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
    </div>
  );
}
