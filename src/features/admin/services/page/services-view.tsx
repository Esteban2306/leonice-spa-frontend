import { FolderPlus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CapacityPool } from "@/src/features/admin/types/capacity-pools.types";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";
import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";

import type { CatalogFilters } from "../lib/catalog";
import { CatalogKpis, type CatalogTotals } from "../components/catalog-kpis";
import { CatalogToolbar } from "../components/catalog-toolbar";
import {
  StationColumn,
  type StationHandlers,
} from "../components/station-column";

export interface ServicesViewProps {
  categories: readonly AdminCategory[];
  poolsByCategory: ReadonlyMap<string, CapacityPool[]>;
  treatmentsByCategory: ReadonlyMap<string, AdminTreatment[]>;
  totals: CatalogTotals;
  filters: CatalogFilters;
  hasFilters: boolean;
  resultCount: number | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  mobileStationId: string | null;
  selectedTreatmentId: string | null;
  busyTreatmentIds: ReadonlySet<string>;
  handlers: StationHandlers;
  onFiltersChange: (patch: Partial<CatalogFilters>) => void;
  onResetFilters: () => void;
  onMobileStationChange: (categoryId: string) => void;
  onCreateCategory: () => void;
  onCreateTreatment: () => void;
  onRetry: () => void;
  onManageStations: () => void;
}

export function ServicesView(props: ServicesViewProps) {
  const {
    categories,
    treatmentsByCategory,
    poolsByCategory,
    mobileStationId,
    handlers,
  } = props;

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">Servicios</h1>
            <p className="mt-2 hidden max-w-xl font-sans text-sm text-primary/70 sm:block">
              Precios, tiempos, capacidad y promociones de cada estación del
              spa. Lo que cambies aquí lo usan el bot de WhatsApp y el
              calendario.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={props.onCreateCategory}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-primary/25 px-5 font-sans text-sm text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            >
              <FolderPlus className="size-4" strokeWidth={1.8} />
              Nueva categoría
            </button>
            <button
              type="button"
              onClick={props.onCreateTreatment}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            >
              <Plus className="size-4" strokeWidth={2} />
              Nuevo servicio
            </button>
          </div>
        </header>

        <CatalogKpis
          totals={props.totals}
          filters={props.filters}
          onApply={props.onFiltersChange}
          onManageStations={props.onManageStations}
        />

        <CatalogToolbar
          filters={props.filters}
          resultCount={props.resultCount}
          isFetching={props.isFetching}
          onChange={props.onFiltersChange}
          onReset={props.onResetFilters}
        />

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudo cargar el catálogo.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {categories.length > 1 && (
          <nav
            aria-label="Estaciones"
            className="-mx-5 flex scroll-px-5 gap-2 overflow-x-auto px-5 pt-1 pb-1 lg:hidden"
          >
            {categories.map((category) => {
              const isActive = category.id === mobileStationId;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => props.onMobileStationChange(category.id)}
                  className={cn(
                    "h-10 shrink-0 cursor-pointer rounded-full border px-4 font-sans text-sm transition-colors",
                    isActive
                      ? "border-secondary bg-secondary text-primary"
                      : "border-secondary/15 bg-white text-secondary/75",
                  )}
                >
                  {category.name}
                  <span className="ml-1.5 tabular-nums opacity-80">
                    {treatmentsByCategory.get(category.id)?.length ?? 0}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {props.isLoading && categories.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="h-96 animate-pulse rounded-[2rem] bg-secondary/5"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-tertiary/50 p-10 text-center">
            <p className="font-heading text-2xl text-secondary">
              Aún no hay categorías
            </p>
            <p className="max-w-md font-sans text-sm text-secondary/70">
              Crea la primera estación (por ejemplo Spa Capilar), agrégale
              capacidad y luego sus servicios.
            </p>
            <button
              type="button"
              onClick={props.onCreateCategory}
              className="h-11 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm text-primary"
            >
              Crear categoría
            </button>
          </div>
        ) : (
          <div
            id="estaciones"
            className="grid scroll-mt-6 grid-cols-1 gap-4 lg:auto-cols-[minmax(17rem,1fr)] lg:grid-flow-col lg:grid-cols-none lg:overflow-x-auto lg:pb-2"
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "min-w-0",
                  category.id !== mobileStationId && "hidden lg:block",
                )}
              >
                <StationColumn
                  category={category}
                  pools={poolsByCategory.get(category.id) ?? []}
                  treatments={treatmentsByCategory.get(category.id) ?? []}
                  isLoading={props.isLoading}
                  hasFilters={props.hasFilters}
                  selectedTreatmentId={props.selectedTreatmentId}
                  busyTreatmentIds={props.busyTreatmentIds}
                  handlers={handlers}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
