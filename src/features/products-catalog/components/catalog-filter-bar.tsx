"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import type {
  CatalogFilters,
  CatalogResult,
  CatalogSort,
} from "@/src/features/products-catalog/api/catalog.types";
import { CatalogSearchField } from "@/src/features/products-catalog/components/catalog-search-field";
import { NeedChip } from "@/src/features/products-catalog/components/need-chip";
import { PriceRange } from "@/src/features/products-catalog/components/price-range";
import {
  activeFilterCount,
  SORT_OPTIONS,
  toggleTag,
} from "@/src/features/products-catalog/lib/catalog-filters";

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
  const [showMore, setShowMore] = useState(false);
  const [pinned, setPinned] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const active = activeFilterCount(filters);
  const commitQuery = useCallback(
    (q: string) => onChange({ ...filters, q }),
    [filters, onChange],
  );

  useEffect(() => {
    const node = barRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-88px 0px 0px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const backToFilters = () => {
    const node = barRef.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({
      top,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const priceBounds =
    facets.price.minPesos !== null && facets.price.maxPesos !== null
      ? { min: facets.price.minPesos, max: facets.price.maxPesos }
      : null;

  const moreClass = showMore ? "flex" : "hidden desk:flex";
  const sortSelect = (compact: boolean) => (
    <select
      aria-label="Ordenar"
      value={filters.sort}
      onChange={(event) =>
        onChange({ ...filters, sort: event.target.value as CatalogSort })
      }
      className={`cursor-pointer rounded-full border border-[#062112]/15 bg-white/70 px-4 font-sans text-sm font-bold text-[#062112] focus:border-[#BF9250] focus:outline-none ${
        compact ? "h-10" : "h-11"
      }`}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <AnimatePresence>
        {pinned && (
          <motion.div
            key="pinned"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[5.5rem] z-30 hidden px-5 sm:px-8 desk:block"
          >
            <div className="sun-glass relative mx-auto flex max-w-[1440px] items-center gap-3 overflow-hidden rounded-full border border-white/70 bg-[#FDF8F1]/97 py-2 pl-2 pr-3">
              <div
                aria-hidden="true"
                data-loading={loading}
                className="catalog-progress absolute inset-x-0 top-0 h-[2px] bg-[#BF9250]"
              />
              <CatalogSearchField
                value={filters.q}
                onCommit={commitQuery}
                compact
              />
              {sortSelect(true)}
              <button
                type="button"
                onClick={backToFilters}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#062112]/15 px-4 font-sans text-sm font-bold text-[#062112] transition-colors hover:border-[#062112]/50"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtros
                {active > 0 && (
                  <span className="grid size-6 place-items-center rounded-full bg-[#062112] text-xs text-[#E0BC87] tabular-nums">
                    {active}
                  </span>
                )}
              </button>
              <p className="shrink-0 font-sans text-sm text-[#062112]/70 tabular-nums">
                {total} {total === 1 ? "producto" : "productos"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={barRef} className="relative z-20 px-5 sm:px-8">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[1.75rem] sun-glass border border-white/70 bg-[#FDF8F1]/97">
          <div
            aria-hidden="true"
            data-loading={loading}
            className="catalog-progress absolute inset-x-0 top-0 h-[2px] bg-[#BF9250]"
          />
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <CatalogSearchField value={filters.q} onCommit={commitQuery} />

              <div className="flex items-center gap-2 font-sans text-sm text-[#062112]/70">
                <span aria-hidden="true" className="hidden sm:inline">
                  Ordenar
                </span>
                {sortSelect(false)}
              </div>

              <button
                type="button"
                aria-expanded={showMore}
                aria-controls="catalog-more-filters"
                onClick={() => setShowMore((value) => !value)}
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#062112]/15 px-4 font-sans text-sm font-bold text-[#062112] transition-colors hover:border-[#062112]/50 desk:hidden"
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
                className="ml-auto hidden font-sans text-sm text-[#062112]/70 tabular-nums desk:block"
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
