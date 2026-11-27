import { describe, expect, it } from "vitest";

import type { CalendarReservation } from "../types/calendar.types";
import {
  canReschedule,
  describeDeadline,
  describeStage,
  receivedDeposit,
} from "./reservation-stage";

const NOW = Date.parse("2026-11-27T17:00:00.000Z");
const context = { todayKey: "2026-11-27", nowMs: NOW };

const reservation = (
  overrides: Partial<CalendarReservation>,
): CalendarReservation => ({
  id: "r",
  comboGroupId: null,
  dateKey: "2026-11-28",
  clientId: "c",
  clientName: "Clienta",
  dependentName: null,
  phone: "3000000000",
  treatmentId: "t",
  treatmentName: "Terapia",
  categoryId: "cat",
  categoryName: "Spa Capilar",
  startsAt: "2026-11-28T19:00:00.000Z",
  endsAt: "2026-11-28T21:00:00.000Z",
  start: "2:00 p. m.",
  end: "4:00 p. m.",
  durationMinutes: 120,
  status: "PENDIENTE_DEPOSITO",
  price: 200,
  depositStatus: null,
  depositAmount: null,
  proofUrl: null,
  isProofUnderReview: false,
  depositExpiresAt: null,
  checkedInAt: null,
  cancellationSource: null,
  cancellationReason: null,
  ...overrides,
});

const stage = (overrides: Partial<CalendarReservation>) =>
  describeStage(reservation(overrides), context);

const today = {
  dateKey: "2026-11-27",
  startsAt: "2026-11-27T19:00:00.000Z",
};

describe("siguiente paso de una cita", () => {
  it("la valoración va antes que el pago", () => {
    const result = stage({
      assessment: {
        state: "PENDING",
        reason: "HAIR_PRICING",
        hairProfileStatus: "MISSING",
      },
    });
    expect(result.primary).toBe("assess");
    expect(result.label).toBe("Falta valorar");
  });

  it("sin comprobante pide registrar el pago y avisa cuándo vence", () => {
    const result = stage({ depositExpiresAt: "2026-11-27T23:00:00.000Z" });
    expect(result.primary).toBe("register-payment");
    expect(result.label).toBe("Falta el pago");
    expect(result.next).toMatch(/Plazo: vence hoy 6:00/);
  });

  it("con comprobante por revisar pide aprobarlo", () => {
    const result = stage({ proofUrl: "x", isProofUnderReview: true });
    expect(result.primary).toBe("approve-proof");
  });

  it("confirmada: solo el día de la cita se registra la llegada", () => {
    expect(stage({ status: "CONFIRMADA", ...today }).primary).toBe("check-in");
    expect(stage({ status: "CONFIRMADA" }).primary).toBeNull();
    expect(stage({ status: "CONFIRMADA" }).next).toMatch(/^Nada por ahora/);
  });

  it("en curso se termina; terminada ya no pide nada", () => {
    expect(stage({ status: "CITA_EN_CURSO" }).primary).toBe("complete");
    const done = stage({ status: "COMPLETADA" });
    expect(done.primary).toBeNull();
    expect(done.next).toBe("No queda nada pendiente.");
  });

  it("solo se reactiva la cancelada por vencimiento que aún no pasa", () => {
    const expired = { status: "CANCELADA", cancellationSource: "TIMEOUT" } as const;
    expect(stage(expired).primary).toBe("revive");
    expect(stage({ ...expired, cancellationSource: "ADMIN" }).primary).toBeNull();
    expect(
      stage({ ...expired, startsAt: "2026-11-20T19:00:00.000Z" }).primary,
    ).toBeNull();
  });

  it("quien no llegó hoy todavía puede registrarse", () => {
    expect(stage({ status: "NO_SHOW", ...today }).primary).toBe(
      "check-in-late",
    );
    expect(stage({ status: "NO_SHOW" }).primary).toBeNull();
  });
});

describe("otros casos", () => {
  it("avisa de un comprobante rechazado", () => {
    expect(stage({ depositStatus: "RECHAZADO" }).label).toBe(
      "Comprobante rechazado",
    );
  });

  it("una confirmada que ya pasó no ofrece registrar la llegada", () => {
    const past = stage({
      status: "CONFIRMADA",
      dateKey: "2026-11-20",
      startsAt: "2026-11-20T19:00:00.000Z",
    });
    expect(past.primary).toBeNull();
    expect(past.label).toBe("Sin registrar llegada");
  });

  it("una reprogramada ya no pide nada", () => {
    expect(stage({ status: "REPROGRAMADA" }).primary).toBeNull();
  });
});

describe("anticipo y cambios de hora", () => {
  it("muestra el anticipo solo cuando está confirmado", () => {
    expect(
      receivedDeposit(
        reservation({ depositStatus: "CONFIRMADO", depositAmount: 50 }),
      ),
    ).toBe(50);
    expect(receivedDeposit(reservation({ depositAmount: 50 }))).toBeNull();
  });

  it("solo ofrece mover lo que la API deja mover", () => {
    expect(canReschedule(reservation({ status: "CONFIRMADA" }))).toBe(true);
    expect(canReschedule(reservation({}))).toBe(true);
    expect(
      canReschedule(reservation({ status: "PENDIENTE_VALORACION" })),
    ).toBe(false);
  });
});

describe("plazo del pago", () => {
  it("distingue hoy, mañana y vencido", () => {
    expect(describeDeadline("2026-11-28T15:00:00.000Z", NOW)).toMatch(
      /^vence mañana/,
    );
    expect(describeDeadline("2026-11-27T16:00:00.000Z", NOW)).toBe(
      "el plazo venció",
    );
  });
});
