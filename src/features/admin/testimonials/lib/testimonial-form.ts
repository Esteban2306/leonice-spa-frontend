import type { TestimonialPhotoSlot } from "../../types/testimonials.types";

export const TESTIMONIAL_LIMITS = {
  authorMin: 2,
  authorMax: 60,
  quoteMin: 10,
  quoteMax: 500,
  treatmentMin: 2,
  treatmentMax: 80,
} as const;

export const TESTIMONIAL_PHOTO = {
  width: 800,
  height: 1000,
  ratio: "4 / 5",
  ratioLabel: "4:5",
} as const;

export const PHOTO_SLOT_LABELS: Record<TestimonialPhotoSlot, string> = {
  before: "Antes",
  after: "Después",
};

export interface TestimonialFormValues {
  authorName: string;
  quote: string;
  treatmentName: string;
}

export type TestimonialFormErrors = Partial<
  Record<keyof TestimonialFormValues, string>
>;

const collapse = (value: string) => value.trim().replace(/\s+/g, " ");

export function normalizeTestimonialValues(
  values: TestimonialFormValues,
): TestimonialFormValues {
  return {
    authorName: collapse(values.authorName),
    quote: collapse(values.quote),
    treatmentName: collapse(values.treatmentName),
  };
}

export function validateTestimonial(
  values: TestimonialFormValues,
): TestimonialFormErrors {
  const clean = normalizeTestimonialValues(values);
  const errors: TestimonialFormErrors = {};
  if (clean.authorName.length < TESTIMONIAL_LIMITS.authorMin) {
    errors.authorName = "Escribe al menos 2 caracteres, por ejemplo M.R.";
  }
  if (clean.treatmentName.length < TESTIMONIAL_LIMITS.treatmentMin) {
    errors.treatmentName = "Indica el tratamiento que se hizo.";
  }
  if (clean.quote.length < TESTIMONIAL_LIMITS.quoteMin) {
    errors.quote = "Escribe al menos 10 caracteres.";
  } else if (clean.quote.length > TESTIMONIAL_LIMITS.quoteMax) {
    errors.quote = `Máximo ${TESTIMONIAL_LIMITS.quoteMax} caracteres.`;
  }
  return errors;
}

export function moveId(
  ids: readonly string[],
  id: string,
  delta: -1 | 1,
): string[] | null {
  const from = ids.indexOf(id);
  const to = from + delta;
  if (from === -1 || to < 0 || to >= ids.length) return null;
  const next = [...ids];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

export function countMissingPhotos(
  items: readonly {
    beforeImageUrl: string | null;
    afterImageUrl: string | null;
  }[],
): number {
  return items.filter((item) => !item.beforeImageUrl || !item.afterImageUrl)
    .length;
}
