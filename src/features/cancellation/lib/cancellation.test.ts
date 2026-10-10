import { describe, expect, it } from "vitest";

import type { CancellationLinkDetails } from "../types";
import {
  availableScopes,
  buildCancelRequest,
  composeReason,
  formatDayKey,
  formatExpiry,
  reservationStatusLabel,
  whatsappLink,
} from "./cancellation";

function details(
  reservations: Array<{ id: string; cancellable: boolean }>,
  linkReservationId = "r1",
): CancellationLinkDetails {
  return {
    clientFirstName: "Daniela",
    date: "2026-10-11",
    expiresAt: "2026-10-12T05:00:00.000Z",
    linkReservationId,
    reservations: reservations.map(({ id, cancellable }) => ({
      reservationId: id,
      treatment: "Alisado",
      scheduledStart: "2026-10-11T13:00:00.000Z",
      scheduledEnd: "2026-10-11T17:00:00.000Z",
      status: "CONFIRMADA",
      cancellable,
    })),
  };
}

describe("availableScopes", () => {
  it("ofrece una cita o todo el día cuando hay varias cancelables", () => {
    expect(
      availableScopes(
        details([
          { id: "r1", cancellable: true },
          { id: "r2", cancellable: true },
        ]),
      ),
    ).toEqual(["SINGLE", "DAY"]);
  });

  it("solo la cita del enlace cuando es la única", () => {
    expect(
      availableScopes(
        details([
          { id: "r1", cancellable: true },
          { id: "r2", cancellable: false },
        ]),
      ),
    ).toEqual(["SINGLE"]);
  });

  it("solo el día cuando la cita del enlace ya no se puede cancelar", () => {
    expect(
      availableScopes(
        details([
          { id: "r1", cancellable: false },
          { id: "r2", cancellable: true },
        ]),
      ),
    ).toEqual(["DAY"]);
  });

  it("nada cuando no queda ninguna cancelable", () => {
    expect(
      availableScopes(details([{ id: "r1", cancellable: false }])),
    ).toEqual([]);
  });
});

describe("solicitud y motivo", () => {
  it("une el motivo rápido con la nota y lo omite si está vacío", () => {
    expect(composeReason("Quiero otra fecha", "  la próxima semana ")).toBe(
      "Quiero otra fecha. la próxima semana",
    );
    expect(composeReason(null, "   ")).toBeUndefined();
  });

  it("ancla la cancelación a la reserva del enlace", () => {
    expect(
      buildCancelRequest(
        details([{ id: "r1", cancellable: true }]),
        "DAY",
        undefined,
      ),
    ).toEqual({
      scope: "DAY",
      reservationId: "r1",
    });
  });
});

describe("formatos", () => {
  it("arma el enlace de WhatsApp solo con un número válido", () => {
    expect(whatsappLink("+57 300 123 4567", "Hola")).toBe(
      "https://wa.me/573001234567?text=Hola",
    );
    expect(whatsappLink(undefined, "Hola")).toBeNull();
  });

  it("muestra el día en español", () => {
    expect(formatDayKey("2026-10-11")).toMatch(/domingo, 11 de octubre/);
  });
});

describe("textos de estado y vencimiento", () => {
  it("distingue citas canceladas de las que ya no se pueden cancelar", () => {
    expect(reservationStatusLabel("CANCELADA", false)).toBe("Cancelada");
    expect(reservationStatusLabel("CITA_EN_CURSO", false)).toBe(
      "Ya no se puede cancelar",
    );
    expect(reservationStatusLabel("CONFIRMADA", true)).toBe("Confirmada");
  });

  it("muestra el último minuto válido del enlace", () => {
    expect(formatExpiry("2026-10-12T05:00:00.000Z")).toMatch(
      /domingo, 11 de octubre a las 11:59/,
    );
  });
});
