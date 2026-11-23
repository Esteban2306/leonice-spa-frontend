import { describe, expect, it } from "vitest";

import type { Promotion } from "@/src/features/admin/types/promotions.types";

import {
  countPromotionsByState,
  filterPromotions,
  filterPromotionsByDomain,
  promotionTargetLabel,
} from "./promotions-page";

const NOW = new Date("2026-11-10T12:00:00-05:00").getTime();

function promotion(overrides: Partial<Promotion>): Promotion {
  return {
    id: "p",
    name: "Promo",
    discountPercentage: "10",
    startsAt: "2026-11-01T00:00:00-05:00",
    endsAt: "2026-11-30T23:59:59-05:00",
    treatmentId: null,
    categoryId: "c",
    productId: null,
    productCategoryId: null,
    isActive: true,
    createdAt: "2026-10-01T00:00:00Z",
    treatment: null,
    category: { id: "c", name: "Spa Coreano" },
    ...overrides,
  };
}

const LIST = [
  promotion({ id: "current" }),
  promotion({
    id: "upcoming",
    startsAt: "2026-12-01T00:00:00-05:00",
    endsAt: "2026-12-10T00:00:00-05:00",
  }),
  promotion({
    id: "expired",
    startsAt: "2026-09-01T00:00:00-05:00",
    endsAt: "2026-09-10T00:00:00-05:00",
  }),
  promotion({ id: "off", isActive: false }),
];

describe("countPromotionsByState", () => {
  it("cuenta cada estado y el total", () => {
    expect(countPromotionsByState(LIST, NOW)).toEqual({
      ALL: 4,
      CURRENT: 1,
      UPCOMING: 1,
      EXPIRED: 1,
      INACTIVE: 1,
    });
  });
});

describe("filterPromotions", () => {
  it("filtra por estado y ordena de la más reciente a la más antigua", () => {
    expect(filterPromotions(LIST, "ALL", NOW).map((item) => item.id)).toEqual([
      "upcoming",
      "current",
      "off",
      "expired",
    ]);
    expect(
      filterPromotions(LIST, "CURRENT", NOW).map((item) => item.id),
    ).toEqual(["current"]);
  });
});

describe("promociones de productos en el panel", () => {
  const kit = promotion({
    id: "kit",
    categoryId: null,
    category: null,
    productId: "k1",
    product: {
      id: "k1",
      name: "Hidratante",
      kind: "COMBO",
      productCategoryId: "combos",
    },
  });
  const shampoo = promotion({
    id: "shampoo",
    categoryId: null,
    category: null,
    productId: "s1",
    product: {
      id: "s1",
      name: "Shampoo hidratante",
      kind: "SINGLE",
      productCategoryId: "cuidado",
    },
  });
  const brand = promotion({
    id: "brand",
    categoryId: null,
    category: null,
    productCategoryId: "amazonica",
    productCategory: { id: "amazonica", name: "Amazônica" },
  });
  const service = promotion({ id: "service" });

  it("dice a qué aplica cada promoción", () => {
    expect(promotionTargetLabel(kit)).toBe("Kit Hidratante");
    expect(promotionTargetLabel(shampoo)).toBe("Shampoo hidratante");
    expect(promotionTargetLabel(brand)).toBe(
      "Todos los productos de Amazônica",
    );
    expect(promotionTargetLabel(service)).toBe("Toda Spa Coreano");
  });

  it("separa las promociones de servicios de las de productos y kits", () => {
    const all = [kit, shampoo, brand, service];
    expect(filterPromotionsByDomain(all, "PRODUCTS").map((p) => p.id)).toEqual([
      "kit",
      "shampoo",
      "brand",
    ]);
    expect(filterPromotionsByDomain(all, "SERVICES").map((p) => p.id)).toEqual([
      "service",
    ]);
    expect(filterPromotionsByDomain(all, "ALL")).toHaveLength(4);
  });
});
