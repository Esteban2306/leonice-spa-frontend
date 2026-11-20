import { describe, expect, it } from "vitest";

import {
  contentDraftFrom,
  contentFromDraft,
  contentListTooLong,
} from "./treatment-content";

const treatment = {
  id: "t",
  categoryId: "c",
  name: "Alisado",
  isActive: true,
  requiresPriorAssessment: true,
  hasHairVariablePricing: false,
  basePriceMin: null,
  basePriceMax: null,
  baseDurationMinMinutes: 240,
  baseDurationMaxMinutes: 240,
  results: "Liso y brillante",
  benefits: ["Orgánico"],
};

describe("ficha del servicio en el panel", () => {
  it("cada renglón es un punto de la lista y lo vacío se borra", () => {
    const draft = {
      ...contentDraftFrom(treatment),
      results: "  90 % liso, dura de 5 a 6 meses ",
      benefits: "Orgánico\n\n Sin formol ",
      aftercare: "",
    };
    expect(contentFromDraft(draft)).toMatchObject({
      results: "90 % liso, dura de 5 a 6 meses",
      benefits: ["Orgánico", "Sin formol"],
      aftercare: [],
      tagline: null,
    });
  });

  it("avisa si una lista pasa de 12 renglones", () => {
    const draft = {
      ...contentDraftFrom(treatment),
      benefits: Array.from({ length: 13 }, (_, i) => `b${i}`).join("\n"),
    };
    expect(contentListTooLong(draft)).toBe(true);
    expect(contentListTooLong(contentDraftFrom(treatment))).toBe(false);
  });
});
