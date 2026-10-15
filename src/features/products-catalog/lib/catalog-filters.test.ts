import { describe, expect, it } from "vitest";

import {
  activeFilterCount,
  EMPTY_FILTERS,
  readFilters,
  toApiQuery,
  toSearchParams,
  toggleTag,
} from "@/src/features/products-catalog/lib/catalog-filters";

describe("readFilters", () => {
  it("lee filtros válidos de la URL y descarta los inválidos", () => {
    const filters = readFilters(
      new URLSearchParams("categoria=shampoo&necesidad=brillo,Frizz!,control-de-frizz&min=20000&max=abc&orden=price-desc&q=aceite"),
    );
    expect(filters).toEqual({
      category: "shampoo",
      tags: ["brillo", "control-de-frizz"],
      q: "aceite",
      minPrice: 20000,
      maxPrice: null,
      sort: "price-desc",
    });
  });

  it("usa el orden destacado cuando no reconoce el valor", () => {
    expect(readFilters(new URLSearchParams("orden=raro")).sort).toBe("featured");
  });
});

describe("serialización", () => {
  const filters = { ...EMPTY_FILTERS, tags: ["brillo", "grasa"], maxPrice: 50000, sort: "name" as const };

  it("escribe la URL en español y omite lo vacío", () => {
    expect(toSearchParams(filters).toString()).toBe("necesidad=brillo%2Cgrasa&max=50000&orden=name");
    expect(toSearchParams(EMPTY_FILTERS).toString()).toBe("");
  });

  it("arma la consulta del API", () => {
    expect(toApiQuery(filters)).toBe("?tags=brillo%2Cgrasa&maxPrice=50000&sort=name");
    expect(toApiQuery(EMPTY_FILTERS)).toBe("");
  });

  it("alterna etiquetas y cuenta filtros activos", () => {
    const next = toggleTag(filters, "brillo");
    expect(next.tags).toEqual(["grasa"]);
    expect(activeFilterCount(next)).toBe(2);
    expect(toggleTag(next, "frizz").tags).toEqual(["grasa", "frizz"]);
  });
});
