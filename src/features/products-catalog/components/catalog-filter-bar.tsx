"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import type {
  CatalogFilters,
  CatalogResult,
  CatalogSort,
} from "@/src/features/products-catalog/api/catalog.types";
import { NeedChip } from "@/src/features/products-catalog/components/need-chip";
import { PriceRange } from "@/src/features/products-catalog/components/price-range";
import {
  activeFilterCount,
  SORT_OPTIONS,
  toggleTag,
} from "@/src/features/products-catalog/lib/catalog-filters";

const SEARCH_DELAY_MS = 280;

interface CatalogFilterBarProps {
  filters: CatalogFilters;
  facets: CatalogResult["facets"];
  total: number;
  loading: boolean;
  onChange: (next: CatalogFilters) => void;
  onReset: () => void;
}

export function CatalogFilterBar({
  filters,
  facets,
  total,
  loading,
  onChange,
  onReset,
}: CatalogFilterBarProps) {
  const [query, setQuery] = useState(filters.q);
  const [syncedQuery, setSyncedQuery] = useState(filters.q);
  const [showMore, setShowMore] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const active = activeFilterCount(filters);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      {
        rootMargin: "-90px 0px 0px 0px",
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (syncedQuery !== filters.q) {
    setSyncedQuery(filters.q);
    setQuery(filters.q);
  }

  useEffect(() => {
    if (query === filters.q) return;
    const timer = window.setTimeout(
      () => onChange({ ...filters, q: query }),
      SEARCH_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [query, filters, onChange]);

  const priceBounds =
    facets.price.minPesos !== null && facets.price.maxPesos !== null
      ? { min: facets.price.minPesos, max: facets.price.maxPesos }
      : null;

  const moreClass = showMore ? "flex" : stuck ? "hidden" : "hidden desk:flex";

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <div className="relative z-20 px-5 sm:px-8 desk:sticky desk:top-[5.25rem]">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#FDF8F1]/97 shadow-[0_calc(var(--sun-dy)*8px+12px)_32px_-18px_rgb(74_46_16/0.4)]">
          <div
            aria-hidden="true"
            data-loading={loading}
            className="catalog-progress absolute inset-x-0 top-0 h-[2px] bg-[#BF9250]"
          />
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative flex min-w-0 flex-1 basis-56 items-center">
                <span className="sr-only">Buscar productos</span>
                <Search
                  className="pointer-events-none absolute left-4 size-4 text-[#7a5a2c]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busca por nombre o necesidad"
                  className="h-11 w-full rounded-full border border-[#062112]/15 bg-white/70 pl-11 pr-4 font-sans text-[0.95rem] text-[#062112] placeholder:text-[#062112]/45 transition-[border-color,box-shadow] duration-300 focus:border-[#BF9250] focus:shadow-[0_0_0_4px_rgb(191_146_80/0.18)] focus:outline-none"
                />
              </label>

              <label className="flex items-center gap-2 font-sans text-sm text-[#062112]/70">
                <span className="hidden sm:inline">Ordenar</span>
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    onChange({
                      ...filters,
                      sort: event.target.value as CatalogSort,
                    })
                  }
                  className="h-11 cursor-pointer rounded-full border border-[#062112]/15 bg-white/70 px-4 font-sans text-sm font-bold text-[#062112] focus:border-[#BF9250] focus:outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                aria-expanded={showMore}
                aria-controls="catalog-more-filters"
                onClick={() => setShowMore((value) => !value)}
                className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#062112]/15 px-4 font-sans text-sm font-bold text-[#062112] transition-colors hover:border-[#062112]/50 ${
                  stuck ? "" : "desk:hidden"
                }`}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtros
                {active > 0 && (
                  <span className="grid size-6 place-items-center rounded-full bg-[#062112] text-xs text-[#E0BC87] tabular-nums">
                    {active}
                  </span>
                )}
              </button>

              <p
                className="ml-auto hidden font-sans text-sm text-[#062112]/60 tabular-nums desk:block"
                aria-live="polite"
              >
                {total} {total === 1 ? "producto" : "productos"}
              </p>
            </div>

            <div
              id="catalog-more-filters"
              className={`flex-col gap-4 desk:flex-row desk:items-center desk:justify-between ${moreClass}`}
            >
              {facets.tags.length > 0 && (
                <div
                  role="group"
                  aria-label="¿Qué necesita tu cabello?"
                  className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 desk:flex-wrap desk:overflow-visible desk:pb-0"
                >
                  {facets.tags.map((tag) => (
                    <NeedChip
                      key={tag.slug}
                      label={tag.name}
                      count={tag.count}
                      selected={filters.tags.includes(tag.slug)}
                      onToggle={() => onChange(toggleTag(filters, tag.slug))}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {facets.categories.length > 1 && (
                  <select
                    aria-label="Categoría"
                    value={filters.category ?? ""}
                    onChange={(event) =>
                      onChange({
                        ...filters,
                        category: event.target.value || null,
                      })
                    }
                    className="h-10 cursor-pointer rounded-full border border-[#062112]/15 bg-white/70 px-4 font-sans text-sm text-[#062112] focus:border-[#BF9250] focus:outline-none"
                  >
                    <option value="">Todas las categorías</option>
                    {facets.categories.map((category) => (
                      <option
                        key={category.slug}
                        value={category.slug}
                        disabled={category.count === 0}
                      >
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                )}
                {priceBounds && (
                  <PriceRange
                    key={`${filters.minPrice}-${filters.maxPrice}-${priceBounds.min}-${priceBounds.max}`}
                    bounds={priceBounds}
                    value={{ min: filters.minPrice, max: filters.maxPrice }}
                    onCommit={({ min, max }) =>
                      onChange({ ...filters, minPrice: min, maxPrice: max })
                    }
                  />
                )}
                {active > 0 && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 font-sans text-sm font-bold text-[#062112]/70 underline decoration-[#BF9250] decoration-2 underline-offset-[6px] transition-colors hover:text-[#062112]"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
