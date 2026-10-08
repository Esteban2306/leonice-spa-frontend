import { CalendarClock, CalendarPlus, LogOut, Pencil } from "lucide-react";

import { describeServices, totalDuration } from "../../lib/booking";
import type { BookingSetup } from "../../types/calendar.types";
import { ToolbarButton } from "../toolbar/toolbar-button";

interface BookingBannerProps {
  booking: BookingSetup;
  isLoading: boolean;
  onChangeServices: () => void;
  onExit: () => void;
}

export function BookingBanner({
  booking,
  isLoading,
  onChangeServices,
  onExit,
}: BookingBannerProps) {
  const isReschedule = booking.mode === "reschedule";
  const Icon = isReschedule ? CalendarClock : CalendarPlus;

  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] bg-secondary p-4 text-primary sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
          <Icon className="size-5 text-quaternary" strokeWidth={1.7} />
        </span>
        <div className="min-w-0">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-quaternary">
            {isReschedule
              ? `Reagendando a ${booking.reservation?.clientName ?? "cliente"}`
              : booking.client
                ? `Nueva reserva para ${booking.client.name}`
                : "Nueva reserva"}
          </p>
          <p className="mt-1 truncate font-heading text-xl">
            {describeServices(booking.services)}
          </p>
          <p className="mt-0.5 font-sans text-xs text-primary/65">
            {totalDuration(booking.services)} min ·{" "}
            {isLoading
              ? "Consultando disponibilidad…"
              : "Elige un día habilitado y luego el horario."}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {!isReschedule && (
          <ToolbarButton
            icon={Pencil}
            onClick={onChangeServices}
            className="border-primary/20 bg-transparent text-primary hover:bg-primary/10"
          >
            Cambiar servicios
          </ToolbarButton>
        )}
        <ToolbarButton
          icon={LogOut}
          onClick={onExit}
          className="border-primary/20 bg-primary text-secondary hover:bg-quaternary"
        >
          Salir
        </ToolbarButton>
      </div>
    </div>
  );
}
