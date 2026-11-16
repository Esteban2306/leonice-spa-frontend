import type {
  AdminProduct,
  AdminProductCategory,
  RitualItemRequest,
} from "@/src/features/admin/types/products.types";

import { MAX_VARIANT_PRICE_PESOS, parsePesos } from "./product-catalog";

export const COMBO_CATEGORY_SLUG = "combos";
export const RITUAL_MIN_ITEMS = 2;
export const RITUAL_MAX_ITEMS = 10;
export const RITUAL_MAX_QUANTITY = 10;

export interface RitualVariantOption {
  variantId: string;
  productId: string;
  productName: string;
  brand: string;
  presentation: string;
  unitPricePesos: number;
  imageUrl: string | null;
}

export interface RitualDraftItem extends RitualVariantOption {
  quantity: number;
}

export function isRitual(product: Pick<AdminProduct, "kind">): boolean {
  return product.kind === "COMBO";
}

export function isComboCategory(
  category: Pick<AdminProductCategory, "slug">,
): boolean {
  return category.slug === COMBO_CATEGORY_SLUG;
}

export function ritualVariantOptions(
  products: readonly AdminProduct[],
): RitualVariantOption[] {
  return products
    .filter((product) => product.kind === "SINGLE" && product.isActive)
    .flatMap((product) =>
      product.variants
        .filter((variant) => variant.isActive)
        .map((variant) => ({
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          brand: variant.brand,
          presentation: variant.presentation,
          unitPricePesos: Number(variant.price),
          imageUrl: variant.imageUrl,
        })),
    )
    .sort((a, b) => a.productName.localeCompare(b.productName, "es"));
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function searchVariantOptions(
  options: readonly RitualVariantOption[],
  query: string,
  excludeIds: ReadonlySet<string>,
  limit = 8,
): RitualVariantOption[] {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return options
    .filter((option) => !excludeIds.has(option.variantId))
    .filter((option) => {
      const haystack = normalize(
        `${option.productName} ${option.brand} ${option.presentation}`,
      );
      return words.every((word) => haystack.includes(word));
    })
    .slice(0, limit);
}

export function draftFromRitual(product: AdminProduct): RitualDraftItem[] {
  return (product.ritual?.items ?? []).map((item) => ({
    variantId: item.variantId,
    productId: item.productId,
    productName: item.productName,
    brand: item.brand,
    presentation: item.presentation,
    unitPricePesos: item.unitPricePesos,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
  }));
}

export interface RitualTotals {
  units: number;
  separatePricePesos: number;
  savingsPesos: number | null;
  savingsPercent: number | null;
}

export function ritualTotals(
  items: readonly RitualDraftItem[],
  pricePesos: number | null,
): RitualTotals {
  const separatePricePesos = items.reduce(
    (total, item) => total + item.unitPricePesos * item.quantity,
    0,
  );
  const units = items.reduce((total, item) => total + item.quantity, 0);
  if (pricePesos === null || separatePricePesos === 0)
    return {
      units,
      separatePricePesos,
      savingsPesos: null,
      savingsPercent: null,
    };
  const savingsPesos = separatePricePesos - pricePesos;
  return {
    units,
    separatePricePesos,
    savingsPesos,
    savingsPercent: Math.floor((savingsPesos / separatePricePesos) * 100),
  };
}

export function itemsError(items: readonly RitualDraftItem[]): string | null {
  if (items.length < RITUAL_MIN_ITEMS)
    return "Agrega al menos 2 productos al Ritual.";
  if (items.length > RITUAL_MAX_ITEMS)
    return "Un Ritual admite hasta 10 productos.";
  return null;
}

export function toItemRequests(
  items: readonly RitualDraftItem[],
): RitualItemRequest[] {
  return items.map(({ variantId, quantity }) => ({ variantId, quantity }));
}

export function sameItems(
  a: readonly RitualDraftItem[],
  b: readonly RitualDraftItem[],
): boolean {
  return (
    a.length === b.length &&
    a.every(
      (item, index) =>
        item.variantId === b[index].variantId &&
        item.quantity === b[index].quantity,
    )
  );
}

export interface RitualDraftErrors {
  name?: string;
  price?: string;
  items?: string;
}

export function validateRitualDraft(draft: {
  name: string;
  price: string;
  items: readonly RitualDraftItem[];
}): {
  errors: RitualDraftErrors;
  data: { name: string; price: number; items: RitualItemRequest[] } | null;
} {
  const errors: RitualDraftErrors = {};
  const name = draft.name.trim().replace(/\s+/g, " ");
  const price = parsePesos(draft.price);
  if (name.length < 2) errors.name = "El nombre necesita al menos 2 letras.";
  else if (name.length > 120) errors.name = "Máximo 120 caracteres.";
  if (price === null || price < 1)
    errors.price = "Escribe el precio del Ritual en pesos.";
  else if (price > MAX_VARIANT_PRICE_PESOS)
    errors.price = "El precio es demasiado alto.";
  const itemsMessage = itemsError(draft.items);
  if (itemsMessage) errors.items = itemsMessage;
  if (Object.keys(errors).length > 0 || price === null)
    return { errors, data: null };
  return { errors, data: { name, price, items: toItemRequests(draft.items) } };
}

export function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToLines(list: readonly string[]): string {
  return list.join("\n");
}
