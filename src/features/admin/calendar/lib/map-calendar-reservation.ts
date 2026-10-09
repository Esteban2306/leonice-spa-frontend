import { formatBogotaTime, getBogotaDayKey } from "@/src/lib/date/bogota";
import type { CalendarApiReservation } from "@/src/features/admin/types/calendar.types";

import type { CalendarReservation } from "../types/calendar.types";

const MS_PER_MINUTE = 60_000;

export function mapCalendarReservation(
  reservation: CalendarApiReservation,
): CalendarReservation {
  const startsAt = new Date(reservation.scheduledStart);
  const endsAt = new Date(reservation.scheduledEnd);

  return {
    id: reservation.id,
    comboGroupId: reservation.comboGroupId,
    dateKey: getBogotaDayKey(startsAt),
    clientId: reservation.client.id,
    clientName: reservation.client.name,
    phone: reservation.client.phone,
    treatmentId: reservation.treatment.id,
    treatmentName: reservation.treatment.name,
    categoryId: reservation.category.id,
    categoryName: reservation.category.name,
    startsAt: reservation.scheduledStart,
    endsAt: reservation.scheduledEnd,
    start: formatBogotaTime(reservation.scheduledStart),
    end: formatBogotaTime(reservation.scheduledEnd),
    durationMinutes: Math.round(
      (endsAt.getTime() - startsAt.getTime()) / MS_PER_MINUTE,
    ),
    status: reservation.status,
    price: Number(reservation.finalPrice),
    depositStatus: reservation.deposit?.status ?? null,
    depositAmount:
      reservation.deposit?.amount != null
        ? Number(reservation.deposit.amount)
        : null,
    proofUrl: reservation.deposit?.imageUrl ?? null,
    isProofUnderReview: reservation.isProofUnderReview,
    depositExpiresAt: reservation.depositExpiresAt,
    checkedInAt: reservation.checkedInAt,
    cancellationSource: reservation.cancellationSource,
    cancellationReason: reservation.cancellationReason,
    assessment: reservation.assessment,
  };
}

export function mapCalendarReservations(
  reservations: readonly CalendarApiReservation[],
): CalendarReservation[] {
  return reservations
    .map(mapCalendarReservation)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
