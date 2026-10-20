import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";


import { getFeaturedLandingProducts, getLandingCatalog } from "./landing-catalog";

const apiProduct = (overrides: Record<string, unknown> = {}) => ({
  id: "p1",
  name: "Shampoo reparador intensivo MAIS",
  slug: "shampoo-reparador-intensivo-mais",
  description: "Limpieza suave",
  isActive: true,
  isFeatured: true,
  category: { id: "c1", name: "Shampoos" },
  variants: [
    {
      id: "v1",
      brand: "MAIS",
      presentation: "250ml",
      price: "45000",
      imageUrl: null,
      isActive: true,
    },
  ],
  tagAssignments: [],
  ...overrides,
});

const respond = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) });

describe("getFeaturedLandingProducts", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test/api/v1");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("pide solo los destacados al backend", async () => {
    const fetchMock = respond([apiProduct()]);
    vi.stubGlobal("fetch", fetchMock);

    await getFeaturedLandingProducts();

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://api.test/api/v1/products?isFeatured=true",
    );
  });

  it("convierte los productos del backend al formato de la landing", async () => {
    vi.stubGlobal("fetch", respond([apiProduct()]));

    const [product] = await getFeaturedLandingProducts();

    expect(product).toMatchObject({
      id: "p1",
      slug: "shampoo-reparador-intensivo-mais",
      categoryName: "Shampoos",
    });
    expect(product.variants).toHaveLength(1);
    expect(product.variants[0].pricePesos).toBe(45000);
  });

  it("omite los productos desactivados", async () => {
    vi.stubGlobal(
      "fetch",
      respond([apiProduct(), apiProduct({ id: "p2", isActive: false })]),
    );

    const products = await getFeaturedLandingProducts();

    expect(products.map((product) => product.id)).toEqual(["p1"]);
  });

  it("no muestra productos inventados si no hay destacados", async () => {
    vi.stubGlobal("fetch", respond([]));

    expect(await getFeaturedLandingProducts()).toEqual([]);
  });

  it("no muestra productos inventados si el backend falla", async () => {
    vi.stubGlobal("fetch", respond({}, false));
    expect(await getFeaturedLandingProducts()).toEqual([]);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("caído")));
    expect(await getFeaturedLandingProducts()).toEqual([]);
  });
});

const apiTreatment = (name: string, price: number) => ({
  id: name,
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  isActive: true,
  requiresPriorAssessment: false,
  basePriceMin: price,
  basePriceMax: price,
  baseDurationMinMinutes: 60,
  baseDurationMaxMinutes: 60,
  category: { id: "c1", name: "Spa Capilar", slug: "spa-capilar" },
  activePromotion: null,
});

describe("getLandingCatalog: el alisado va primero", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test/api/v1");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("destaca el alisado primero en la landing aunque no sea el más barato", async () => {
    vi.stubGlobal(
      "fetch",
      respond([
        apiTreatment("Terapia de hidratación", 200),
        apiTreatment("Terapia antiácida", 150),
        apiTreatment("Alisado", 400),
      ]),
    );

    const catalog = await getLandingCatalog();

    expect(catalog.featured[0].name).toBe("Alisado");
  });

  it("el previo del navbar conserva el orden que manda el backend", async () => {
    vi.stubGlobal(
      "fetch",
      respond([
        apiTreatment("Alisado", 400),
        apiTreatment("Terapia de hidratación", 200),
        apiTreatment("Terapia antiácida", 150),
      ]),
    );

    const [category] = (await getLandingCatalog()).categories;

    expect(category.highlights.map((t) => t.name)).toEqual([
      "Alisado",
      "Terapia de hidratación",
      "Terapia antiácida",
    ]);
    expect(category.fromThousands).toBe(150);
  });
});
