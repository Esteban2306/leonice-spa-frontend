import { describe, expect, it } from "vitest";

import type {
  AdminProduct,
  ProductVariant,
} from "@/src/features/admin/types/products.types";

import {
  coverImage,
  formatPriceRangePesos,
  hasHistory,
  isOptimizableImage,
  isMissingPhoto,
  parsePesos,
  priceRangePesos,
  productTotals,
  takenVariantIdentities,
  validateImageFile,
  validateProductDraft,
  validateVariantDraft,
} from "./product-catalog";

const variant = (overrides: Partial<ProductVariant> = {}): ProductVariant => ({
  id: "v1",
  productId: "p1",
  brand: "MAIS",
  presentation: "250 ml",
  price: "45000",
  imageUrl: null,
  imagePublicId: null,
  isActive: true,
  createdAt: "2026-10-14T00:00:00.000Z",
  ...overrides,
});

const product = (overrides: Partial<AdminProduct> = {}): AdminProduct => ({
  id: "p1",
  productCategoryId: "c1",
  name: "Shampoo reparador",
  description: null,
  isActive: true,
  isFeatured: false,
  createdAt: "2026-10-14T00:00:00.000Z",
  updatedAt: "2026-10-14T00:00:00.000Z",
  variants: [variant()],
  category: { id: "c1", name: "Capilar", isActive: true },
  tagAssignments: [],
  _count: { viewLogs: 0, recommendations: 0 },
  ...overrides,
});

describe("rango de precio", () => {
  it("ignora variantes inactivas y formatea en pesos", () => {
    const range = priceRangePesos(
      product({
        variants: [
          variant({ id: "a", price: "45000" }),
          variant({ id: "b", price: "118000.00" }),
          variant({ id: "c", price: "999999", isActive: false }),
        ],
      }),
    );
    expect(range).toEqual({ min: 45000, max: 118000 });
    expect(formatPriceRangePesos(range)?.replace(/\s/g, " ")).toBe(
      "$ 45.000 – $ 118.000",
    );
  });

  it("devuelve null sin variantes activas", () => {
    expect(priceRangePesos(product({ variants: [] }))).toBeNull();
  });
});

describe("fotos", () => {
  it("usa la primera foto activa como portada", () => {
    const p = product({
      variants: [
        variant({ id: "a", imageUrl: "https://x/inactiva", isActive: false }),
        variant({ id: "b", imageUrl: "https://x/activa" }),
      ],
    });
    expect(coverImage(p)).toBe("https://x/activa");
  });

  it("marca como sin foto si alguna variante activa no tiene", () => {
    expect(
      isMissingPhoto(
        product({
          variants: [
            variant({ id: "a", imageUrl: "https://x" }),
            variant({ id: "b" }),
          ],
        }),
      ),
    ).toBe(true);
    expect(isMissingPhoto(product({ variants: [] }))).toBe(false);
  });
});

it("cuenta totales solo sobre productos activos para los avisos", () => {
  const totals = productTotals([
    product({ id: "1" }),
    product({ id: "2", variants: [] }),
    product({ id: "3", isActive: false }),
  ]);
  expect(totals).toEqual({
    active: 2,
    inactive: 1,
    missingPhoto: 1,
    noVariants: 1,
  });
});

it("detecta historial por vistas o recomendaciones", () => {
  expect(hasHistory(product())).toBe(false);
  expect(
    hasHistory(product({ _count: { viewLogs: 0, recommendations: 2 } })),
  ).toBe(true);
});

describe("parsePesos", () => {
  it("acepta puntos de miles y signos", () => {
    expect(parsePesos("$ 45.000")).toBe(45000);
    expect(parsePesos("")).toBeNull();
    expect(parsePesos("abc")).toBeNull();
  });
});

describe("validateVariantDraft", () => {
  it("normaliza espacios y devuelve el precio en pesos", () => {
    const result = validateVariantDraft({
      brand: "  MAIS ",
      presentation: "250   ml",
      price: "45.000",
    });
    expect(result.data).toEqual({
      brand: "MAIS",
      presentation: "250 ml",
      price: 45000,
    });
  });

  it("rechaza una marca y presentación ya usada sin importar mayúsculas", () => {
    const taken = takenVariantIdentities([
      { id: "v1", brand: "MAIS", presentation: "250 ml" },
    ]);
    const result = validateVariantDraft(
      { brand: "mais", presentation: "250 ML", price: "1" },
      taken,
    );
    expect(result.data).toBeNull();
    expect(result.errors.presentation).toBeDefined();
  });

  it("permite conservar el nombre al editar la misma variante", () => {
    const taken = takenVariantIdentities(
      [{ id: "v1", brand: "MAIS", presentation: "250 ml" }],
      "v1",
    );
    expect(
      validateVariantDraft(
        { brand: "MAIS", presentation: "250 ml", price: "50000" },
        taken,
      ).data,
    ).not.toBeNull();
  });

  it("exige marca, presentación y precio", () => {
    const result = validateVariantDraft({
      brand: "",
      presentation: " ",
      price: "",
    });
    expect(Object.keys(result.errors).sort()).toEqual([
      "brand",
      "presentation",
      "price",
    ]);
  });
});

describe("validateProductDraft", () => {
  it("convierte la descripción vacía en null", () => {
    expect(
      validateProductDraft({
        name: " Shampoo ",
        productCategoryId: "c1",
        description: "   ",
      }).data,
    ).toEqual({
      name: "Shampoo",
      productCategoryId: "c1",
      description: null,
      isFeatured: false,
    });
  });

  it("conserva si el producto se destaca en la landing", () => {
    expect(
      validateProductDraft({
        name: "Shampoo",
        productCategoryId: "c1",
        description: "",
        isFeatured: true,
      }).data?.isFeatured,
    ).toBe(true);
  });

  it("pide nombre y categoría", () => {
    const { errors } = validateProductDraft({
      name: "a",
      productCategoryId: "",
      description: "",
    });
    expect(errors.name).toBeDefined();
    expect(errors.productCategoryId).toBeDefined();
  });
});

it("valida tipo y peso de la foto", () => {
  const file = (type: string, size: number) =>
    ({ type, size }) as unknown as File;
  expect(validateImageFile(file("image/png", 1000))).toBeNull();
  expect(validateImageFile(file("image/gif", 1000))).toMatch(/JPG/);
  expect(validateImageFile(file("image/jpeg", 6 * 1024 * 1024))).toMatch(
    /5 MB/,
  );
});

it("solo optimiza imágenes del Cloudinary del spa", () => {
  expect(
    isOptimizableImage(
      "https://res.cloudinary.com/exyhq5ry/image/upload/v1/leonice-spa/products/a.png",
    ),
  ).toBe(true);
  expect(isOptimizableImage("https://ejemplo.com/shampoo.jpg")).toBe(false);
  expect(isOptimizableImage("no es url")).toBe(false);
});
