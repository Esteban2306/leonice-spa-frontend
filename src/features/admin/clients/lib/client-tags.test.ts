import { describe, expect, it } from "vitest";

import {
  clientTagLabel,
  parseTagParam,
  sortClientTags,
  toggleTagKey,
} from "./client-tags";

describe("clientTagLabel", () => {
  it("añade el detalle a las etiquetas que lo llevan", () => {
    expect(clientTagLabel({ key: "FRECUENTA", detail: "Spa Coreano" })).toBe(
      "Frecuenta Spa Coreano",
    );
    expect(clientTagLabel({ key: "NUEVA", detail: "" })).toBe("Nueva");
  });
});

describe("sortClientTags", () => {
  it("pone primero las que más importan para decidir un envío", () => {
    const sorted = sortClientTags([
      { key: "EN_PAUSA", detail: "" },
      { key: "FRECUENTA", detail: "Spa Coreano" },
      { key: "APTA_PROMOCION", detail: "" },
    ]);
    expect(sorted.map((tag) => tag.key)).toEqual([
      "APTA_PROMOCION",
      "FRECUENTA",
      "EN_PAUSA",
    ]);
  });
});

describe("toggleTagKey y parseTagParam", () => {
  it("agrega y quita etiquetas del filtro", () => {
    expect(toggleTagKey([], "NUEVA")).toEqual(["NUEVA"]);
    expect(toggleTagKey(["NUEVA"], "NUEVA")).toEqual([]);
  });

  it("ignora valores desconocidos en la URL", () => {
    expect(parseTagParam("NUEVA,X,APTA_PROMOCION")).toEqual([
      "NUEVA",
      "APTA_PROMOCION",
    ]);
    expect(parseTagParam(null)).toEqual([]);
  });
});
