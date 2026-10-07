import { formatBogotaDayLabel, formatBogotaTime } from "@/src/lib/date/bogota";

import {
  PendingReservation,
  PendingReservationItem,
  ProofStatus,
} from "../types/dashboard.types";

import type {
  GroupedReservation,
  GroupedReservationItem,
} from "../types/reservations.types";

const MS_PER_MINUTE = 60_000;

function resolveProofStatus(item: GroupedReservationItem): ProofStatus {
  if (item.isProofUnderReview) return "UNDER_REVIEW";

  switch (item.latestDeposit?.status) {
    case "RECHAZADO":
      return "REJECTED";
    case "CONFIRMADO":
      return "VERIFIED";
    default:
      return "NONE";
  }
}

function mapItem(item: GroupedReservationItem): PendingReservationItem {
  const durationMs =
    new Date(item.scheduledEnd).getTime() -
    new Date(item.scheduledStart).getTime();

  return {
    reservationId: item.reservationId,
    treatmentName: item.treatment.name,
    categoryLabel: item.category.name,
    durationMinutes: Math.round(durationMs / MS_PER_MINUTE),
    timeLabel: formatBogotaTime(item.scheduledStart),
    totalPrice: Number(item.finalPrice),
    proofUrl: item.latestDeposit?.imageUrl ?? null,
    proofStatus: resolveProofStatus(item),
    depositExpiresAt: item.depositExpiresAt,
  };
}

// Sin parámetros extra a propósito: se usa como callback de `.map()`, que
// pasaría el índice como segundo argumento.
export function mapGroupedReservationToPendingReservation(
  group: GroupedReservation,
): PendingReservation {
  const [firstItem] = group.items;

  return {
    clientId: group.client.id,
    client: {
      name: group.client.name,
      phone: group.client.phone,
    },
    dateLabel: formatBogotaDayLabel(firstItem.scheduledStart),
    items: group.items.map(mapItem),
  };
}
