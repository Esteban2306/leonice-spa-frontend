import { describe, expect, it } from "vitest";

import { tunnelHeaders } from "@/src/lib/api/tunnel-headers";

describe("tunnelHeaders", () => {
  it("evita la página de aviso de ngrok en los túneles de desarrollo", () => {
    const expected = { "ngrok-skip-browser-warning": "1" };
    expect(tunnelHeaders("https://affair-snarl-regulator.ngrok-free.dev/api/v1")).toEqual(expected);
    expect(tunnelHeaders("https://abc.ngrok-free.app/api/v1")).toEqual(expected);
    expect(tunnelHeaders("https://abc.ngrok.io/api/v1")).toEqual(expected);
  });

  it("no añade nada a las APIs reales ni a URLs inválidas", () => {
    expect(tunnelHeaders("https://api.leonice.com/api/v1")).toEqual({});
    expect(tunnelHeaders("http://localhost:3920/api/v1")).toEqual({});
    expect(tunnelHeaders("https://evil-ngrok.dev.example.com/api/v1")).toEqual({});
    expect(tunnelHeaders("no es una url")).toEqual({});
  });
});
