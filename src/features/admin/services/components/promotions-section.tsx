import { BadgePercent, Pencil, Plus, Power } from "lucide-react";

import type { Promotion } from "@/src/features/admin/types/promotions.types";

import {
  PROMOTION_STATE_LABELS,
  formatPromotionWindow,
  promotionState,
  type PromotionState,
} from "../lib/catalog";
import { CatalogChip, type ChipTone } from "./catalog-chip";

const STATE_TONE: Record<PromotionState, ChipTone> = {
  CURRENT: "green",
  UPCOMING: "gold",
  EXPIRED: "muted",
  INACTIVE: "muted",
};

interface PromotionsSectionProps {
  promotions: readonly Promotion[];
  isLoading: boolean;
  nowMs: number;
  onCreate: () => void;
  onEdit: (promotion: Promotion) => void;
  onDeactivate: (promotion: Promotion) => void;
}

const ICON_BUTTON =
  "grid size-8 cursor-pointer place-items-center rounded-full text-secondary/70 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function PromotionsSection({
  promotions,
  isLoading,
  nowMs,
  onCreate,
  onEdit,
  onDeactivate,
}: PromotionsSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      {isLoading && promotions.length === 0 && (
        <p className="font-sans text-sm text-secondary/70">
          Cargando promociones…
        </p>
      )}

      {!isLoading && promotions.length === 0 && (
        <p className="font-sans text-sm text-secondary/70">
          Sin promociones para este servicio ni para su categoría.
        </p>
      )}

      {promotions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {promotions.map((promotion) => {
            const state = promotionState(promotion, nowMs);
            return (
              <li
                key={promotion.id}
                className="flex items-center gap-3 rounded-2xl border border-tertiary/25 bg-white/70 p-3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-quaternary/35 font-sans text-sm font-semibold text-secondary tabular-nums">
                  {Number(promotion.discountPercentage)}%
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-medium text-secondary">
                    {promotion.name}
                  </p>
                  <p className="font-sans text-xs text-secondary/70">
                    {formatPromotionWindow(
                      promotion.startsAt,
                      promotion.endsAt,
                    )}{" "}
                    ·{" "}
                    {promotion.treatment
                      ? promotion.treatment.name
                      : `Toda ${promotion.category?.name ?? "la categoría"}`}
                  </p>
                </div>
                <CatalogChip tone={STATE_TONE[state]}>
                  {PROMOTION_STATE_LABELS[state]}
                </CatalogChip>
                <button
                  type="button"
                  aria-label={`Editar ${promotion.name}`}
                  onClick={() => onEdit(promotion)}
                  className={ICON_BUTTON}
                >
                  <Pencil className="size-4" strokeWidth={1.7} />
                </button>
                {promotion.isActive && state !== "EXPIRED" && (
                  <button
                    type="button"
                    aria-label={`Desactivar ${promotion.name}`}
                    onClick={() => onDeactivate(promotion)}
                    className={`${ICON_BUTTON} hover:bg-red-50 hover:text-red-700`}
                  >
                    <Power className="size-4" strokeWidth={1.7} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        <Plus className="size-4" strokeWidth={1.8} />
        <BadgePercent className="size-4" strokeWidth={1.8} />
        Nueva promoción
      </button>
    </div>
  );
}
