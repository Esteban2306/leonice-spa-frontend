import type { GroupedReservation } from "../types/reservations.types";

export interface ReservationSignal {
  kind: "NEW_PENDING" | "NEW_PROOF";
  reservationId: string;
  clientName: string;
  treatmentName: string;
  scheduledStart: string;
}

export interface SignalSnapshot {
  pendingIds: ReadonlySet<string>;
  proofIds: ReadonlySet<string>;
}

export function takeSignalSnapshot(groups: readonly GroupedReservation[]): SignalSnapshot {
  const pendingIds = new Set<string>();
  const proofIds = new Set<string>();

  for (const group of groups) {
    for (const item of group.items) {
      pendingIds.add(item.reservationId);
      if (item.isProofUnderReview) proofIds.add(item.reservationId);
    }
  }

  return { pendingIds, proofIds };
}

export function detectReservationSignals(
  previous: SignalSnapshot,
  groups: readonly GroupedReservation[],
): ReservationSignal[] {
  const signals: ReservationSignal[] = [];

  for (const group of groups) {
    for (const item of group.items) {
      const base = {
        reservationId: item.reservationId,
        clientName: group.client.name,
        treatmentName: item.treatment.name,
        scheduledStart: item.scheduledStart,
      };

      if (!previous.pendingIds.has(item.reservationId)) {
        signals.push({ kind: "NEW_PENDING", ...base });
      } else if (item.isProofUnderReview && !previous.proofIds.has(item.reservationId)) {
        signals.push({ kind: "NEW_PROOF", ...base });
      }
    }
  }

  return signals;
}
