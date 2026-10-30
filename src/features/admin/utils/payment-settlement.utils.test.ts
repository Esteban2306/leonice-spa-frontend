import { describe, expect, it } from "vitest";

import {
  balanceDuePesos,
  collectedMatchesBalance,
  derivePaymentMethod,
} from "./payment-settlement.utils";

describe("balanceDuePesos", () => {
  it("resta el anticipo del precio", () => {
    expect(balanceDuePesos(250_000, 50_000)).toBe(200_000);
  });

  it("nunca es negativo", () => {
    expect(balanceDuePesos(100_000, 150_000)).toBe(0);
  });
});

describe("collectedMatchesBalance", () => {
  const base = { pricePesos: 250_000, advancePesos: 50_000 };

  it("acepta efectivo más transferencia que igualan el saldo", () => {
    expect(
      collectedMatchesBalance({
        ...base,
        cashPesos: 150_000,
        transferPesos: 50_000,
      }),
    ).toBe(true);
  });

  it("rechaza cobros que no cuadran", () => {
    expect(
      collectedMatchesBalance({
        ...base,
        cashPesos: 100_000,
        transferPesos: 0,
      }),
    ).toBe(false);
  });

  it("con el saldo en cero solo cuadra si no se cobra nada", () => {
    const paid = { pricePesos: 100_000, advancePesos: 100_000 };
    expect(
      collectedMatchesBalance({ ...paid, cashPesos: 0, transferPesos: 0 }),
    ).toBe(true);
    expect(
      collectedMatchesBalance({ ...paid, cashPesos: 1_000, transferPesos: 0 }),
    ).toBe(false);
  });
});

describe("derivePaymentMethod", () => {
  it("solo efectivo", () => {
    expect(
      derivePaymentMethod({
        advancePesos: 0,
        cashPesos: 100_000,
        transferPesos: 0,
      }),
    ).toBe("EFECTIVO");
  });

  it("solo transferencia", () => {
    expect(
      derivePaymentMethod({
        advancePesos: 0,
        cashPesos: 0,
        transferPesos: 100_000,
      }),
    ).toBe("TRANSFERENCIA");
  });

  it("el anticipo cuenta como transferencia: anticipo más efectivo es mixto", () => {
    expect(
      derivePaymentMethod({
        advancePesos: 50_000,
        cashPesos: 200_000,
        transferPesos: 0,
      }),
    ).toBe("MIXTO");
  });

  it("anticipo sin efectivo es transferencia", () => {
    expect(
      derivePaymentMethod({
        advancePesos: 50_000,
        cashPesos: 0,
        transferPesos: 200_000,
      }),
    ).toBe("TRANSFERENCIA");
  });
});
