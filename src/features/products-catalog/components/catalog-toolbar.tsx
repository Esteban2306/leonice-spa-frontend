"use client";

import { SlidersHorizontal } from "lucide-react";

import type {
  CatalogFilters,
  CatalogSort,
} from "@/src/features/products-catalog/api/catalog.types";
import { CatalogSearchField } from "@/src/features/products-catalog/components/catalog-search-field";
import { FilterSelect } from "@/src/features/products-catalog/components/filter-select";
import {
  activeFilterCount,
  SORT_OPTIONS,
} from "@/src/features/products-catalog/lib/catalog-filters";

interface CatalogToolbarProps {
  filters: CatalogFilters;
  total: number;
  onChange: (next: CatalogFilters) => void;
  onOpenFilters: () => void;
}

export function CatalogToolbar({
  filters,
  total,
  onChange,
  onOpenFilters,
}: CatalogToolbarProps) {
  const active = activeFilterCount(filters);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="desk:hidden">
        <CatalogSearchField
          value={filters.q}
          onCommit={(q) => onChange({ ...filters, q })}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="font-sans text-sm text-[#062112]/70 tabular-nums"
          aria-live="polite"
        >
          <span className="font-bold text-[#062112]">{total}</span>{" "}
          {total === 1 ? "producto" : "productos"}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#062112]/15 bg-white/70 px-4 font-sans text-sm font-bold text-[#062112] transition-colors hover:border-[#062112]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250] desk:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros
            {active > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-[#062112] text-[0.68rem] text-[#E0BC87] tabular-nums">
                {active}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 font-sans text-sm text-[#062112]/70">
            <span aria-hidden="true" className="hidden sm:inline">
              Ordenar
            </span>
            <FilterSelect
              label="Ordenar"
              value={filters.sort}
              options={SORT_OPTIONS}
              onChange={(sort) =>
                onChange({ ...filters, sort: sort as CatalogSort })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
