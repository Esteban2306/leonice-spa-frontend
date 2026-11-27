import { describe, expect, it } from "vitest";

import { toAgreedPrices } from "./booking";

describe("precio de la cita en una reserva manual", () => {
  it("convierte lo escrito a pesos y omite los vacíos", () => {
    expect(toAgreedPrices({ a: "350.000", b: "", c: "$ 1.200.000" })).toEqual([
      { treatmentId: "a", price: 350000 },
      { treatmentId: "c", price: 1200000 },
    ]);
  });

  it("envía pesos enteros, no miles: la API hace la conversión", () => {
    expect(toAgreedPrices({ a: "35.500" })).toEqual([
      { treatmentId: "a", price: 35500 },
    ]);
  });

  it("descarta un precio por encima del límite", () => {
    expect(toAgreedPrices({ a: "99.999.999" })).toEqual([]);
  });
});
