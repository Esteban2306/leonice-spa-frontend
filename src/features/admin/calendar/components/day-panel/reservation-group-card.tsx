import type { ReservationGroup } from "../../types/calendar.types";
import type { DayPanelHandlers } from "./panel-handlers";
import { ReservationCard } from "./reservation-card";

interface ReservationGroupCardProps extends DayPanelHandlers {
  group: ReservationGroup;
  selectedReservationId: string | null;
  onSelectReservation: (reservationId: string | null) => void;
}

export function ReservationGroupCard({
  group,
  selectedReservationId,
  onSelectReservation,
  ...handlers
}: ReservationGroupCardProps) {
  const [first] = group.reservations;

  const cards = group.reservations.map((reservation) => (
    <ReservationCard
      key={reservation.id}
      reservation={reservation}
      isSelected={reservation.id === selectedReservationId}
      belongsToCombo={group.isCombo}
      showClientName={!group.isCombo}
      onSelect={onSelectReservation}
      {...handlers}
    />
  ));

  if (!group.isCombo) return cards[0];

  return (
    <section
      aria-label={`Combo de ${first.clientName}`}
      className="flex flex-col gap-2 rounded-2xl border border-dashed border-tertiary/50 p-2"
    >
      <header className="flex items-center justify-between px-2 pt-1">
        <span className="font-sans text-sm text-secondary">
          {first.clientName}
        </span>
        <span className="rounded-full bg-quaternary/40 px-3 py-1 font-sans text-[11px] text-secondary">
          Combo · {group.reservations.length} tratamientos
        </span>
      </header>

      {cards}
    </section>
  );
}
