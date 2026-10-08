import { ListFilter, X } from "lucide-react";

import type { CalendarFilter } from "../../types/calendar.types";
import { ToolbarButton } from "./toolbar-button";

interface ActiveFilterChipsProps {
  activeFilters: readonly CalendarFilter[];
  onToggleFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

export function ActiveFilterChips({
  activeFilters,
  onToggleFilter,
  onClearFilters,
}: ActiveFilterChipsProps) {
  if (activeFilters.length === 0) {
    return (
      <span className="inline-flex items-center gap-2 font-sans text-xs text-secondary/55">
        <ListFilter className="size-3.5" />
        Sin filtros activos
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onToggleFilter(filter.id)}
          aria-label={`Quitar filtro ${filter.label}`}
          className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full bg-secondary px-3 font-sans text-xs text-primary transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          {filter.label}
          <X className="size-3" strokeWidth={2} />
        </button>
      ))}

      <ToolbarButton
        variant="ghost"
        onClick={onClearFilters}
        className="h-8 px-3 text-xs underline underline-offset-4"
      >
        Limpiar filtros
      </ToolbarButton>
    </div>
  );
}
