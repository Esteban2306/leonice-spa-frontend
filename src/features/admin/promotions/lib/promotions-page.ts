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

export type PromotionDomainFilter = "ALL" | "SERVICES" | "PRODUCTS";

export const PROMOTION_DOMAIN_FILTERS: ReadonlyArray<{
  value: PromotionDomainFilter;
  label: string;
}> = [
  { value: "ALL", label: "Todo" },
  { value: "SERVICES", label: "Servicios" },
  { value: "PRODUCTS", label: "Productos y kits" },
];

export function promotionDomain(
  promotion: Pick<Promotion, "productId" | "productCategoryId">,
): Exclude<PromotionDomainFilter, "ALL"> {
  return promotion.productId || promotion.productCategoryId
    ? "PRODUCTS"
    : "SERVICES";
}

export function filterPromotionsByDomain(
  promotions: readonly Promotion[],
  domain: PromotionDomainFilter,
): Promotion[] {
  return domain === "ALL"
    ? [...promotions]
    : promotions.filter((promotion) => promotionDomain(promotion) === domain);
}

export function promotionTargetLabel(promotion: Promotion): string {
  if (promotion.product) {
    return promotion.product.kind === "COMBO"
      ? `Kit ${promotion.product.name}`
      : promotion.product.name;
  }
  if (promotion.productCategory) {
    return `Todos los productos de ${promotion.productCategory.name}`;
  }
  if (promotion.treatment) return promotion.treatment.name;
  return `Toda ${promotion.category?.name ?? "la categoría"}`;
}
