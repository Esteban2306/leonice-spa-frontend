import { describe, expect, it } from "vitest";

import { pageWindow } from "@/src/features/products-catalog/lib/catalog-pagination";

describe("pageWindow", () => {
  it("muestra todas las páginas cuando son pocas", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
  });

  it("agrupa con puntos suspensivos lo lejano al inicio y al final", () => {
    expect(pageWindow(1, 10)).toEqual([1, 2, "gap", 10]);
    expect(pageWindow(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10]);
    expect(pageWindow(10, 10)).toEqual([1, "gap", 9, 10]);
  });

  it("no deja huecos de una sola página", () => {
    expect(pageWindow(3, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(pageWindow(3, 7)).toEqual([1, 2, 3, 4, "gap", 7]);
  });
});
