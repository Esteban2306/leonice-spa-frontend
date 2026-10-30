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
      new URLSearchParams(
        "categoria=shampoo&necesidad=brillo,Frizz!,control-de-frizz&min=20000&max=abc&orden=price-desc&q=aceite",
      ),
    );
    expect(filters).toEqual({
      category: "shampoo",
      tags: ["brillo", "control-de-frizz"],
      q: "aceite",
      minPrice: 20000,
      maxPrice: null,
      sort: "price-desc",
      page: 1,
    });
  });

  it("lee la página y descarta valores inválidos", () => {
    expect(readFilters(new URLSearchParams("pagina=3")).page).toBe(3);
    expect(readFilters(new URLSearchParams("pagina=0")).page).toBe(1);
    expect(readFilters(new URLSearchParams("pagina=abc")).page).toBe(1);
  });

  it("usa el orden destacado cuando no reconoce el valor", () => {
    expect(readFilters(new URLSearchParams("orden=raro")).sort).toBe(
      "featured",
    );
  });
});

describe("serialización", () => {
  const filters = {
    ...EMPTY_FILTERS,
    tags: ["brillo", "grasa"],
    maxPrice: 50000,
    sort: "name" as const,
  };

  it("escribe la URL en español y omite lo vacío", () => {
    expect(toSearchParams(filters).toString()).toBe(
      "necesidad=brillo%2Cgrasa&max=50000&orden=name",
    );
    expect(toSearchParams(EMPTY_FILTERS).toString()).toBe("");
    expect(toSearchParams({ ...EMPTY_FILTERS, page: 2 }).toString()).toBe(
      "pagina=2",
    );
  });

  it("arma la consulta del API", () => {
    expect(toApiQuery(filters)).toBe(
      "?tags=brillo%2Cgrasa&maxPrice=50000&sort=name&page=1&pageSize=18",
    );
    expect(toApiQuery(EMPTY_FILTERS)).toBe("?page=1&pageSize=18");
    expect(toApiQuery({ ...EMPTY_FILTERS, page: 3 })).toBe(
      "?page=3&pageSize=18",
    );
  });

  it("alterna etiquetas y cuenta filtros activos", () => {
    const next = toggleTag(filters, "brillo");
    expect(next.tags).toEqual(["grasa"]);
    expect(activeFilterCount(next)).toBe(2);
    expect(toggleTag(next, "frizz").tags).toEqual(["grasa", "frizz"]);
    expect(toggleTag({ ...filters, page: 4 }, "frizz").page).toBe(1);
  });
});
