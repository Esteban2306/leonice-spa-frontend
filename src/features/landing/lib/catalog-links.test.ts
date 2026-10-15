import { describe, expect, it } from "vitest";

import {
  landingCategoryHref,
  landingProductHref,
  landingTreatmentHref,
} from "@/src/features/landing/lib/catalog-links";

describe("catalog links", () => {
  it("lleva a la página exacta cuando conoce el slug", () => {
    expect(landingTreatmentHref({ slug: "alisado", categorySlug: "spa-capilar" })).toBe(
      "/tratamientos/spa-capilar/alisado",
    );
    expect(landingCategoryHref({ slug: "unas" })).toBe("/tratamientos/unas");
    expect(landingProductHref({ slug: "perfume-capilar", name: "Perfume capilar" })).toBe(
      "/productos/perfume-capilar",
    );
  });

  it("cae en la página general cuando el dato viene sin slug", () => {
    expect(landingTreatmentHref({ slug: null, categorySlug: null })).toBe("/tratamientos");
    expect(landingTreatmentHref({ slug: null, categorySlug: "unas" })).toBe("/tratamientos/unas");
    expect(landingProductHref({ slug: null, name: "Aceite de vitaminas" })).toBe(
      "/productos?q=Aceite%20de%20vitaminas",
    );
  });
});
