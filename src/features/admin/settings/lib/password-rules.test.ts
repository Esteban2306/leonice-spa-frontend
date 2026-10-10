import { describe, expect, it } from "vitest";

import { evaluatePassword } from "./password-rules";

describe("evaluatePassword", () => {
  it("exige las mismas reglas que el backend", () => {
    const result = evaluatePassword({
      current: "x",
      next: "leonice",
      confirmation: "leonice",
    });

    expect(result.rules.filter((r) => !r.passed).map((r) => r.key)).toEqual([
      "length",
      "upper",
      "number",
      "symbol",
    ]);
    expect(result.canSubmit).toBe(false);
  });

  it("permite guardar una clave fuerte, confirmada y distinta", () => {
    expect(
      evaluatePassword({
        current: "Vieja#2025",
        next: "Spa#Leonice26",
        confirmation: "Spa#Leonice26",
      }).canSubmit,
    ).toBe(true);
  });

  it("bloquea si la confirmación no coincide o repite la actual", () => {
    expect(
      evaluatePassword({
        current: "Spa#Leonice26",
        next: "Spa#Leonice26",
        confirmation: "Spa#Leonice26",
      }).isDifferent,
    ).toBe(false);
    expect(
      evaluatePassword({
        current: "a",
        next: "Spa#Leonice26",
        confirmation: "Spa#Leonice2",
      }).matches,
    ).toBe(false);
  });
});
