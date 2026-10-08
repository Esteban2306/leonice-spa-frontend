import type { CalendarReservation } from "../../types/calendar.types";

interface DayCellReservationProps {
  reservation: CalendarReservation;
  isOnSelectedDay: boolean;
}

export function DayCellReservation({
  reservation,
  isOnSelectedDay,
}: DayCellReservationProps) {
  return (
    <span
      className={`block w-full truncate rounded-md border-l-2 px-1.5 py-1 font-sans text-[11px] leading-tight ${
        isOnSelectedDay
          ? "border-quaternary bg-primary/10 text-primary"
          : "border-tertiary bg-quaternary/30 text-secondary"
      }`}
    >
      <span className="font-medium">{reservation.start}</span>{" "}
      {reservation.treatmentName}
    </span>
  );
}
