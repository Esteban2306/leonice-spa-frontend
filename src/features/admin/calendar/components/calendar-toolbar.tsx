import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import type { CalendarViewMode } from "../types/calendar.types";

interface CalendarToolbarProps {
  currentMonth: Date;
  viewMode: CalendarViewMode;
  activeFilters: string[];

  onToday: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

export function CalendarToolbar({
  currentMonth,
  viewMode,
  activeFilters,
  onToday,
  onPreviousMonth,
  onNextMonth,
  onViewModeChange,
  onToggleFilter,
  onClearFilters,
}: CalendarToolbarProps) {
  const monthLabel = MONTH_FORMATTER.format(currentMonth);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#BF9250]">
            Panel administrativo
          </p>

          <h1 className="text-4xl text-[#062112]">Calendario</h1>

          <p className="mt-2 text-sm text-[#062112]/60">
            Gestiona las citas confirmadas y la agenda del spa.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-[#062112] px-5 text-sm text-[#F2EBDB] transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Nueva reserva
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-md border border-[#062112]/15 bg-white p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("month")}
            className={`rounded-sm px-4 py-2 text-sm transition-colors ${
              viewMode === "month"
                ? "bg-[#062112] text-[#F2EBDB]"
                : "text-[#062112]/65 hover:bg-[#062112]/5"
            }`}
          >
            Mes
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("week")}
            className={`rounded-sm px-4 py-2 text-sm transition-colors ${
              viewMode === "week"
                ? "bg-[#062112] text-[#F2EBDB]"
                : "text-[#062112]/65 hover:bg-[#062112]/5"
            }`}
          >
            Semana
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className="rounded-md border border-[#062112]/15 bg-white px-4 py-2 text-sm text-[#062112] hover:bg-[#062112]/5"
          >
            Hoy
          </button>

          <button
            type="button"
            onClick={onPreviousMonth}
            aria-label="Mes anterior"
            className="grid size-9 place-items-center rounded-md border border-[#062112]/15 bg-white text-[#062112] hover:bg-[#062112]/5"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="min-w-36 text-center text-sm capitalize text-[#062112]">
            {monthLabel}
          </div>

          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Mes siguiente"
            className="grid size-9 place-items-center rounded-md border border-[#062112]/15 bg-white text-[#062112] hover:bg-[#062112]/5"
          >
            <ChevronRight className="size-4" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-[#062112]/15 bg-white px-4 py-2 text-sm text-[#062112] hover:bg-[#062112]/5"
          >
            <SlidersHorizontal className="size-4" />
            Filtrar · {activeFilters.length}
          </button>

          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-sm text-[#062112]/55 underline underline-offset-4"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onToggleFilter(filter)}
            className="rounded-full bg-[#062112] px-4 py-2 text-xs text-[#F2EBDB]"
          >
            {filter}
            <span className="ml-2">×</span>
          </button>
        ))}

        {activeFilters.length === 0 && (
          <div className="inline-flex items-center gap-2 text-xs text-[#062112]/55">
            <ListFilter className="size-3.5" />
            Sin filtros activos
          </div>
        )}

        <span className="ml-2 text-xs text-[#062112]/50">
          Solo agenda operativa real
        </span>
      </div>
    </div>
  );
}
