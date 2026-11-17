import { describe, expect, it } from "vitest";

import type { CatalogProductCard } from "@/src/features/products-catalog/api/catalog.types";

import { hasSavings, itemCountLabel, ritualOf, savingsLabel } from "./ritual-format";

const summary = { separatePricePesos: 250000, savingsPesos: 35000, savingsPercent: 14, itemCount: 3 };

describe("ritual-format", () => {
  it("solo reconoce el resumen en productos tipo Ritual", () => {
    expect(ritualOf({ kind: "ritual", ritual: summary } as CatalogProductCard)).toBe(summary);
    expect(ritualOf({ kind: "single", ritual: null } as CatalogProductCard)).toBeNull();
    expect(ritualOf({} as CatalogProductCard)).toBeNull();
  });

  it("no anuncia ahorro cuando no lo hay", () => {
    expect(hasSavings(summary)).toBe(true);
    expect(hasSavings({ ...summary, savingsPesos: 0 })).toBe(false);
    expect(hasSavings(null)).toBe(false);
  });

  it("formatea el ahorro y la cantidad", () => {
    expect(savingsLabel(summary)).toMatch(/Ahorras \$\s?35\.000 \(14 %\)/);
    expect(itemCountLabel(3)).toBe("Incluye 3 productos");
    expect(itemCountLabel(1)).toBe("Incluye 1 producto");
  });
});
