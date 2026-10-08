import type {
  CalendarReservation,
  ReservationActionHandlers,
} from "../../types/calendar.types";
import { ReservationActions } from "./reservation-actions";
import { ReservationDetails } from "./reservation-details";
import { ReservationStatusBadge } from "./reservation-status-badge";

interface ReservationCardProps extends ReservationActionHandlers {
  reservation: CalendarReservation;
  isSelected: boolean;
  showClientName?: boolean;
  onSelect: (reservationId: string | null) => void;
}

export function ReservationCard({
  reservation,
  isSelected,
  showClientName = true,
  onSelect,
  onViewClient,
  onReschedule,
  onCancel,
}: ReservationCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-[#FBF8F0] transition-colors ${
        isSelected ? "border-secondary" : "border-secondary/15"
      }`}
    >
      <button
        type="button"
        aria-expanded={isSelected}
        onClick={() => onSelect(isSelected ? null : reservation.id)}
        className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        <span className="block min-w-0">
          <span className="flex items-baseline gap-2">
            <span className="font-sans text-xl text-secondary">
              {reservation.start}
            </span>
            <span className="font-sans text-xs text-secondary/45">
              — {reservation.end}
            </span>
          </span>

          {showClientName && (
            <span className="mt-3 block truncate font-sans text-base text-secondary">
              {reservation.clientName}
            </span>
          )}

          <span
            className={`block font-sans text-sm text-secondary/60 ${
              showClientName ? "mt-1" : "mt-3"
            }`}
          >
            {reservation.treatmentName}
          </span>
        </span>

        <ReservationStatusBadge status={reservation.status} />
      </button>

      {isSelected && (
        <div className="flex flex-col gap-4 border-t border-secondary/10 p-4">
          <ReservationDetails reservation={reservation} />

          <ReservationActions
            reservation={reservation}
            onViewClient={onViewClient}
            onReschedule={onReschedule}
            onCancel={onCancel}
          />
        </div>
      )}
    </article>
  );
}
