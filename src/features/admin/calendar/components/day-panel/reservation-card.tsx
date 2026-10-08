import { Ellipsis } from "lucide-react";

import { ReservationOptionsMenu } from "@/src/features/admin/components/reservation-actions/reservation-options-menu";

import type { CalendarReservation } from "../../types/calendar.types";
import type { DayPanelHandlers } from "./panel-handlers";
import { ReservationActions } from "./reservation-actions";
import { ReservationDetails } from "./reservation-details";
import { ReservationStatusBadge } from "./reservation-status-badge";

interface ReservationCardProps extends DayPanelHandlers {
  reservation: CalendarReservation;
  isSelected: boolean;
  belongsToCombo: boolean;
  showClientName?: boolean;
  onSelect: (reservationId: string | null) => void;
}

export function ReservationCard({
  reservation,
  isSelected,
  belongsToCombo,
  showClientName = true,
  onSelect,
  todayKey,
  nowMs,
  actions,
  onViewClient,
  onReschedule,
}: ReservationCardProps) {
  const isToday = reservation.dateKey === todayKey;
  const isUpcoming = new Date(reservation.startsAt).getTime() > nowMs;

  return (
    <article
      className={`rounded-2xl border bg-[#FBF8F0] transition-colors ${
        isSelected ? "border-secondary" : "border-secondary/15"
      }`}
    >
      <div className="flex items-start gap-1 pr-2">
        <button
          type="button"
          aria-expanded={isSelected}
          onClick={() => onSelect(isSelected ? null : reservation.id)}
          className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-3 rounded-2xl p-4 pr-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
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

          <ReservationStatusBadge
            status={reservation.status}
            cancellationSource={reservation.cancellationSource}
          />
        </button>

        <ReservationOptionsMenu
          target={{
            reservationId: reservation.id,
            status: reservation.status,
            isUpcoming,
            clientId: reservation.clientId,
            clientName: reservation.clientName,
            clientPhone: reservation.phone,
            treatmentName: reservation.treatmentName,
          }}
          actions={actions}
          onViewClient={onViewClient}
          onReschedule={onReschedule}
          trigger={
            <button
              type="button"
              className="mt-3.5 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/60 transition-colors hover:bg-secondary/5 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              <Ellipsis className="size-4" />
            </button>
          }
        />
      </div>

      {isSelected && (
        <div className="flex flex-col gap-4 border-t border-secondary/10 p-4">
          <ReservationDetails reservation={reservation} />

          <ReservationActions
            reservation={reservation}
            isToday={isToday}
            isUpcoming={isUpcoming}
            belongsToCombo={belongsToCombo}
            actions={actions}
            onViewClient={onViewClient}
            onReschedule={onReschedule}
          />
        </div>
      )}
    </article>
  );
}
