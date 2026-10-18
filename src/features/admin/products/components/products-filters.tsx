"use client";

import {
  ChevronDown,
  CircleOff,
  ImageOff,
  PackageCheck,
  PackageOpen,
  Search,
  X,
} from "lucide-react";

import { KpiButton } from "@/src/features/admin/components/kpi-button";
import { ChoicePills } from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminProductCategory,
  ProductStatusFilter,
} from "@/src/features/admin/types/products.types";

import type { ProductFilters, ProductTotals } from "../lib/product-catalog";

const STATUS_OPTIONS: ReadonlyArray<{
  value: ProductStatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "Todos" },
  { value: "ACTIVE", label: "A la venta" },
  { value: "INACTIVE", label: "Desactivados" },
];

interface ProductsKpisProps {
  totals: ProductTotals;
  filters: ProductFilters;
  onApply: (patch: Partial<ProductFilters>) => void;
}

export function ProductsKpis({ totals, filters, onApply }: ProductsKpisProps) {
  return (
    <section
      aria-label="Resumen de productos"
      className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4 [&>*]:w-40 [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-auto"
    >
      <KpiButton
        numericFont
        icon={PackageCheck}
        tone="dark"
        value={String(totals.active)}
        label="A la venta"
        hint="Se muestran en la web"
        isActive={filters.status === "ACTIVE" && filters.quick === "all"}
        onClick={() => onApply({ status: "ACTIVE", quick: "all" })}
      />
      <KpiButton
        numericFont
        icon={ImageOff}
        tone={totals.missingPhoto > 0 ? "gold" : "light"}
        value={String(totals.missingPhoto)}
        label="Sin foto"
        hint="Alguna variante sin imagen"
        isActive={filters.quick === "missingPhoto"}
        onClick={() => onApply({ status: "ACTIVE", quick: "missingPhoto" })}
      />
      <KpiButton
        numericFont
        icon={PackageOpen}
        tone={totals.noVariants > 0 ? "gold" : "light"}
        value={String(totals.noVariants)}
        label="Sin variantes"
        hint="No tienen precio para mostrar"
        isActive={filters.quick === "noVariants"}
        onClick={() => onApply({ status: "ACTIVE", quick: "noVariants" })}
      />
      <KpiButton
        numericFont
        icon={CircleOff}
        value={String(totals.inactive)}
        label="Desactivados"
        hint="Ocultos de la web, con su historial"
        isActive={filters.status === "INACTIVE" && filters.quick === "all"}
        onClick={() => onApply({ status: "INACTIVE", quick: "all" })}
      />
    </section>
  );
}

interface ProductsToolbarProps {
  filters: ProductFilters;
  categories: readonly AdminProductCategory[];
  resultCount: number | null;
  hasFilters: boolean;
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
}

export function ProductsToolbar({
  filters,
  categories,
  resultCount,
  hasFilters,
  onChange,
  onReset,
}: ProductsToolbarProps) {
  return (
    <section
      aria-label="Buscar y filtrar productos"
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
            placeholder="Buscar producto o marca"
            aria-label="Buscar producto"
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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="products-category">
            Categoría
          </label>
          <div className="relative">
            <select
              id="products-category"
              value={filters.productCategoryId}
              onChange={(event) =>
                onChange({ productCategoryId: event.target.value })
              }
              className="h-11 w-full cursor-pointer appearance-none rounded-full border border-secondary/15 bg-white pr-10 pl-4 font-sans text-sm text-secondary outline-none focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40 sm:w-52"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  {category.isActive ? "" : " (inactiva)"}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-secondary/70"
            />
          </div>
          <div className="w-full sm:w-80">
            <ChoicePills<ProductStatusFilter>
              ariaLabel="Estado de los productos"
              value={filters.status}
              options={STATUS_OPTIONS}
              onChange={(status) => onChange({ status })}
            />
          </div>
        </div>
      </div>

      {(hasFilters || resultCount !== null) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 font-sans text-sm text-secondary/65">
          <span aria-live="polite">
            {resultCount === null
              ? "Buscando…"
              : resultCount === 1
                ? "1 producto"
                : `${resultCount} productos`}
            {filters.quick === "missingPhoto" && " a los que les falta foto"}
            {filters.quick === "noVariants" && " sin variantes"}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer rounded-full px-3 py-1 text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              Quitar filtros
            </button>
          )}
        </div>
      )}
    </section>
  );
}
