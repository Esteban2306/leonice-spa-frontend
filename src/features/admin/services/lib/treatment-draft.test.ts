import { describe, expect, it } from "vitest";

import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";

import {
  draftFromTreatment,
  emptyTreatmentDraft,
  isDraftDirty,
  validateTreatmentDraft,
} from "./treatment-draft";

describe("validateTreatmentDraft", () => {
  it("convierte pesos a miles y completa el rango con un solo valor", () => {
    const { data, errors } = validateTreatmentDraft({
      ...emptyTreatmentDraft("nails"),
      name: " Uñas Dipping ",
      priceMinPesos: "65.000",
      durationMin: "150",
    });

    expect(errors).toEqual({});
    expect(data).toEqual({
      name: "Uñas Dipping",
      categoryId: "nails",
      requiresPriorAssessment: false,
      hasHairVariablePricing: false,
      basePriceMin: 65,
      basePriceMax: 65,
      baseDurationMinMinutes: 150,
      baseDurationMaxMinutes: 150,
    });
  });

  it("permite servicios sin precio publicado", () => {
    const { data } = validateTreatmentDraft({
      ...emptyTreatmentDraft("nails"),
      name: "Diseño a mano alzada",
      durationMin: "30",
    });

    expect(data).not.toHaveProperty("basePriceMin");
  });

  it("explica cada error de rango", () => {
    const { data, errors } = validateTreatmentDraft({
      ...emptyTreatmentDraft(),
      name: "A",
      priceMinPesos: "90000",
      priceMaxPesos: "60000",
      durationMin: "120",
      durationMax: "90",
    });

    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual([
      "categoryId",
      "duration",
      "name",
      "price",
    ]);
  });

  it("exige la duración", () => {
    const { errors } = validateTreatmentDraft({
      ...emptyTreatmentDraft("nails"),
      name: "Tradicional",
    });

    expect(errors.duration).toBeDefined();
  });
});

describe("draftFromTreatment", () => {
  it("muestra los montos en pesos y detecta cambios", () => {
    const draft = draftFromTreatment({
      name: "Permanente",
      categoryId: "nails",
      basePriceMin: "60.00",
      basePriceMax: "60.00",
      baseDurationMinMinutes: 90,
      baseDurationMaxMinutes: 90,
      requiresPriorAssessment: false,
      hasHairVariablePricing: false,
    } as AdminTreatment);

    expect(draft.priceMinPesos).toBe("60.000");
    expect(isDraftDirty(draft, { ...draft })).toBe(false);
    expect(isDraftDirty(draft, { ...draft, durationMin: "120" })).toBe(true);
  });
});
