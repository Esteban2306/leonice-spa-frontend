import {
  Crown,
  Ellipsis,
  Gauge,
  Pencil,
  Plus,
  Power,
  Scissors,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/src/components/ui/skeleton";
import type { CapacityPool } from "@/src/features/admin/types/capacity-pools.types";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";
import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";

import { CapacityStepper } from "./capacity-stepper";
import { CatalogChip } from "./catalog-chip";
import { OptionsMenu } from "./options-menu";
import { TreatmentCard } from "./treatment-card";

export interface StationHandlers {
  onOpenTreatment: (treatmentId: string) => void;
  onEditTreatment: (treatment: AdminTreatment) => void;
  onHairPricing: (treatment: AdminTreatment) => void;
  onCreatePromotion: (treatment: AdminTreatment) => void;
  onToggleTreatment: (treatment: AdminTreatment, isActive: boolean) => void;
  onCreateTreatment: (categoryId: string) => void;
  onEditCategory: (category: AdminCategory) => void;
  onManageCapacity: (category: AdminCategory) => void;
  onToggleCategory: (category: AdminCategory, isActive: boolean) => void;
  onCommitCapacity: (poolId: string, maxConcurrent: number) => Promise<boolean>;
}

interface StationColumnProps {
  category: AdminCategory;
  pools: readonly CapacityPool[];
  treatments: readonly AdminTreatment[];
  isLoading: boolean;
  hasFilters: boolean;
  selectedTreatmentId: string | null;
  busyTreatmentIds: ReadonlySet<string>;
  handlers: StationHandlers;
}

export function StationColumn({
  category,
  pools,
  treatments,
  isLoading,
  hasFilters,
  selectedTreatmentId,
  busyTreatmentIds,
  handlers,
}: StationColumnProps) {
  const activePools = pools.filter((pool) => pool.isActive);
  const capacity = activePools.reduce(
    (sum, pool) => sum + pool.maxConcurrent,
    0,
  );

  return (
    <section
      aria-labelledby={`station-${category.id}`}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-[2rem] border border-tertiary/30 bg-primary/70",
        !category.isActive && "opacity-75",
      )}
    >
      <header className="flex flex-col gap-4 bg-secondary p-5 text-primary">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id={`station-${category.id}`}
              className="truncate font-heading text-2xl leading-tight"
            >
              {category.name}
            </h2>
            <p className="mt-1 font-sans text-xs text-primary/60">
              {category.activeTreatmentCount} de {category.treatmentCount}{" "}
              servicios activos
            </p>
          </div>
          <OptionsMenu
            label={`Opciones de ${category.name}`}
            trigger={
              <button
                type="button"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-primary/20 text-primary/80 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
              >
                <Ellipsis className="size-4.5" />
              </button>
            }
            options={[
              {
                key: "new",
                icon: Plus,
                label: "Nuevo servicio aquí",
                onSelect: () => handlers.onCreateTreatment(category.id),
              },
              {
                key: "edit",
                icon: Pencil,
                label: "Editar categoría",
                onSelect: () => handlers.onEditCategory(category),
              },
              {
                key: "capacity",
                icon: Gauge,
                label: "Gestionar capacidad",
                onSelect: () => handlers.onManageCapacity(category),
              },
              {
                key: "toggle",
                icon: Power,
                label: category.isActive
                  ? "Desactivar categoría"
                  : "Activar categoría",
                tone: category.isActive ? "danger" : "default",
                separated: true,
                onSelect: () =>
                  handlers.onToggleCategory(category, !category.isActive),
              },
            ]}
          />
        </div>

        {(category.isPrincipal ||
          category.tracksHairProfile ||
          !category.isActive) && (
          <div className="flex flex-wrap gap-1.5">
            {!category.isActive && (
              <CatalogChip tone="onDark">Inactiva</CatalogChip>
            )}
            {category.isPrincipal && (
              <CatalogChip
                tone="onDark"
                icon={<Crown className="size-3" strokeWidth={2} />}
              >
                Principal en combos
              </CatalogChip>
            )}
            {category.tracksHairProfile && (
              <CatalogChip
                tone="onDark"
                icon={<Scissors className="size-3" strokeWidth={2} />}
              >
                Perfil capilar
              </CatalogChip>
            )}
          </div>
        )}

        <div className="rounded-[1.25rem] border border-primary/15 bg-primary/[0.06] p-3">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-5xl leading-none font-light text-quaternary tabular-nums">
              {capacity}
            </span>
            <span className="font-sans text-xs text-primary/70">
              {capacity === 1 ? "cita a la vez" : "citas a la vez"}
            </span>
          </div>
          {activePools.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {activePools.map((pool) => (
                <CapacityStepper
                  key={`${pool.id}-${pool.maxConcurrent}`}
                  poolName={pool.name}
                  value={pool.maxConcurrent}
                  onCommit={(next) => handlers.onCommitCapacity(pool.id, next)}
                />
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handlers.onManageCapacity(category)}
              className="mt-3 cursor-pointer font-sans text-xs text-quaternary underline underline-offset-4 hover:text-primary"
            >
              Sin capacidad: no se puede reservar. Agregar
            </button>
          )}
        </div>
      </header>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-3 transition-opacity",
          isLoading && treatments.length > 0 && "opacity-60",
        )}
      >
        {isLoading &&
          treatments.length === 0 &&
          [0, 1, 2].map((key) => (
            <Skeleton
              key={key}
              className="h-28 rounded-[1.5rem] bg-secondary/5"
            />
          ))}

        {treatments.map((treatment) => (
          <TreatmentCard
            key={treatment.id}
            treatment={treatment}
            isSelected={selectedTreatmentId === treatment.id}
            isBusy={busyTreatmentIds.has(treatment.id)}
            onOpen={handlers.onOpenTreatment}
            onEdit={handlers.onEditTreatment}
            onHairPricing={handlers.onHairPricing}
            onCreatePromotion={handlers.onCreatePromotion}
            onToggleActive={handlers.onToggleTreatment}
          />
        ))}

        {!isLoading && treatments.length === 0 && (
          <p className="px-3 py-6 text-center font-sans text-sm text-secondary/70">
            {hasFilters
              ? "Ningún servicio de esta estación coincide con los filtros."
              : "Esta estación aún no tiene servicios."}
          </p>
        )}

        <button
          type="button"
          onClick={() => handlers.onCreateTreatment(category.id)}
          className="mt-auto flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[1.25rem] border border-dashed border-tertiary/50 font-sans text-sm text-secondary/70 transition-colors hover:border-tertiary hover:bg-quaternary/20 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          Agregar servicio
        </button>
      </div>
    </section>
  );
}
