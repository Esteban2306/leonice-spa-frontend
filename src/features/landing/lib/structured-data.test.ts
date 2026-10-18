import { describe, expect, it } from "vitest";

import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  productJsonLd,
  serviceJsonLd,
} from "./structured-data";

describe("localBusinessJsonLd", () => {
  it("describe el spa con dirección y coordenadas reales", () => {
    const data = localBusinessJsonLd(null);
    expect(data["@type"]).toBe("HairSalon");
    expect(data.address).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: "Granada",
      addressRegion: "Meta",
      addressCountry: "CO",
    });
    expect(data).not.toHaveProperty("openingHoursSpecification");
  });

  it("publica el horario solo cuando viene del sistema de reservas", () => {
    const data = localBusinessJsonLd({
      timeZone: "America/Bogota",
      days: [{ dayOfWeek: 1, windows: [{ opens: "08:00", closes: "12:00" }] }],
    });
    expect(data.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["https://schema.org/Monday"],
        opens: "08:00",
        closes: "12:00",
      },
    ]);
  });
});

describe("breadcrumbJsonLd", () => {
  it("numera las migas con URLs absolutas", () => {
    const data = breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Tratamientos", path: "/tratamientos" },
    ]);
    expect(data.itemListElement[1]).toMatchObject({ position: 2, name: "Tratamientos" });
    expect(data.itemListElement[1].item).toMatch(/^https?:\/\/.+\/tratamientos$/);
  });
});

describe("serviceJsonLd", () => {
  it("omite la oferta si el servicio no tiene precio publicado", () => {
    const data = serviceJsonLd({
      name: "Alisado",
      description: null,
      path: "/tratamientos/spa-capilar/alisado",
      categoryName: "Spa Capilar",
      image: null,
      priceFromPesos: null,
      priceToPesos: null,
    });
    expect(data).not.toHaveProperty("offers");
    expect(data).not.toHaveProperty("description");
  });

  it("publica el rango de precio en pesos", () => {
    const data = serviceJsonLd({
      name: "Alisado",
      description: "Reduce el frizz",
      path: "/tratamientos/spa-capilar/alisado",
      categoryName: "Spa Capilar",
      image: null,
      priceFromPesos: 250000,
      priceToPesos: 380000,
    });
    expect(data.offers?.priceSpecification).toEqual({
      "@type": "PriceSpecification",
      priceCurrency: "COP",
      minPrice: 250000,
      maxPrice: 380000,
    });
  });
});

describe("productJsonLd", () => {
  it("usa una oferta agregada con el rango de las variantes", () => {
    const data = productJsonLd({
      name: "Shampoo",
      description: null,
      path: "/productos/shampoo",
      image: null,
      brand: "MAIS",
      categoryName: "Shampoos",
      priceMinPesos: 45000,
      priceMaxPesos: 118000,
    });
    expect(data.offers).toMatchObject({ lowPrice: 45000, highPrice: 118000, priceCurrency: "COP" });
    expect(data.brand).toEqual({ "@type": "Brand", name: "MAIS" });
  });
});
