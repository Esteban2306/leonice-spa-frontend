import { describe, expect, it } from "vitest";

import type { Promotion } from "@/src/features/admin/types/promotions.types";

import { countPromotionsByState, filterPromotions } from "./promotions-page";

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
    isActive: true,
    createdAt: "2026-10-01T00:00:00Z",
    treatment: null,
    category: { id: "c", name: "Uñas" },
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
