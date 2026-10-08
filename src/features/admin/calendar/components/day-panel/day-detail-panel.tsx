import { Info } from "lucide-react";

import { groupReservations } from "../../lib/group-reservations";
import type {
  CalendarReservation,
  ReservationActionHandlers,
} from "../../types/calendar.types";
import { DayPanelHeader } from "./day-panel-header";
import { ReservationGroupCard } from "./reservation-group-card";

interface DayDetailPanelProps extends ReservationActionHandlers {
  date: Date;
  reservations: readonly CalendarReservation[];
  selectedReservationId: string | null;
  onSelectReservation: (reservationId: string | null) => void;
}

export function DayDetailPanel({
  date,
  reservations,
  selectedReservationId,
  onSelectReservation,
  onViewClient,
  onReschedule,
  onCancel,
}: DayDetailPanelProps) {
  const groups = groupReservations(reservations);
  const professionals = Array.from(
    new Set(reservations.map((reservation) => reservation.professionalName)),
  );

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl md:rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB]">
      <DayPanelHeader
        date={date}
        reservationCount={reservations.length}
        professionals={professionals}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 md:p-4">
        {groups.length === 0 ? (
          <div className="flex min-h-64 flex-1 flex-col items-center justify-center text-center">
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-secondary/5">
              <Info className="size-4 text-secondary/50" />
            </span>

            <p className="font-sans text-sm text-secondary">
              No hay reservas para este día.
            </p>

            <p className="mt-1 max-w-52 font-sans text-xs text-secondary/50">
              Puedes seleccionar otro día del calendario.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <ReservationGroupCard
              key={group.id}
              group={group}
              selectedReservationId={selectedReservationId}
              onSelectReservation={onSelectReservation}
              onViewClient={onViewClient}
              onReschedule={onReschedule}
              onCancel={onCancel}
            />
          ))
        )}
      </div>
    </aside>
  );
}
