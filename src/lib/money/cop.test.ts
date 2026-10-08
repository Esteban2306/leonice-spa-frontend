import { describe, expect, it } from "vitest";

import { formatCopFromThousands, pesosToThousands } from "./cop";

describe("cop", () => {
  it("los precios del backend están en miles de pesos", () => {
    expect(formatCopFromThousands("380.00")).toMatch(/380\.000/);
  });

  it("convierte el monto digitado en pesos al formato del backend", () => {
    expect(pesosToThousands(50_000)).toBe(50);
    expect(pesosToThousands(12_345)).toBe(12.35);
  });
});
