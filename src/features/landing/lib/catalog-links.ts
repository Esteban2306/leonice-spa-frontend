import type {
  LandingCategory,
  LandingProduct,
  LandingTreatment,
} from "@/src/features/landing/content/landing-content";

export const TREATMENTS_PAGE = "/tratamientos";
export const PRODUCTS_PAGE = "/productos";

export function landingCategoryHref(category: Pick<LandingCategory, "slug">): string {
  return category.slug ? `${TREATMENTS_PAGE}/${category.slug}` : TREATMENTS_PAGE;
}

export function landingTreatmentHref(treatment: Pick<LandingTreatment, "slug" | "categorySlug">): string {
  if (treatment.slug && treatment.categorySlug) {
    return `${TREATMENTS_PAGE}/${treatment.categorySlug}/${treatment.slug}`;
  }
  return treatment.categorySlug ? `${TREATMENTS_PAGE}/${treatment.categorySlug}` : TREATMENTS_PAGE;
}

export function landingProductHref(product: Pick<LandingProduct, "slug" | "name">): string {
  return product.slug
    ? `${PRODUCTS_PAGE}/${product.slug}`
    : `${PRODUCTS_PAGE}?q=${encodeURIComponent(product.name)}`;
}
