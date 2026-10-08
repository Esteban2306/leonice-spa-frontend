import type { ReservationStatus } from "@/src/features/admin/types/enums";

import type { CalendarReservation } from "../../types/calendar.types";

interface DayCellReservationProps {
  reservation: CalendarReservation;
  isOnSelectedDay: boolean;
}

const ACCENT: Partial<Record<ReservationStatus, string>> = {
  PENDIENTE_DEPOSITO: "border-amber-500",
  CITA_EN_CURSO: "border-green-600",
  COMPLETADA: "border-green-800",
  NO_SHOW: "border-red-500",
  CANCELADA: "border-red-300",
};

export function DayCellReservation({
  reservation,
  isOnSelectedDay,
}: DayCellReservationProps) {
  const accent = ACCENT[reservation.status] ?? "border-tertiary";
  const isCancelled = reservation.status === "CANCELADA";

  return (
    <span
      className={`block w-full truncate rounded-md border-l-2 px-1.5 py-1 font-sans text-[11px] leading-tight ${accent} ${
        isOnSelectedDay
          ? "bg-primary/10 text-primary"
          : "bg-quaternary/30 text-secondary"
      } ${isCancelled ? "line-through opacity-60" : ""}`}
    >
      <span className="font-medium">{reservation.start}</span>{" "}
      {reservation.treatmentName}
    </span>
  );
}
