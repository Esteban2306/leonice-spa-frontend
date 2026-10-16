import { formatCop } from "@/src/lib/money/cop";
import type {
  AdminProduct,
  CreateProductVariantRequest,
  ProductStatusFilter,
  ProductVariant,
} from "@/src/features/admin/types/products.types";

export const MAX_VARIANT_PRICE_PESOS = 99_999_999;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type ProductQuickFilter = "all" | "missingPhoto" | "noVariants";

export interface ProductFilters {
  q: string;
  status: ProductStatusFilter;
  productCategoryId: string;
  quick: ProductQuickFilter;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  q: "",
  status: "ALL",
  productCategoryId: "",
  quick: "all",
};

export function activeVariants(product: AdminProduct): ProductVariant[] {
  return product.variants.filter((variant) => variant.isActive);
}

export function variantPrice(variant: ProductVariant): number {
  return Number(variant.price);
}

export function priceRangePesos(
  product: AdminProduct,
): { min: number; max: number } | null {
  const prices = activeVariants(product).map(variantPrice);
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function formatPriceRangePesos(
  range: { min: number; max: number } | null,
): string | null {
  if (!range) return null;
  if (range.min === range.max) return formatCop(range.min);
  return `${formatCop(range.min)} – ${formatCop(range.max)}`;
}

export function coverImage(product: AdminProduct): string | null {
  return (
    activeVariants(product).find((variant) => variant.imageUrl)?.imageUrl ??
    product.variants.find((variant) => variant.imageUrl)?.imageUrl ??
    null
  );
}

export function photoCoverage(product: AdminProduct): {
  withPhoto: number;
  total: number;
} {
  const variants = activeVariants(product);
  return {
    withPhoto: variants.filter((variant) => variant.imageUrl).length,
    total: variants.length,
  };
}

export function isMissingPhoto(product: AdminProduct): boolean {
  const { withPhoto, total } = photoCoverage(product);
  return total > 0 && withPhoto < total;
}

export function hasNoActiveVariants(product: AdminProduct): boolean {
  return activeVariants(product).length === 0;
}

export function hasHistory(product: AdminProduct): boolean {
  return product._count.viewLogs > 0 || product._count.recommendations > 0;
}

export function brandsOf(product: AdminProduct): string[] {
  return [...new Set(activeVariants(product).map((variant) => variant.brand))];
}

export function matchesQuickFilter(
  product: AdminProduct,
  quick: ProductQuickFilter,
): boolean {
  if (quick === "missingPhoto") return isMissingPhoto(product);
  if (quick === "noVariants") return hasNoActiveVariants(product);
  return true;
}

export interface ProductTotals {
  active: number;
  inactive: number;
  missingPhoto: number;
  noVariants: number;
}

export function productTotals(
  products: readonly AdminProduct[],
): ProductTotals {
  return products.reduce<ProductTotals>(
    (totals, product) => ({
      active: totals.active + (product.isActive ? 1 : 0),
      inactive: totals.inactive + (product.isActive ? 0 : 1),
      missingPhoto:
        totals.missingPhoto +
        (product.isActive && isMissingPhoto(product) ? 1 : 0),
      noVariants:
        totals.noVariants +
        (product.isActive && hasNoActiveVariants(product) ? 1 : 0),
    }),
    { active: 0, inactive: 0, missingPhoto: 0, noVariants: 0 },
  );
}

export function parsePesos(input: string): number | null {
  const digits = input.replace(/[^\d]/g, "");
  if (digits.length === 0) return null;
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
}

export function formatPesosInput(value: number | null): string {
  if (value === null) return "";
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(
    value,
  );
}

export interface VariantDraft {
  key: string;
  brand: string;
  presentation: string;
  price: string;
}

export type VariantDraftErrors = Partial<
  Record<"brand" | "presentation" | "price", string>
>;

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function variantIdentity(brand: string, presentation: string): string {
  return `${normalizeText(brand).toLowerCase()}|${normalizeText(presentation).toLowerCase()}`;
}

export function validateVariantDraft(
  draft: Omit<VariantDraft, "key">,
  takenIdentities: ReadonlySet<string> = new Set(),
): { errors: VariantDraftErrors; data: CreateProductVariantRequest | null } {
  const errors: VariantDraftErrors = {};
  const brand = normalizeText(draft.brand);
  const presentation = normalizeText(draft.presentation);
  const price = parsePesos(draft.price);

  if (!brand) errors.brand = "Escribe la marca.";
  else if (brand.length > 80) errors.brand = "Máximo 80 caracteres.";
  if (!presentation) errors.presentation = "Escribe la presentación.";
  else if (presentation.length > 80)
    errors.presentation = "Máximo 80 caracteres.";
  if (price === null) errors.price = "Escribe el precio en pesos.";
  else if (price > MAX_VARIANT_PRICE_PESOS)
    errors.price = "El precio es demasiado alto.";

  if (
    !errors.brand &&
    !errors.presentation &&
    takenIdentities.has(variantIdentity(brand, presentation))
  ) {
    errors.presentation = "Ya existe esa marca con esa presentación.";
  }

  if (Object.keys(errors).length > 0 || price === null)
    return { errors, data: null };
  return { errors, data: { brand, presentation, price } };
}

export function takenVariantIdentities(
  variants: ReadonlyArray<
    Pick<ProductVariant, "id" | "brand" | "presentation">
  >,
  exceptId?: string,
): Set<string> {
  return new Set(
    variants
      .filter((variant) => variant.id !== exceptId)
      .map((variant) => variantIdentity(variant.brand, variant.presentation)),
  );
}

export interface ProductDraft {
  name: string;
  productCategoryId: string;
  description: string;
  isFeatured?: boolean;
}

export type ProductDraftErrors = Partial<Record<keyof ProductDraft, string>>;

export function validateProductDraft(draft: ProductDraft): {
  errors: ProductDraftErrors;
  data: {
    name: string;
    productCategoryId: string;
    description: string | null;
    isFeatured: boolean;
  } | null;
} {
  const errors: ProductDraftErrors = {};
  const name = normalizeText(draft.name);
  const description = draft.description.trim();

  if (name.length < 2) errors.name = "El nombre necesita al menos 2 letras.";
  else if (name.length > 120) errors.name = "Máximo 120 caracteres.";
  if (!draft.productCategoryId)
    errors.productCategoryId = "Elige una categoría.";
  if (description.length > 2000)
    errors.description = "Máximo 2.000 caracteres.";

  if (Object.keys(errors).length > 0) return { errors, data: null };
  return {
    errors,
    data: {
      name,
      productCategoryId: draft.productCategoryId,
      description: description || null,
      isFeatured: draft.isFeatured === true,
    },
  };
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    return "Usa una foto JPG, PNG o WebP.";
  if (file.size > MAX_IMAGE_BYTES) return "La foto pesa más de 5 MB.";
  return null;
}

const OPTIMIZED_IMAGE_HOST = "res.cloudinary.com";
const OPTIMIZED_IMAGE_PATH = "/exyhq5ry/";

export function isOptimizableImage(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === OPTIMIZED_IMAGE_HOST &&
      parsed.pathname.startsWith(OPTIMIZED_IMAGE_PATH)
    );
  } catch {
    return false;
  }
}
