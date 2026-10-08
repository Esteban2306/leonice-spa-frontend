import type {
  CalendarFilter,
  CalendarViewMode,
  ScheduleActionHandlers,
} from "../../types/calendar.types";
import { ActiveFilterChips } from "./active-filter-chips";
import { FilterMenu } from "./filter-menu";
import { PeriodNavigator } from "./period-navigator";
import { ScheduleActions } from "./schedule-actions";
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
    />
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <ToolbarHeader />
        <SearchField value={searchQuery} onChange={onSearchChange} />
      </div>

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
    </div>
  );
}
