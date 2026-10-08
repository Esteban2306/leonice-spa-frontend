import { describe, expect, it } from "vitest";

import type { GroupedReservation } from "../types/reservations.types";
import {
  detectReservationSignals,
  takeSignalSnapshot,
} from "./detect-reservation-signals";

const group = (
  items: Array<{ id: string; proof: boolean }>,
): GroupedReservation => ({
  isCombo: items.length > 1,
  comboGroupId: null,
  client: { id: "c1", name: "Ana", phone: "+573001234567" },
  items: items.map(({ id, proof }) => ({
    reservationId: id,
    treatment: { id: "t", name: "Pedespa" },
    category: { id: "k", name: "Uñas" },
    status: "PENDIENTE_DEPOSITO",
    scheduledStart: "2026-12-09T13:00:00.000Z",
    scheduledEnd: "2026-12-09T14:00:00.000Z",
    finalPrice: "85.00",
    latestDeposit: null,
    hasUnresolvedDeposit: true,
    isProofUnderReview: proof,
    depositExpiresAt: null,
    cancellationSource: null,
    cancellationReason: null,
    cancelledAt: null,
    checkedInAt: null,
  })),
});

describe("detectReservationSignals", () => {
  it("avisa reservas nuevas y comprobantes recién llegados, no lo ya visto", () => {
    const before = takeSignalSnapshot([group([{ id: "a", proof: false }])]);
    const signals = detectReservationSignals(before, [
      group([
        { id: "a", proof: true },
        { id: "b", proof: false },
      ]),
    ]);
    expect(signals.map((s) => `${s.kind}:${s.reservationId}`)).toEqual([
      "NEW_PROOF:a",
      "NEW_PENDING:b",
    ]);
  });

  it("sin cambios no hay señales", () => {
    const groups = [group([{ id: "a", proof: true }])];
    expect(detectReservationSignals(takeSignalSnapshot(groups), groups)).toEqual([]);
  });
});
