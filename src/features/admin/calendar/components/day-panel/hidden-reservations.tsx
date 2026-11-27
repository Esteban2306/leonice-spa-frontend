"use client";

import { useState } from "react";

import { describeReservationStatus } from "@/src/features/admin/utils/reservation-status.utils";

import type { CalendarReservation } from "../../types/calendar.types";
import type { DayPanelHandlers } from "./panel-handlers";
import { ReservationCard } from "./reservation-card";

interface HiddenReservationsProps extends DayPanelHandlers {
  reservations: readonly CalendarReservation[];
  selectedReservationId: string | null;
  onSelectReservation: (reservationId: string | null) => void;
}

/** Canceladas y reprogramadas: no estorban, pero tampoco desaparecen. */
export function HiddenReservations({
  reservations,
  selectedReservationId,
  onSelectReservation,
  ...handlers
}: HiddenReservationsProps) {
  const [choice, setChoice] = useState<boolean | null>(null);
  const isOpen =
    choice ?? reservations.some((r) => r.id === selectedReservationId);
  const total = reservations.length;

  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setChoice(!isOpen)}
        className="min-h-11 cursor-pointer rounded-full border border-dashed border-secondary/30 px-4 font-sans text-sm text-secondary hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        {total === 1
          ? "1 cita cancelada o movida"
          : `${total} citas canceladas o movidas`}
        {isOpen ? " · ocultar" : " · ver"}
      </button>

      {isOpen &&
        reservations.map((reservation) => (
          <div key={reservation.id}>
            <span className="sr-only">
              {describeReservationStatus(
                reservation.status,
                reservation.cancellationSource,
              )}
            </span>
            <ReservationCard
              reservation={reservation}
              isSelected={reservation.id === selectedReservationId}
              belongsToCombo={false}
              onSelect={onSelectReservation}
              {...handlers}
            />
          </div>
        ))}
    </section>
  );
}
