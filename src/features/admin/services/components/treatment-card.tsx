import {
  BadgePercent,
  CircleDollarSign,
  Clock3,
  Ellipsis,
  Pencil,
  Power,
  Scissors,
  Stethoscope,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";

import {
  formatDurationRange,
  formatPriceRange,
  hairPriceRange,
} from "../lib/catalog";
import { CatalogChip } from "./catalog-chip";
import { CatalogSwitch } from "./catalog-switch";
import { OptionsMenu } from "./options-menu";

interface TreatmentCardProps {
  treatment: AdminTreatment;
  isSelected: boolean;
  isBusy: boolean;
  onOpen: (treatmentId: string) => void;
  onEdit: (treatment: AdminTreatment) => void;
  onHairPricing: (treatment: AdminTreatment) => void;
  onCreatePromotion: (treatment: AdminTreatment) => void;
  onToggleActive: (treatment: AdminTreatment, isActive: boolean) => void;
}

export function TreatmentCard({
  treatment,
  isSelected,
  isBusy,
  onOpen,
  onEdit,
  onHairPricing,
  onCreatePromotion,
  onToggleActive,
}: TreatmentCardProps) {
  const hair = hairPriceRange(treatment);
  const price = hair
    ? formatPriceRange(hair.priceMin, hair.priceMax)
    : formatPriceRange(treatment.basePriceMin, treatment.basePriceMax);
  const effective =
    treatment.activePromotion && !hair
      ? formatPriceRange(
          treatment.effectiveBasePriceMin,
          treatment.effectiveBasePriceMax,
        )
      : null;
  const duration = hair
    ? formatDurationRange(hair.minutesMin, hair.minutesMax)
    : formatDurationRange(
        treatment.baseDurationMinMinutes,
        treatment.baseDurationMaxMinutes,
      );

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-[1.5rem] border p-4 transition-[border-color,box-shadow,transform] duration-200 ease-out",
        treatment.isActive
          ? "border-tertiary/30 bg-[#FCF6EB] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-22px_rgba(6,33,18,0.45)]"
          : "border-dashed border-secondary/20 bg-primary/60",
        isSelected &&
          "border-secondary shadow-[0_14px_30px_-22px_rgba(6,33,18,0.45)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpen(treatment.id)}
          className="min-w-0 cursor-pointer text-left font-sans text-[15px] leading-snug font-semibold text-secondary after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-tertiary"
        >
          <span className={cn(!treatment.isActive && "text-secondary/70")}>
            {treatment.name}
          </span>
        </button>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          <CatalogSwitch
            checked={treatment.isActive}
            disabled={isBusy}
            label={
              treatment.isActive
                ? `Desactivar ${treatment.name}`
                : `Activar ${treatment.name}`
            }
            onChange={(next) => onToggleActive(treatment, next)}
          />
          <OptionsMenu
            label={`Opciones de ${treatment.name}`}
            trigger={
              <button
                type="button"
                className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/70 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
              >
                <Ellipsis className="size-4.5" />
              </button>
            }
            options={[
              {
                key: "edit",
                icon: Pencil,
                label: "Editar servicio",
                onSelect: () => onEdit(treatment),
              },
              {
                key: "hair",
                icon: Scissors,
                label: "Precios por cabello",
                onSelect: () => onHairPricing(treatment),
              },
              {
                key: "promo",
                icon: BadgePercent,
                label: "Crear promoción",
                onSelect: () => onCreatePromotion(treatment),
              },
              {
                key: "toggle",
                icon: Power,
                label: treatment.isActive
                  ? "Desactivar servicio"
                  : "Activar servicio",
                tone: treatment.isActive ? "danger" : "default",
                separated: true,
                onSelect: () => onToggleActive(treatment, !treatment.isActive),
              },
            ]}
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-0.5">
          <dt className="sr-only">Precio</dt>
          <dd className="flex items-center gap-1.5 font-sans text-sm text-secondary tabular-nums">
            <CircleDollarSign
              className="size-3.5 shrink-0 text-tertiary"
              strokeWidth={1.8}
            />
            {effective ? (
              <span className="flex flex-col leading-tight">
                <span className="font-semibold">{effective}</span>
                <span className="text-[11px] text-secondary/65 line-through">
                  {price}
                </span>
              </span>
            ) : (
              <span className={cn(!price && "text-amber-800")}>
                {price ?? "Sin precio"}
              </span>
            )}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="sr-only">Duración</dt>
          <dd className="flex items-center gap-1.5 font-sans text-sm text-secondary tabular-nums">
            <Clock3
              className="size-3.5 shrink-0 text-tertiary"
              strokeWidth={1.8}
            />
            {duration ?? "Sin duración"}
          </dd>
        </div>
      </dl>

      {(treatment.activePromotion ||
        treatment.requiresPriorAssessment ||
        treatment.hasHairVariablePricing ||
        !treatment.isActive) && (
        <div className="flex flex-wrap gap-1.5">
          {!treatment.isActive && (
            <CatalogChip tone="muted">Inactivo</CatalogChip>
          )}
          {treatment.activePromotion && (
            <CatalogChip
              tone="gold"
              icon={<BadgePercent className="size-3" strokeWidth={2} />}
            >
              −{Number(treatment.activePromotion.discountPercentage)} %
            </CatalogChip>
          )}
          {treatment.requiresPriorAssessment && (
            <CatalogChip
              tone="amber"
              icon={<Stethoscope className="size-3" strokeWidth={2} />}
            >
              Valoración previa
            </CatalogChip>
          )}
          {treatment.hasHairVariablePricing && (
            <CatalogChip icon={<Scissors className="size-3" strokeWidth={2} />}>
              Precio por cabello
            </CatalogChip>
          )}
        </div>
      )}
    </article>
  );
}
