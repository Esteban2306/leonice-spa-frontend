import {
  formatBogotaDayLabel,
  formatBogotaTime,
  getBogotaDayKey,
} from "@/src/lib/date/bogota";

import type {
  DashboardReservation,
  DashboardReservationItem,
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

function mapItem(
  item: GroupedReservationItem,
  now: Date,
): DashboardReservationItem {
  const start = new Date(item.scheduledStart);
  const durationMs = new Date(item.scheduledEnd).getTime() - start.getTime();

  return {
    reservationId: item.reservationId,
    status: item.status,
    treatmentName: item.treatment.name,
    categoryLabel: item.category.name,
    durationMinutes: Math.round(durationMs / MS_PER_MINUTE),
    scheduledStart: item.scheduledStart,
    isToday: getBogotaDayKey(start) === getBogotaDayKey(now),
    isUpcoming: start.getTime() > now.getTime(),
    timeLabel: formatBogotaTime(item.scheduledStart),
    priceThousands: Number(item.finalPrice),
    proofUrl: item.latestDeposit?.imageUrl ?? null,
    proofStatus: resolveProofStatus(item),
    depositExpiresAt: item.depositExpiresAt,
    cancellationSource: item.cancellationSource,
    cancellationReason: item.cancellationReason,
  };
}

export function mapGroupedReservationToDashboard(
  group: GroupedReservation,
  now: Date = new Date(),
): DashboardReservation {
  const [firstItem] = group.items;

  return {
    groupKey: `${group.client.id}:${getBogotaDayKey(new Date(firstItem.scheduledStart))}`,
    clientId: group.client.id,
    client: {
      name: group.client.name,
      phone: group.client.phone,
    },
    dateLabel: formatBogotaDayLabel(firstItem.scheduledStart, now),
    isCombo: group.items.length > 1,
    items: group.items.map((item) => mapItem(item, now)),
  };
}
