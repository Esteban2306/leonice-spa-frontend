"use client";

import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ChoicePills,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { CatalogStatus } from "@/src/features/admin/types/catalog.types";

import {
  SORT_OPTIONS,
  countActiveFilters,
  formatPesosInput,
  type CatalogFilters,
  type SortOption,
} from "../lib/catalog";

interface CatalogToolbarProps {
  filters: CatalogFilters;
  resultCount: number | null;
  isFetching: boolean;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: ReadonlyArray<{ value: CatalogStatus; label: string }> = [
  { value: "ACTIVE", label: "Activos" },
  { value: "INACTIVE", label: "Inactivos" },
  { value: "ALL", label: "Todos" },
];

type FlagKey =
  | "hasActivePromotion"
  | "hasHairVariablePricing"
  | "requiresPriorAssessment"
  | "withoutPrice";

const FLAGS: ReadonlyArray<{ key: FlagKey; label: string }> = [
  { key: "hasActivePromotion", label: "Con promoción vigente" },
  { key: "hasHairVariablePricing", label: "Precio por cabello" },
  { key: "requiresPriorAssessment", label: "Requiere valoración" },
  { key: "withoutPrice", label: "Sin precio publicado" },
];

const RANGE_INPUT = `${INPUT_CLASS} h-10 tabular-nums`;

export function CatalogToolbar({
  filters,
  resultCount,
  isFetching,
  onChange,
  onReset,
}: CatalogToolbarProps) {
  const activeCount = countActiveFilters(filters);
  const [isExpanded, setIsExpanded] = useState(activeCount > 1);

  return (
    <section
      aria-label="Buscar y filtrar servicios"
      className="flex flex-col gap-3 rounded-[2rem] border border-tertiary/25 bg-[#FCF6EB] p-3 sm:p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-secondary/70"
          />
          <input
            type="search"
            value={filters.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Buscar servicio por nombre"
            aria-label="Buscar servicio"
            className="h-12 w-full rounded-full border border-secondary/15 bg-white pr-10 pl-11 font-sans text-sm text-secondary outline-none placeholder:text-secondary/60 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {filters.q && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onChange({ q: "" })}
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5 hover:text-secondary"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-72">
            <ChoicePills<CatalogStatus>
              ariaLabel="Estado de los servicios"
              value={filters.status}
              options={STATUS_OPTIONS}
              onChange={(status) => onChange({ status })}
            />
          </div>

          <label className="sr-only" htmlFor="catalog-sort">
            Ordenar por
          </label>
          <div className="relative">
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(event) =>
                onChange({ sort: event.target.value as SortOption })
              }
              className="h-11 cursor-pointer appearance-none rounded-full pr-10 border border-secondary/15 bg-white px-4 font-sans text-sm text-secondary outline-none focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-secondary/70"
            />
          </div>

          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls="catalog-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
              isExpanded || activeCount > 0
                ? "border-secondary bg-secondary text-primary"
                : "border-secondary/15 bg-white text-secondary hover:bg-quaternary/25",
            )}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.8} />
            Filtros
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-quaternary font-sans text-[11px] font-semibold text-secondary tabular-nums">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          id="catalog-filters"
          className="grid grid-cols-1 gap-4 border-t border-tertiary/20 pt-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
              Características
            </legend>
            <div className="flex flex-wrap gap-2">
              {FLAGS.map((flag) => (
                <button
                  key={flag.key}
                  type="button"
                  aria-pressed={filters[flag.key]}
                  onClick={() => onChange({ [flag.key]: !filters[flag.key] })}
                  className={cn(
                    "h-9 cursor-pointer rounded-full border px-3 font-sans text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
                    filters[flag.key]
                      ? "border-tertiary bg-quaternary/45 text-secondary"
                      : "border-secondary/15 bg-white text-secondary/70 hover:bg-quaternary/20",
                  )}
                >
                  {flag.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
              Precio en pesos
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <input
                aria-label="Precio desde"
                inputMode="numeric"
                placeholder="Desde"
                value={filters.priceMinPesos}
                onChange={(event) =>
                  onChange({
                    priceMinPesos: formatPesosInput(event.target.value),
                  })
                }
                className={RANGE_INPUT}
              />
              <input
                aria-label="Precio hasta"
                inputMode="numeric"
                placeholder="Hasta"
                value={filters.priceMaxPesos}
                onChange={(event) =>
                  onChange({
                    priceMaxPesos: formatPesosInput(event.target.value),
                  })
                }
                className={RANGE_INPUT}
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
              Duración en minutos
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <input
                aria-label="Duración desde"
                inputMode="numeric"
                placeholder="Desde"
                value={filters.durationMin}
                onChange={(event) =>
                  onChange({ durationMin: event.target.value })
                }
                className={RANGE_INPUT}
              />
              <input
                aria-label="Duración hasta"
                inputMode="numeric"
                placeholder="Hasta"
                value={filters.durationMax}
                onChange={(event) =>
                  onChange({ durationMax: event.target.value })
                }
                className={RANGE_INPUT}
              />
            </div>
          </fieldset>

          <button
            type="button"
            onClick={onReset}
            disabled={
              activeCount === 0 && filters.q === "" && filters.sort === "name"
            }
            className="h-10 cursor-pointer rounded-full px-4 font-sans text-sm text-secondary/70 underline-offset-4 transition-colors hover:text-secondary hover:underline disabled:cursor-not-allowed disabled:opacity-40"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <p
        aria-live="polite"
        className="px-2 font-sans text-xs text-secondary/70"
      >
        {resultCount === null
          ? "Cargando servicios…"
          : `${resultCount} ${resultCount === 1 ? "servicio" : "servicios"}${isFetching ? " · actualizando…" : ""}`}
      </p>
    </section>
  );
}
