import { describe, expect, it } from "vitest";

import type { PromoEvent } from "@/src/features/admin/types/promo-events.types";

import {
  canDraw,
  eventState,
  formatEventRange,
  sortEvents,
} from "./events-page";

const NOW = new Date("2026-11-17T15:00:00-05:00").getTime();

function event(overrides: Partial<PromoEvent> = {}): PromoEvent {
  return {
    id: "e1",
    name: "Rifa de aniversario",
    description: "Por cada visita recibes una boleta.",
    prizes: null,
    startsAt: "2026-11-10T00:00:00-05:00",
    endsAt: "2026-11-30T23:59:59-05:00",
    isActive: true,
    ticketsEnabled: true,
    ticketCount: 0,
    winnerCount: 0,
    ...overrides,
  };
}

describe("eventos en el panel", () => {
  it("clasifica el estado por fechas y por si está activo", () => {
    expect(eventState(event(), NOW)).toBe("CURRENT");
    expect(
      eventState(event({ startsAt: "2026-11-20T00:00:00-05:00" }), NOW),
    ).toBe("UPCOMING");
    expect(
      eventState(event({ endsAt: "2026-11-16T23:59:59-05:00" }), NOW),
    ).toBe("ENDED");
    expect(eventState(event({ isActive: false }), NOW)).toBe("INACTIVE");
  });

  it("muestra el rango en días de Bogotá", () => {
    expect(formatEventRange(event())).toBe("10 de nov al 30 de nov");
  });

  it("pone primero los vigentes", () => {
    const ended = event({ id: "a", endsAt: "2026-11-01T23:59:59-05:00" });
    const current = event({ id: "b" });
    expect(sortEvents([ended, current], NOW).map((e) => e.id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("solo deja sortear si hay boletas sin ganar", () => {
    expect(canDraw(event({ ticketCount: 0 }))).toBe(false);
    expect(canDraw(event({ ticketCount: 3, winnerCount: 1 }))).toBe(true);
    expect(canDraw(event({ ticketCount: 2, winnerCount: 2 }))).toBe(false);
    expect(canDraw(event({ ticketsEnabled: false, ticketCount: 3 }))).toBe(
      false,
    );
  });
});
