import { describe, expect, it } from "vitest";

import {
  MODE_OPTIONS,
  VERDICT_LABELS,
  checklistView,
  reasonLabel,
  reasonsText,
} from "./verification-labels";

describe("verification-labels", () => {
  it("tiene un texto para cada veredicto que produce Conduit", () => {
    for (const verdict of [
      "VALID",
      "INVALID",
      "NEEDS_REVIEW",
      "UNREADABLE",
      "NOT_APPLICABLE",
      "ERROR",
    ]) {
      expect(VERDICT_LABELS[verdict]?.label).toBeTruthy();
    }
  });

  it("los motivos de las reglas del especialista tienen texto propio", () => {
    expect(reasonLabel("AMOUNT_GTE_FAILED")).toBe("Monto menor al anticipo");
    expect(reasonLabel("DESTINATION_WITHIN_FAILED")).toBe(
      "Cuenta distinta a la del spa",
    );
    expect(reasonLabel("DATE_WITHIN_DAYS_FAILED")).toBe("Comprobante antiguo");
  });

  it("un código desconocido no se muestra crudo", () => {
    expect(reasonLabel("ALGO_NUEVO_FAILED")).toBe("Otro motivo");
  });

  it("junta los motivos sin repetir y sin el de éxito cuando hay otros", () => {
    expect(
      reasonsText([
        "RULES_PASSED",
        "AMOUNT_GTE_FAILED",
        "DESTINATION_WITHIN_FAILED",
        "AMOUNT_GTE_FAILED",
      ]),
    ).toBe("Monto menor al anticipo · Cuenta distinta a la del spa");
  });

  it("si solo hay éxito, lo muestra; si no hay nada, un guion", () => {
    expect(reasonsText(["RULES_PASSED"])).toBe("Cumple todo");
    expect(reasonsText([])).toBe("—");
  });

  it("ofrece los tres modos en orden", () => {
    expect(MODE_OPTIONS.map((o) => o.mode)).toEqual([
      "OFF",
      "SHADOW",
      "ACTIVE",
    ]);
  });

  it("la lista de comprobación distingue ok, fallo y desconocido", () => {
    expect(checklistView({ key: "images", ok: true })).toMatchObject({
      state: "ok",
      hint: null,
    });
    expect(checklistView({ key: "images", ok: false })).toMatchObject({
      state: "fail",
    });
    const unknown = checklistView({ key: "runtime", ok: null });
    expect(unknown.state).toBe("unknown");
    expect(unknown.hint).toMatch(/versión anterior/);
  });

  it("todo punto que falla explica qué hacer", () => {
    for (const key of [
      "runtime",
      "images",
      "specialist",
      "model",
      "binding",
    ] as const) {
      expect(checklistView({ key, ok: false }).hint?.length).toBeGreaterThan(
        10,
      );
    }
  });
});
