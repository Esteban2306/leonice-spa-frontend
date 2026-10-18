import { describe, expect, it } from "vitest";

import {
  countMissingPhotos,
  moveId,
  normalizeTestimonialValues,
  validateTestimonial,
} from "./testimonial-form";

const valid = {
  authorName: "M.R.",
  quote: "Hoy vuelvo a sentir mi cabello como mío.",
  treatmentName: "Terapia anticaída",
};

describe("validateTestimonial", () => {
  it("acepta datos válidos", () => {
    expect(validateTestimonial(valid)).toEqual({});
  });

  it("mide la longitud después de limpiar espacios, igual que el backend", () => {
    expect(
      validateTestimonial({ ...valid, authorName: "  M  " }).authorName,
    ).toBeDefined();
    expect(
      validateTestimonial({ ...valid, quote: "   corta   " }).quote,
    ).toBeDefined();
    expect(
      validateTestimonial({ ...valid, treatmentName: "   " }).treatmentName,
    ).toBeDefined();
  });

  it("limita la frase a 500 caracteres", () => {
    expect(
      validateTestimonial({ ...valid, quote: "a".repeat(500) }).quote,
    ).toBeUndefined();
    expect(
      validateTestimonial({ ...valid, quote: "a".repeat(501) }).quote,
    ).toBeDefined();
  });
});

describe("normalizeTestimonialValues", () => {
  it("recorta y colapsa espacios", () => {
    expect(
      normalizeTestimonialValues({
        authorName: "  M.R.  ",
        quote: "a   b",
        treatmentName: " x  y ",
      }),
    ).toEqual({ authorName: "M.R.", quote: "a b", treatmentName: "x y" });
  });
});

describe("moveId", () => {
  it("intercambia con el vecino", () => {
    expect(moveId(["a", "b", "c"], "b", -1)).toEqual(["b", "a", "c"]);
    expect(moveId(["a", "b", "c"], "b", 1)).toEqual(["a", "c", "b"]);
  });

  it("no mueve fuera de los extremos ni ids desconocidos", () => {
    expect(moveId(["a", "b"], "a", -1)).toBeNull();
    expect(moveId(["a", "b"], "b", 1)).toBeNull();
    expect(moveId(["a", "b"], "z", 1)).toBeNull();
  });
});

describe("countMissingPhotos", () => {
  it("cuenta los testimonios a los que les falta alguna foto", () => {
    expect(
      countMissingPhotos([
        { beforeImageUrl: "x", afterImageUrl: "y" },
        { beforeImageUrl: "x", afterImageUrl: null },
        { beforeImageUrl: null, afterImageUrl: null },
      ]),
    ).toBe(2);
  });
});
