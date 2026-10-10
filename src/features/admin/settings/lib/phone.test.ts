import { describe, expect, it } from "vitest";

import { formatPhone, initialsOf, isPlausiblePhone } from "./phone";

describe("phone helpers", () => {
  it("agrupa números colombianos", () => {
    expect(formatPhone("+573001234567")).toBe("+57 300 123 4567");
    expect(formatPhone("+15551234567")).toBe("+15551234567");
  });

  it("valida longitudes razonables", () => {
    expect(isPlausiblePhone("300 123 4567")).toBe(true);
    expect(isPlausiblePhone("12345")).toBe(false);
  });

  it("toma iniciales del nombre", () => {
    expect(initialsOf("Leonice Arenas")).toBe("LA");
    expect(initialsOf("  recepción ")).toBe("R");
    expect(initialsOf("Recepción (prueba)")).toBe("RP");
  });
});
