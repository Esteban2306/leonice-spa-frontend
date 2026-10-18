import { describe, expect, it } from "vitest";

import { isPlausibleEmail, normalizeEmail } from "./email";

describe("email helpers", () => {
  it("normaliza espacios y mayúsculas como lo hace el backend", () => {
    expect(normalizeEmail("  Equipo@Leonice.CO ")).toBe("equipo@leonice.co");
  });

  it.each(["recepcion@gmail.com", "a.b+avisos@leonice.co"])("acepta %s", (email) => {
    expect(isPlausibleEmail(email)).toBe(true);
  });

  it.each(["", "recepcion", "recepcion@", "@gmail.com", "a b@gmail.com", "a@gmail.c", `${"a".repeat(250)}@x.co`])(
    "rechaza %s",
    (email) => {
      expect(isPlausibleEmail(email)).toBe(false);
    },
  );
});
