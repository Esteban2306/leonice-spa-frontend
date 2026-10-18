import { describe, expect, it } from "vitest";

import { safeAdminRedirect } from "./safe-redirect";

describe("safeAdminRedirect", () => {
  it("devuelve a la pantalla del panel donde estaba la sesión", () => {
    expect(safeAdminRedirect("/admin/clients?q=ana")).toBe("/admin/clients?q=ana");
    expect(safeAdminRedirect("/admin")).toBe("/admin");
  });

  it("usa el inicio del panel si no hay destino", () => {
    expect(safeAdminRedirect(null)).toBe("/admin");
    expect(safeAdminRedirect("")).toBe("/admin");
  });

  it.each([
    "https://evil.example/admin",
    "//evil.example/admin",
    "/\\evil.example",
    "javascript:alert(1)",
    "/productos",
    "/administrador",
    "/admin/login?redirect=/admin",
  ])("rechaza el destino %s", (target) => {
    expect(safeAdminRedirect(target)).toBe("/admin");
  });
});
