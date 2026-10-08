import type {
  CalendarReservation,
  ReservationGroup,
} from "../types/calendar.types";

export function groupReservations(
  reservations: readonly CalendarReservation[],
): ReservationGroup[] {
  const groups = new Map<string, ReservationGroup>();

  for (const reservation of reservations) {
    const key = reservation.comboId ?? reservation.id;
    const existing = groups.get(key);

    if (existing) {
      existing.reservations.push(reservation);
      existing.isCombo = true;
    } else {
      groups.set(key, {
        id: key,
        isCombo: false,
        reservations: [reservation],
      });
    }
  }

  return Array.from(groups.values());
}
