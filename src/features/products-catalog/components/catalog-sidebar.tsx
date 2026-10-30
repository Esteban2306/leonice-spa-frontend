"use client";

import { Check, RotateCcw, SlidersHorizontal } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/src/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/components/ui/sheet";
import type {
  CatalogFilters,
  CatalogResult,
} from "@/src/features/products-catalog/api/catalog.types";
import { CatalogSearchField } from "@/src/features/products-catalog/components/catalog-search-field";
import { PriceRange } from "@/src/features/products-catalog/components/price-range";
import {
  activeFilterCount,
  toggleTag,
} from "@/src/features/products-catalog/lib/catalog-filters";

interface FilterPanelProps {
  filters: CatalogFilters;
  facets: CatalogResult["facets"];
  loading: boolean;
  showSearch: boolean;
  onChange: (next: CatalogFilters) => void;
  onReset: () => void;
}

interface OptionRowProps {
  label: string;
  count: number | null;
  selected: boolean;
  shape: "check" | "radio";
  disabled?: boolean;
  onSelect: () => void;
}

const GROUP_LABEL =
  "h-auto px-3 pb-2 pt-0 font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#7a5a2c]";

function OptionRow({
  label,
  count,
  selected,
  shape,
  disabled = false,
  onSelect,
}: OptionRowProps) {
  const radius = shape === "radio" ? "rounded-full" : "rounded-[5px]";
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={selected}
        disabled={disabled}
        aria-pressed={selected}
        onClick={onSelect}
        className="group/option h-9 cursor-pointer gap-3 rounded-xl px-3 font-sans text-sm font-medium text-[#062112]/75 transition-[background-color,color] duration-300 hover:bg-[#BF9250]/10 hover:text-[#062112] focus-visible:ring-[#BF9250] data-active:bg-[#BF9250]/12 data-active:font-bold data-active:text-[#062112] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span
          aria-hidden="true"
          className={`grid size-4 shrink-0 place-items-center border transition-[background-color,border-color] duration-300 ${radius} ${
            selected
              ? "border-[#062112] bg-[#062112]"
              : "border-[#062112]/25 group-hover/option:border-[#062112]/55"
          }`}
        >
          {selected &&
            (shape === "check" ? (
              <Check className="size-3 text-[#E0BC87]" strokeWidth={3} />
            ) : (
              <span className="size-1.5 rounded-full bg-[#E0BC87]" />
            ))}
        </span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {count !== null && (
          <span className="font-sans text-xs font-bold tabular-nums text-[#7a5a2c]/80">
            {count}
            <span className="sr-only"> productos</span>
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function Divider() {
  return (
    <SidebarSeparator className="mx-3 my-1 h-px data-horizontal:w-[calc(100%-1.5rem)] bg-gradient-to-r from-transparent via-[#BF9250]/40 to-transparent" />
  );
}

function FilterPanel({
  filters,
  facets,
  loading,
  showSearch,
  onChange,
  onReset,
}: FilterPanelProps) {
  const active = activeFilterCount(filters);
  const priceBounds =
    facets.price.minPesos !== null && facets.price.maxPesos !== null
      ? { min: facets.price.minPesos, max: facets.price.maxPesos }
      : null;

  return (
    <>
      <div
        aria-hidden="true"
        data-loading={loading}
        className="catalog-progress absolute inset-x-0 top-0 h-[2px] bg-[#BF9250]"
      />
      <SidebarHeader className="flex-row items-center justify-between gap-3 px-5 pb-3 pt-5">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal
            className="size-4 text-[#7a5a2c]"
            aria-hidden="true"
          />
          <h2 className="font-heading text-xl leading-none text-[#062112]">
            Filtros
          </h2>
          {active > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-[#062112] font-sans text-[0.68rem] font-bold tabular-nums text-[#E0BC87]">
              {active}
            </span>
          )}
        </div>
        {active > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 font-sans text-xs font-bold text-[#062112]/65 transition-colors hover:text-[#062112] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250]"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Limpiar
          </button>
        )}
      </SidebarHeader>

      <SidebarContent className="catalog-sidebar-scroll gap-1 px-2 pb-4">
        {showSearch && (
          <>
            <SidebarGroup className="px-3 py-2">
              <CatalogSearchField
                stacked
                value={filters.q}
                onCommit={(q) => onChange({ ...filters, q })}
              />
            </SidebarGroup>
            <Divider />
          </>
        )}

        {facets.tags.length > 0 && (
          <>
            <SidebarGroup className="px-0 py-3">
              <SidebarGroupLabel className={GROUP_LABEL}>
                ¿Qué necesita tu cabello?
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {facets.tags.map((tag) => {
                    const selected = filters.tags.includes(tag.slug);
                    return (
                      <OptionRow
                        key={tag.slug}
                        label={tag.name}
                        count={tag.count}
                        selected={selected}
                        shape="check"
                        disabled={tag.count === 0 && !selected}
                        onSelect={() => onChange(toggleTag(filters, tag.slug))}
                      />
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <Divider />
          </>
        )}

        {facets.categories.length > 1 && (
          <>
            <SidebarGroup className="px-0 py-3">
              <SidebarGroupLabel className={GROUP_LABEL}>
                Marca
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  <OptionRow
                    label="Todas las marcas"
                    count={null}
                    selected={filters.category === null}
                    shape="radio"
                    onSelect={() => onChange({ ...filters, category: null })}
                  />
                  {facets.categories.map((category) => (
                    <OptionRow
                      key={category.slug}
                      label={category.name}
                      count={category.count}
                      selected={filters.category === category.slug}
                      shape="radio"
                      disabled={
                        category.count === 0 &&
                        filters.category !== category.slug
                      }
                      onSelect={() =>
                        onChange({ ...filters, category: category.slug })
                      }
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <Divider />
          </>
        )}

        {priceBounds && (
          <SidebarGroup className="px-3 py-3">
            <SidebarGroupLabel className={`${GROUP_LABEL} px-0`}>
              Precio
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <PriceRange
                key={`${filters.minPrice}-${filters.maxPrice}-${priceBounds.min}-${priceBounds.max}`}
                bounds={priceBounds}
                value={{ min: filters.minPrice, max: filters.maxPrice }}
                onCommit={({ min, max }) =>
                  onChange({ ...filters, minPrice: min, maxPrice: max })
                }
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </>
  );
}

interface CatalogSidebarProps extends Omit<FilterPanelProps, "showSearch"> {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function CatalogSidebar({
  mobileOpen,
  onMobileOpenChange,
  ...panel
}: CatalogSidebarProps) {
  return (
    <>
      <aside aria-label="Filtros de la carta" className="hidden desk:block">
        <div className="sticky top-28">
          <Sidebar
            collapsible="none"
            className="sun-glass relative h-auto max-h-[calc(100svh-8.5rem)] w-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#FDF8F1]/97 text-[#062112]"
          >
            <FilterPanel {...panel} showSearch />
          </Sidebar>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-[min(21rem,92vw)] gap-0 border-r border-[#BF9250]/30 bg-[#FDF8F1] p-0 text-[#062112] data-[side=left]:sm:max-w-none"
        >
          <SheetTitle className="sr-only">Filtros de la carta</SheetTitle>
          <SheetDescription className="sr-only">
            Elige necesidad, marca y rango de precio para ordenar la carta.
          </SheetDescription>
          <Sidebar
            collapsible="none"
            className="relative h-full w-full bg-transparent text-[#062112]"
          >
            <FilterPanel {...panel} showSearch={false} />
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
}
