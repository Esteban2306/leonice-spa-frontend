import { describe, expect, it } from "vitest";

import { toAgreedPrices } from "./booking";

describe("precio de la cita en una reserva manual", () => {
  it("convierte lo escrito a pesos y omite los vacíos", () => {
    expect(toAgreedPrices({ a: "350.000", b: "", c: "$ 900.000" })).toEqual([
      { treatmentId: "a", price: 350000 },
      { treatmentId: "c", price: 900000 },
    ]);
  });

  it("envía pesos enteros, no miles: la API hace la conversión", () => {
    expect(toAgreedPrices({ a: "35.500" })).toEqual([
      { treatmentId: "a", price: 35500 },
    ]);
  });

  it("descarta los precios fuera de $1.000 a $1.000.000", () => {
    expect(
      toAgreedPrices({ a: "0", b: "999", c: "1.000.001", d: "99.999.999" }),
    ).toEqual([]);
    expect(toAgreedPrices({ a: "1.000", b: "1.000.000" })).toHaveLength(2);
    expect(toAgreedPrices({ a: "1.001" })[0]?.price).toBe(1001);
  });
});
