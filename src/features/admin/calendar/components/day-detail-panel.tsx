import {
  CircleUserRound,
  Info,
  MessageCircle,
  MoreHorizontal,
  RefreshCcw,
} from "lucide-react";
import type { CalendarReservation } from "../types/calendar.types";

interface DayDetailPanelProps {
  date: Date;
  reservations: CalendarReservation[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DayDetailPanel({ date, reservations }: DayDetailPanelProps) {
  const dateLabel = DATE_FORMATTER.format(date);

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#062112]/10 bg-[#F7F2E8]">
      <header className="relative overflow-hidden bg-[#062112] p-6 text-[#F2EBDB]">
        <div className="absolute -right-10 -top-10 size-32 rounded-full border border-[#E0BC87]/20" />

        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E0BC87]">
              Reservas del día
            </p>

            <span className="rounded-full bg-[#F2EBDB]/10 px-3 py-1 text-xs">
              {reservations.length} reservas
            </span>
          </div>

          <h2 className="text-2xl capitalize">{dateLabel}</h2>

          <p className="mt-2 text-sm text-[#F2EBDB]/60">
            Agenda operativa · solo confirmadas y agendadas
          </p>

          <div className="mt-5 flex items-center gap-2">
            {reservations.slice(0, 4).map((reservation) => (
              <div
                key={reservation.id}
                className="grid size-8 place-items-center rounded-full bg-[#E0BC87] text-xs font-medium text-[#062112]"
                title={reservation.clientName}
              >
                {reservation.clientName
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            ))}

            <span className="ml-1 text-xs text-[#F2EBDB]/55">
              profesionales en turno
            </span>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {reservations.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="mb-3 grid size-10 place-items-center rounded-full bg-[#062112]/5">
              <Info className="size-4 text-[#062112]/50" />
            </div>

            <p className="text-sm text-[#062112]">
              No hay reservas para este día.
            </p>

            <p className="mt-1 max-w-52 text-xs text-[#062112]/50">
              Puedes seleccionar otro día del calendario.
            </p>
          </div>
        ) : (
          reservations.map((reservation, index) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              expanded={index === 0}
            />
          ))
        )}
      </div>

      <div className="border-t border-[#062112]/10 p-4">
        <div className="flex items-center gap-2 rounded-md border border-dashed border-[#BF9250]/50 px-3 py-2.5 text-xs text-[#062112]/55">
          <Info className="size-3.5 shrink-0" />
          Solo se muestran reservas confirmadas y agendadas.
        </div>
      </div>
    </aside>
  );
}

interface ReservationCardProps {
  reservation: CalendarReservation;
  expanded: boolean;
}

function ReservationCard({ reservation, expanded }: ReservationCardProps) {
  return (
    <article className="rounded-xl border border-[#062112]/15 bg-[#FBF8F0] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl text-[#062112]">{reservation.start}</span>

            <span className="text-xs text-[#062112]/45">
              — {reservation.end}
            </span>
          </div>

          <h3 className="mt-3 text-base text-[#062112]">
            {reservation.clientName}
          </h3>

          <p className="mt-1 text-sm text-[#062112]/60">
            {reservation.treatmentName}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] ${
            reservation.status === "CONFIRMADA"
              ? "bg-[#062112] text-[#F2EBDB]"
              : "border border-[#BF9250]/50 text-[#062112]"
          }`}
        >
          {reservation.status === "CONFIRMADA" ? "Confirmada" : "Agendada"}
        </span>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-[#062112]/10 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#062112]/40">
                Teléfono
              </p>

              <p className="mt-1 text-xs text-[#062112]">{reservation.phone}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#062112]/40">
                Categoría
              </p>

              <p className="mt-1 text-xs text-[#062112]">
                {reservation.category}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#062112]/40">
                Profesional
              </p>

              <p className="mt-1 text-xs text-[#062112]">
                {reservation.professionalName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-[#062112]/40">
                Precio
              </p>

              <p className="mt-1 text-xs text-[#062112]">
                {formatPrice(reservation.price)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#062112] text-sm text-[#F2EBDB]"
          >
            <CircleUserRound className="size-4" />
            Ver cliente en CRM
          </button>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex h-9 items-center justify-center gap-2 rounded-md border border-[#062112]/15 text-xs text-[#062112]"
            >
              <MessageCircle className="size-3.5" />
              WhatsApp
            </button>

            <button
              type="button"
              className="flex h-9 items-center justify-center gap-2 rounded-md border border-[#062112]/15 text-xs text-[#062112]"
            >
              <RefreshCcw className="size-3.5" />
              Reprogramar
            </button>
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-2 text-xs text-[#062112]/50"
          >
            <MoreHorizontal className="size-3.5" />
            Más opciones
          </button>
        </div>
      )}
    </article>
  );
}
