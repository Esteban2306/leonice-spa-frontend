import { formatPesos } from "@/src/features/landing/lib/format";
import type {
  CatalogProductCard,
  CatalogRitualSummary,
} from "@/src/features/products-catalog/api/catalog.types";

export function ritualOf(product: CatalogProductCard): CatalogRitualSummary | null {
  return product.kind === "ritual" ? (product.ritual ?? null) : null;
}

export function hasSavings(ritual: CatalogRitualSummary | null): ritual is CatalogRitualSummary {
  return ritual !== null && ritual.savingsPesos > 0;
}

export function savingsLabel(ritual: CatalogRitualSummary): string {
  return `Ahorras ${formatPesos(ritual.savingsPesos)} (${ritual.savingsPercent} %)`;
}

export function itemCountLabel(count: number): string {
  return count === 1 ? "Incluye 1 producto" : `Incluye ${count} productos`;
}

export function ritualOrderMessage(name: string): string {
  return `Hola, quiero el ${name} de Leonice.`;
}
