import { Check, SlidersHorizontal } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

import type {
  CalendarFilter,
  CalendarFilterGroup,
} from "../../types/calendar.types";
import { toolbarButtonClass } from "./toolbar-button";

interface FilterMenuProps {
  availableFilters: readonly CalendarFilter[];
  activeFilterIds: readonly string[];
  onToggleFilter: (filterId: string) => void;
}

const GROUPS: ReadonlyArray<{ id: CalendarFilterGroup; label: string }> = [
  { id: "status", label: "Estado" },
  { id: "category", label: "Categoría" },
];

export function FilterMenu({
  availableFilters,
  activeFilterIds,
  onToggleFilter,
}: FilterMenuProps) {
  const activeCount = activeFilterIds.length;

  return (
    <Popover>
      <PopoverTrigger className={toolbarButtonClass("outline")}>
        <SlidersHorizontal className="size-4" strokeWidth={1.8} />
        Filtrar{activeCount > 0 ? ` · ${activeCount}` : ""}
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-64 rounded-2xl border border-tertiary/30 bg-primary p-2"
      >
        {GROUPS.map((group) => (
          <div key={group.id} className="py-1">
            <p className="px-2 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-secondary/45">
              {group.label}
            </p>

            {availableFilters
              .filter((filter) => filter.group === group.id)
              .map((filter) => {
                const isActive = activeFilterIds.includes(filter.id);

                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onToggleFilter(filter.id)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2 py-2 text-left font-sans text-sm text-secondary transition-colors hover:bg-quaternary/35"
                  >
                    {filter.label}
                    {isActive && (
                      <Check
                        className="size-4 text-secondary"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
