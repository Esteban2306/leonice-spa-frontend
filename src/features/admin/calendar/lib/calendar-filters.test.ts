import { describe, expect, it } from "vitest";

import type { CalendarReservation } from "../types/calendar.types";
import { buildCalendarFilters, matchesFilters } from "./calendar-filters";

const base: CalendarReservation = {
  id: "r1",
  comboGroupId: null,
  dateKey: "2026-12-09",
  clientId: "c1",
  clientName: "Ana Pérez",
  phone: "+573001234567",
  treatmentId: "t1",
  treatmentName: "Pedespa",
  categoryId: "cat-nails",
  categoryName: "Uñas",
  startsAt: "2026-12-09T13:00:00.000Z",
  endsAt: "2026-12-09T14:00:00.000Z",
  start: "8:00 a. m.",
  end: "9:00 a. m.",
  durationMinutes: 60,
  status: "CONFIRMADA",
  price: 85,
  depositStatus: "CONFIRMADO",
  depositAmount: 20,
  proofUrl: null,
  isProofUnderReview: false,
  depositExpiresAt: null,
  checkedInAt: null,
  cancellationSource: null,
  cancellationReason: null,
};

const row = (overrides: Partial<CalendarReservation>) => ({
  ...base,
  ...overrides,
});

describe("buildCalendarFilters", () => {
  it("incluye estados, categorías reales y filtros de atención", () => {
    const ids = buildCalendarFilters([
      { id: "cat-nails", name: "Uñas", isPrincipal: false, isActive: true },
    ]).map((f) => f.id);
    expect(ids).toContain("status:CONFIRMADA");
    expect(ids).toContain("category:cat-nails");
    expect(ids).toContain("attention:proof-review");
  });
});

describe("matchesFilters", () => {
  it("sin filtros oculta canceladas y muestra el resto", () => {
    expect(matchesFilters(row({}), [])).toBe(true);
    expect(matchesFilters(row({ status: "CANCELADA" }), [])).toBe(false);
  });

  it("el filtro Canceladas las muestra", () => {
    expect(
      matchesFilters(row({ status: "CANCELADA" }), ["status:CANCELADA"]),
    ).toBe(true);
  });

  it("OR dentro del grupo y AND entre grupos", () => {
    const filters = [
      "status:CONFIRMADA",
      "status:COMPLETADA",
      "category:cat-hair",
    ];
    expect(matchesFilters(row({}), filters)).toBe(false);
    expect(matchesFilters(row({ categoryId: "cat-hair" }), filters)).toBe(true);
    expect(
      matchesFilters(
        row({ categoryId: "cat-hair", status: "COMPLETADA" }),
        filters,
      ),
    ).toBe(true);
  });

  it("filtros de atención: comprobante por revisar y combos", () => {
    expect(matchesFilters(row({}), ["attention:proof-review"])).toBe(false);
    expect(
      matchesFilters(row({ isProofUnderReview: true }), [
        "attention:proof-review",
      ]),
    ).toBe(true);
    expect(
      matchesFilters(row({ comboGroupId: "g1" }), ["attention:combo"]),
    ).toBe(true);
  });

  it("la búsqueda encuentra por nombre, tratamiento o dígitos del teléfono", () => {
    expect(matchesFilters(row({}), [], "ana")).toBe(true);
    expect(matchesFilters(row({}), [], "pedes")).toBe(true);
    expect(matchesFilters(row({}), [], "300 123")).toBe(true);
    expect(matchesFilters(row({}), [], "laura")).toBe(false);
  });
});
