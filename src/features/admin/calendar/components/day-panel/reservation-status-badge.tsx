import type { CalendarReservationStatus } from "../../types/calendar.types";

interface ReservationStatusBadgeProps {
  status: CalendarReservationStatus;
}

const BADGE: Record<
  CalendarReservationStatus,
  { label: string; className: string }
> = {
  CONFIRMADA: {
    label: "Confirmada",
    className: "bg-secondary text-primary",
  },
  AGENDADA: {
    label: "Agendada",
    className: "border border-tertiary/50 text-secondary",
  },
};

export function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const { label, className } = BADGE[status];

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 font-sans text-[11px] ${className}`}
    >
      {label}
    </span>
  );
}
