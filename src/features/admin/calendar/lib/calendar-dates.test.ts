import { describe, expect, it } from "vitest";

import {
  fromDateKey,
  getBusinessToday,
  getVisibleRange,
  toDateKey,
} from "./calendar-dates";

describe("calendar-dates", () => {
  it("fromDateKey rechaza fechas imposibles", () => {
    expect(fromDateKey("2026-02-30")).toBeNull();
    expect(fromDateKey("no-es-fecha")).toBeNull();
    expect(toDateKey(fromDateKey("2026-12-09")!)).toBe("2026-12-09");
  });

  it("hoy del negocio usa Bogotá: 02:00Z del 10 sigue siendo el 9", () => {
    expect(toDateKey(getBusinessToday(new Date("2026-12-10T02:00:00Z")))).toBe(
      "2026-12-09",
    );
  });

  it("el rango del mes cubre las 6 semanas visibles (lunes a domingo)", () => {
    expect(getVisibleRange(new Date(2026, 11, 15), "month")).toEqual({
      from: "2026-11-30",
      to: "2027-01-10",
    });
  });

  it("el rango de la semana va de lunes a domingo", () => {
    expect(getVisibleRange(new Date(2026, 11, 9), "week")).toEqual({
      from: "2026-12-07",
      to: "2026-12-13",
    });
  });
});
