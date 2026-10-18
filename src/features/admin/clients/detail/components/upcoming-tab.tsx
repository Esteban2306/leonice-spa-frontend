import { CalendarPlus } from "lucide-react";

import type { ReservationPanelHandlers } from "@/src/features/admin/dashboard/reservations-panel/panelHandlers";
import { ReservationPanelCard } from "@/src/features/admin/dashboard/reservations-panel/reservationPanelCard";
import type { DashboardReservation } from "@/src/features/admin/types/dashboard.types";

interface UpcomingTabProps extends ReservationPanelHandlers {
  reservations: readonly DashboardReservation[];
  isLoading: boolean;
  onNewReservation: () => void;
}

export function UpcomingTab({ reservations, isLoading, onNewReservation, ...handlers }: UpcomingTabProps) {
  if (isLoading && reservations.length === 0) {
    return <p className="py-10 text-center font-sans text-sm text-secondary/70">Cargando citas…</p>;
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-tertiary/40 py-12 text-center">
        <p className="font-sans text-sm text-secondary">No tiene citas próximas.</p>
        <button type="button" onClick={onNewReservation} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 font-sans text-sm text-primary hover:bg-secondary/90">
          <CalendarPlus className="size-4" />
          Agendar una cita
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reservations.map((reservation) => (
        <ReservationPanelCard key={reservation.groupKey} reservation={reservation} {...handlers} />
      ))}
    </div>
  );
}
