import { formatPesos } from "@/src/features/landing/lib/format";

export function priceRangeLabel(min: number | null, max: number | null): string | null {
  if (min === null) return null;
  if (max === null || max === min) return formatPesos(min);
  return `Desde ${formatPesos(min)}`;
}

export function productOrderMessage(name: string, presentation?: string): string {
  return presentation
    ? `Hola, quiero el ${name} (${presentation}) de Leonice.`
    : `Hola, quiero información sobre el ${name} de Leonice.`;
}

export function productHref(slug: string): string {
  return `/productos/${slug}`;
}

export const PRODUCTS_ROOT = "/productos";
