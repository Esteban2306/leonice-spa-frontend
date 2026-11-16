import { describe, expect, it } from "vitest";

import type { AdminProduct } from "@/src/features/admin/types/products.types";

import {
  itemsError,
  linesToList,
  ritualTotals,
  ritualVariantOptions,
  sameItems,
  searchVariantOptions,
  validateRitualDraft,
  type RitualDraftItem,
} from "./ritual-catalog";

const item = (
  variantId: string,
  unitPricePesos: number,
  quantity = 1,
): RitualDraftItem => ({
  variantId,
  productId: `p-${variantId}`,
  productName: `Producto ${variantId}`,
  brand: "Amazônica",
  presentation: "300 ml",
  unitPricePesos,
  imageUrl: null,
  quantity,
});

const product = (overrides: Partial<AdminProduct>): AdminProduct => ({
  id: "p1",
  kind: "SINGLE",
  productCategoryId: "c1",
  name: "Shampoo Hair Therapy",
  description: null,
  tagline: null,
  purpose: null,
  benefits: [],
  howToUse: [],
  idealFor: [],
  usageFrequency: null,
  precautions: [],
  isActive: true,
  isFeatured: false,
  createdAt: "2026-11-16T00:00:00.000Z",
  updatedAt: "2026-11-16T00:00:00.000Z",
  variants: [
    {
      id: "v1",
      productId: "p1",
      brand: "Amazônica",
      presentation: "300 ml",
      price: "80000.00",
      imageUrl: null,
      imagePublicId: null,
      isActive: true,
      createdAt: "2026-11-16T00:00:00.000Z",
    },
  ],
  category: { id: "c1", name: "Amazônica", isActive: true },
  tagAssignments: [],
  _count: { viewLogs: 0, recommendations: 0 },
  ritual: null,
  includedInRituals: [],
  ...overrides,
});

describe("ritualTotals", () => {
  it("suma por cantidad y calcula el ahorro del precio fijo", () => {
    expect(
      ritualTotals(
        [item("a", 80000), item("b", 80000), item("c", 90000)],
        215000,
      ),
    ).toEqual({
      units: 3,
      separatePricePesos: 250000,
      savingsPesos: 35000,
      savingsPercent: 14,
    });
  });

  it("sin precio todavía no muestra ahorro", () => {
    const totals = ritualTotals([item("a", 40000, 2)], null);
    expect(totals.separatePricePesos).toBe(80000);
    expect(totals.savingsPesos).toBeNull();
  });

  it("detecta cuando el Ritual cuesta más que por separado", () => {
    expect(ritualTotals([item("a", 50000)], 60000).savingsPesos).toBe(-10000);
  });
});

describe("ritualVariantOptions", () => {
  it("solo ofrece presentaciones activas de productos normales activos", () => {
    const options = ritualVariantOptions([
      product({}),
      product({ id: "p2", isActive: false }),
      product({ id: "r1", kind: "COMBO" }),
      product({
        id: "p3",
        name: "Mascarilla",
        variants: [
          {
            id: "v3",
            productId: "p3",
            brand: "Amazônica",
            presentation: "300 ml",
            price: "90000",
            imageUrl: null,
            imagePublicId: null,
            isActive: false,
            createdAt: "2026-11-16T00:00:00.000Z",
          },
        ],
      }),
    ]);
    expect(options.map((option) => option.variantId)).toEqual(["v1"]);
    expect(options[0].unitPricePesos).toBe(80000);
  });
});

describe("searchVariantOptions", () => {
  const options = [item("a", 1), item("b", 1)].map((option, index) => ({
    ...option,
    productName: index === 0 ? "Shampoo Hair Therapy" : "Máscara Açaí",
  }));

  it("busca sin tildes y por varias palabras", () => {
    expect(
      searchVariantOptions(options, "mascara acai", new Set()).map(
        (option) => option.variantId,
      ),
    ).toEqual(["b"]);
  });

  it("no repite lo que ya está en el Ritual", () => {
    expect(searchVariantOptions(options, "", new Set(["a"]))).toHaveLength(1);
  });
});

describe("validateRitualDraft", () => {
  it("exige nombre, precio y al menos dos productos", () => {
    const { errors, data } = validateRitualDraft({
      name: " ",
      price: "",
      items: [item("a", 1)],
    });
    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(["items", "name", "price"]);
  });

  it("entrega el pedido listo con precio en pesos", () => {
    expect(
      validateRitualDraft({
        name: "Ritual  Hair Therapy",
        price: "215.000",
        items: [item("a", 1, 2), item("b", 1)],
      }).data,
    ).toEqual({
      name: "Ritual Hair Therapy",
      price: 215000,
      items: [
        { variantId: "a", quantity: 2 },
        { variantId: "b", quantity: 1 },
      ],
    });
  });
});

describe("utilidades", () => {
  it("itemsError limita entre 2 y 10", () => {
    expect(itemsError([item("a", 1), item("b", 1)])).toBeNull();
    expect(
      itemsError(Array.from({ length: 11 }, (_, i) => item(String(i), 1))),
    ).not.toBeNull();
  });

  it("sameItems compara orden y cantidad", () => {
    expect(sameItems([item("a", 1)], [item("a", 1)])).toBe(true);
    expect(sameItems([item("a", 1)], [item("a", 1, 2)])).toBe(false);
  });

  it("linesToList descarta renglones vacíos", () => {
    expect(linesToList(" Menos caída \n\n Raíz sin grasa ")).toEqual([
      "Menos caída",
      "Raíz sin grasa",
    ]);
  });
});
