import { describe, expect, it } from "vitest";

import { buildDashboardViewParams, isDashboardView } from "./dashboard-views";

const NOW = new Date("2026-12-09T15:00:00Z");

describe("buildDashboardViewParams", () => {
  it("cada vista consulta lo acordado", () => {
    expect(buildDashboardViewParams("pending", NOW)).toEqual({
      status: "PENDIENTE_DEPOSITO",
    });
    expect(buildDashboardViewParams("confirmed", NOW)).toEqual({
      status: "CONFIRMADA",
      from: "2026-12-09",
    });
    expect(buildDashboardViewParams("completed", NOW)).toEqual({
      status: "COMPLETADA",
      date: "2026-12-09",
    });
    expect(buildDashboardViewParams("cancelled", NOW)).toEqual({
      status: "CANCELADA",
      from: "2026-12-09",
      cancellationSources: "ADMIN,TIMEOUT",
    });
  });

  it("valida el parámetro view de la URL", () => {
    expect(isDashboardView("confirmed")).toBe(true);
    expect(isDashboardView("otra")).toBe(false);
    expect(isDashboardView(null)).toBe(false);
  });
});
