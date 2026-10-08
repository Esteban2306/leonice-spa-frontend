import type { ReservationStatus } from "@/src/features/admin/types/enums";
import { RESERVATION_STATUS_LABELS } from "@/src/features/admin/utils/reservation-status.utils";

import type { CalendarReservation } from "../../types/calendar.types";

interface DayPanelHeaderProps {
  date: Date;
  reservations: readonly CalendarReservation[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function countByStatus(
  reservations: readonly CalendarReservation[],
): Array<[ReservationStatus, number]> {
  const counts = new Map<ReservationStatus, number>();
  for (const reservation of reservations) {
    counts.set(reservation.status, (counts.get(reservation.status) ?? 0) + 1);
  }
  return Array.from(counts.entries());
}

export function DayPanelHeader({ date, reservations }: DayPanelHeaderProps) {
  const total = reservations.length;
  const breakdown = countByStatus(reservations);

  return (
    <header className="relative overflow-hidden bg-secondary p-4 text-primary md:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full border border-quaternary/20" />

      <div className="relative">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-quaternary">
            Reservas del día
          </p>

          <span className="rounded-full bg-primary/10 px-3 py-1 font-sans text-xs">
            {total} {total === 1 ? "reserva" : "reservas"}
          </span>
        </div>

        <h2 className="font-heading text-xl capitalize md:text-2xl">
          {DATE_FORMATTER.format(date)}
        </h2>

        {breakdown.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4">
            {breakdown.map(([status, count]) => (
              <span
                key={status}
                className="rounded-full bg-primary/10 px-2.5 py-1 font-sans text-[11px] text-primary/85"
              >
                {count} · {RESERVATION_STATUS_LABELS[status]}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
