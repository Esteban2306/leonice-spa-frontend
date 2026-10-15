export const TREATMENTS_ROOT = "/tratamientos";

export function categoryHref(categorySlug: string): string {
  return `${TREATMENTS_ROOT}/${categorySlug}`;
}

export function treatmentHref(categorySlug: string, treatmentSlug: string): string {
  return `${TREATMENTS_ROOT}/${categorySlug}/${treatmentSlug}`;
}

export const RITUAL_ID = "ritual";
