import { describe, expect, it } from "vitest";

import {
  DEFAULT_FILTERS,
  buildTreatmentParams,
  countActiveFilters,
  endOfBogotaDay,
  formatDuration,
  formatDurationRange,
  formatPriceRange,
  formatPesosInput,
  groupTreatmentsByCategory,
  hairPriceRange,
  promotionState,
  promotionsForTreatment,
  startOfBogotaDay,
  thousandsToPesosInput,
  toBogotaDateKey,
} from "./catalog";
import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";
import type { Promotion } from "@/src/features/admin/types/promotions.types";

describe("formatos del catálogo", () => {
  it("muestra la duración en horas y minutos", () => {
    expect(formatDuration(90)).toBe("1 h 30 min");
    expect(formatDuration(180)).toBe("3 h");
    expect(formatDuration(45)).toBe("45 min");
  });

  it("colapsa rangos iguales y acepta extremos vacíos", () => {
    expect(formatDurationRange(150, 150)).toBe("2 h 30 min");
    expect(formatDurationRange(120, 180)).toBe("2 h – 3 h");
    expect(formatDurationRange(null, 60)).toBe("1 h");
    expect(formatDurationRange(null, null)).toBeNull();
  });

  it("formatea precios que el backend entrega en miles de COP", () => {
    expect(formatPriceRange("35.00", "35.00")).toMatch(/35\.000/);
    expect(formatPriceRange("250.00", "380.00")).toMatch(/250\.000.*380\.000/);
    expect(formatPriceRange(null, null)).toBeNull();
  });

  it("convierte miles a pesos para los campos del formulario", () => {
    expect(thousandsToPesosInput("75.00")).toBe("75.000");
    expect(thousandsToPesosInput(null)).toBe("");
  });
});

describe("buildTreatmentParams", () => {
  it("envía solo los filtros activos y convierte pesos a miles", () => {
    const params = buildTreatmentParams({
      ...DEFAULT_FILTERS,
      q: "  uñas ",
      hasActivePromotion: true,
      priceMinPesos: "60.000",
      durationMax: "150",
      sort: "price-desc",
    });

    expect(params).toEqual({
      q: "uñas",
      status: "ACTIVE",
      hasActivePromotion: true,
      hasHairVariablePricing: undefined,
      requiresPriorAssessment: undefined,
      hasPrice: undefined,
      priceMin: 60,
      priceMax: undefined,
      durationMin: undefined,
      durationMax: 150,
      sortBy: "price",
      sortOrder: "desc",
    });
  });

  it("no busca con una sola letra", () => {
    expect(
      buildTreatmentParams({ ...DEFAULT_FILTERS, q: "u" }).q,
    ).toBeUndefined();
  });

  it("cuenta los filtros aplicados", () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(
      countActiveFilters({
        ...DEFAULT_FILTERS,
        status: "ALL",
        withoutPrice: true,
        priceMaxPesos: "80000",
      }),
    ).toBe(3);
  });
});

describe("promociones", () => {
  const base = {
    isActive: true,
    startsAt: "2026-10-01T05:00:00.000Z",
    endsAt: "2026-10-31T04:59:59.000Z",
  };
  const now = new Date("2026-10-09T15:00:00Z").getTime();

  it("clasifica la vigencia", () => {
    expect(promotionState(base, now)).toBe("CURRENT");
    expect(promotionState({ ...base, isActive: false }, now)).toBe("INACTIVE");
    expect(
      promotionState({ ...base, startsAt: "2026-11-01T05:00:00.000Z" }, now),
    ).toBe("UPCOMING");
    expect(
      promotionState({ ...base, endsAt: "2026-10-05T04:59:59.000Z" }, now),
    ).toBe("EXPIRED");
  });

  it("incluye promociones del servicio y de toda su categoría", () => {
    const promo = (
      id: string,
      treatmentId: string | null,
      categoryId: string | null,
    ) => ({ id, treatmentId, categoryId }) as Promotion;
    const promotions = [
      promo("p1", "t1", null),
      promo("p2", null, "nails"),
      promo("p3", "t2", null),
      promo("p4", null, "hair"),
    ];

    expect(
      promotionsForTreatment(promotions, { id: "t1", categoryId: "nails" }).map(
        (p) => p.id,
      ),
    ).toEqual(["p1", "p2"]);
  });

  it("arma el día completo en hora de Bogotá", () => {
    expect(startOfBogotaDay("2026-10-09")).toBe("2026-10-09T00:00:00-05:00");
    expect(endOfBogotaDay("2026-10-09")).toBe("2026-10-09T23:59:59-05:00");
    expect(toBogotaDateKey("2026-10-10T04:00:00.000Z")).toBe("2026-10-09");
  });
});

describe("hairPriceRange", () => {
  it("usa la tabla por cabello cuando está activa", () => {
    const range = hairPriceRange({
      hasHairVariablePricing: true,
      hairLengthPricing: [
        { hairLength: "CORTO", price: "40.00", durationMinutes: 60 },
        { hairLength: "LARGO", price: "60.00", durationMinutes: 90 },
      ],
      hairColorSurcharges: [
        { hairColor: "CLARO", surcharge: "10.00", extraDurationMinutes: 15 },
      ],
    } as never);

    expect(range).toEqual({
      priceMin: 40,
      priceMax: 70,
      minutesMin: 60,
      minutesMax: 105,
    });
  });

  it("no aplica sin la bandera o sin filas", () => {
    expect(
      hairPriceRange({
        hasHairVariablePricing: false,
        hairLengthPricing: [],
        hairColorSurcharges: [],
      } as never),
    ).toBeNull();
  });

  it("agrupa miles al escribir montos", () => {
    expect(formatPesosInput("40000")).toBe("40.000");
    expect(formatPesosInput("1.250.000")).toBe("1.250.000");
    expect(formatPesosInput("")).toBe("");
  });
});

describe("groupTreatmentsByCategory", () => {
  it("agrupa conservando el orden recibido", () => {
    const t = (id: string, categoryId: string) =>
      ({ id, categoryId }) as AdminTreatment;
    const groups = groupTreatmentsByCategory([
      t("a", "nails"),
      t("b", "hair"),
      t("c", "nails"),
    ]);

    expect(groups.get("nails")?.map((x) => x.id)).toEqual(["a", "c"]);
    expect(groups.get("hair")?.map((x) => x.id)).toEqual(["b"]);
  });
});
