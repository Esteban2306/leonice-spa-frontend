import type { Promotion } from "@/src/features/admin/types/promotions.types";
import {
  promotionState,
  type PromotionState,
} from "@/src/features/admin/services/lib/catalog";

export type PromotionFilter = "ALL" | PromotionState;

export const PROMOTION_FILTERS: ReadonlyArray<{
  value: PromotionFilter;
  label: string;
}> = [
  { value: "ALL", label: "Todas" },
  { value: "CURRENT", label: "Vigentes" },
  { value: "UPCOMING", label: "Programadas" },
  { value: "EXPIRED", label: "Vencidas" },
  { value: "INACTIVE", label: "Desactivadas" },
];

export function countPromotionsByState(
  promotions: readonly Promotion[],
  nowMs: number,
): Record<PromotionFilter, number> {
  const counts: Record<PromotionFilter, number> = {
    ALL: promotions.length,
    CURRENT: 0,
    UPCOMING: 0,
    EXPIRED: 0,
    INACTIVE: 0,
  };
  for (const promotion of promotions) {
    counts[promotionState(promotion, nowMs)] += 1;
  }
  return counts;
}

export function filterPromotions(
  promotions: readonly Promotion[],
  filter: PromotionFilter,
  nowMs: number,
): Promotion[] {
  const visible =
    filter === "ALL"
      ? [...promotions]
      : promotions.filter((item) => promotionState(item, nowMs) === filter);
  return visible.sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
  );
}
