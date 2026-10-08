import { CalendarSearch } from "lucide-react";

import { formatBogotaDayLabel, formatBogotaTime } from "@/src/lib/date/bogota";
import type { AvailabilityDay } from "@/src/features/admin/types/reservations.types";

import { describeServices, totalDuration } from "../../lib/booking";
import type { BookingClient, BookingSetup } from "../../types/calendar.types";
import {
  BookingClientForm,
  type BookingClientSearch,
  type NewClientValues,
} from "./booking-client-form";
import { BookingRescheduleConfirm } from "./booking-reschedule-confirm";
import { BookingSlots } from "./booking-slots";

interface BookingPanelProps {
  booking: BookingSetup;
  date: Date;
  day: AvailabilityDay | null;
  selectedSlotIso: string | null;
  clientSearch: BookingClientSearch;
  isSubmitting: boolean;
  onSelectSlot: (iso: string) => void;
  onCreate: (client: BookingClient | null, values: NewClientValues) => void;
  onReschedule: (notifyClient: boolean) => void;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const SECTION_LABEL =
  "font-sans text-xs uppercase tracking-[0.16em] text-secondary/50";

export function BookingPanel({
  booking,
  date,
  day,
  selectedSlotIso,
  clientSearch,
  isSubmitting,
  onSelectSlot,
  onCreate,
  onReschedule,
}: BookingPanelProps) {
  const hasDay = Boolean(day?.available);
  const isReschedule = booking.mode === "reschedule";

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-tertiary/30 bg-[#FCF6EB] md:rounded-[2rem]">
      <header className="bg-secondary p-4 text-primary md:p-6">
        <p className="font-sans text-xs uppercase tracking-[0.18em] text-quaternary">
          {isReschedule ? "Reagendar" : "Agendar"} ·{" "}
          {totalDuration(booking.services)} min
        </p>
        <h2 className="mt-1 font-heading text-xl md:text-2xl">
          {describeServices(booking.services)}
        </h2>
        <p
          className={`mt-2 font-sans text-sm text-primary/70 ${hasDay ? "capitalize" : ""}`}
        >
          {hasDay
            ? DATE_FORMATTER.format(date)
            : "Selecciona un día habilitado"}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
        {!hasDay && (
          <div className="flex min-h-48 flex-1 flex-col items-center justify-center text-center">
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-secondary/5">
              <CalendarSearch className="size-4 text-secondary/50" />
            </span>
            <p className="font-sans text-sm text-secondary">
              Los días en verde tienen horario para lo que quieres agendar.
            </p>
            <p className="mt-1 max-w-60 font-sans text-xs text-secondary/50">
              Los demás están deshabilitados: cerrados, sin cupo o fuera del
              plazo de reserva.
            </p>
          </div>
        )}

        {hasDay && day && (
          <section className="flex flex-col gap-2">
            <p className={SECTION_LABEL}>Horario de inicio</p>
            <BookingSlots
              slots={day.slots}
              selectedIso={selectedSlotIso}
              onSelect={onSelectSlot}
            />
          </section>
        )}

        {hasDay && selectedSlotIso && !isReschedule && (
          <section className="flex flex-col gap-2">
            <p className={SECTION_LABEL}>Cliente</p>
            <BookingClientForm
              presetClient={booking.client}
              search={clientSearch}
              isSubmitting={isSubmitting}
              onSubmit={onCreate}
            />
          </section>
        )}

        {hasDay && selectedSlotIso && isReschedule && booking.reservation && (
          <section className="flex flex-col gap-2">
            <p className={SECTION_LABEL}>Confirmar</p>
            <BookingRescheduleConfirm
              fromLabel={`${formatBogotaDayLabel(booking.reservation.scheduledStart)} · ${formatBogotaTime(booking.reservation.scheduledStart)}`}
              toLabel={`${formatBogotaDayLabel(selectedSlotIso)} · ${formatBogotaTime(selectedSlotIso)}`}
              isSubmitting={isSubmitting}
              onConfirm={onReschedule}
            />
          </section>
        )}
      </div>
    </aside>
  );
}
