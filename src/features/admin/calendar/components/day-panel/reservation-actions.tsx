import { CircleUserRound, MessageCircle, RefreshCcw } from "lucide-react";

import type {
  CalendarReservation,
  ReservationActionHandlers,
} from "../../types/calendar.types";

interface ReservationActionsProps extends ReservationActionHandlers {
  reservation: CalendarReservation;
}

const SECONDARY_ACTION =
  "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-secondary/15 font-sans text-xs text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function ReservationActions({
  reservation,
  onViewClient,
  onReschedule,
  onCancel,
}: ReservationActionsProps) {
  const whatsappPhone = reservation.phone.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onViewClient(reservation.id)}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary font-sans text-sm text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        <CircleUserRound className="size-4" />
        Ver cliente en CRM
      </button>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/${whatsappPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY_ACTION}
        >
          <MessageCircle className="size-3.5" />
          WhatsApp
        </a>

        <button
          type="button"
          onClick={() => onReschedule(reservation.id)}
          className={SECONDARY_ACTION}
        >
          <RefreshCcw className="size-3.5" />
          Reprogramar
        </button>
      </div>

      <button
        type="button"
        onClick={() => onCancel(reservation.id)}
        className="cursor-pointer self-center font-sans text-xs text-red-700 underline underline-offset-4 transition-opacity hover:opacity-75"
      >
        Cancelar reserva
      </button>
    </div>
  );
}
