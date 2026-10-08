import { Search } from "lucide-react";

import { formatBogotaDayLabel, formatBogotaTime } from "@/src/lib/date/bogota";
import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { ClientReservationSummary } from "@/src/features/admin/types/clients.types";
import type { ReservationStatus } from "@/src/features/admin/types/enums";
import { describeReservationStatus, RESERVATION_STATUS_LABELS } from "@/src/features/admin/utils/reservation-status.utils";

import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { filterHistory, type HistoryStatusFilter } from "../../lib/client-crm";

interface HistoryTabProps {
  reservations: readonly ClientReservationSummary[];
  status: HistoryStatusFilter;
  query: string;
  onStatusChange: (status: HistoryStatusFilter) => void;
  onQueryChange: (query: string) => void;
  onOpenInCalendar: (reservationId: string) => void;
}

const DOT: Partial<Record<ReservationStatus, string>> = {
  COMPLETADA: "bg-green-700",
  NO_SHOW: "bg-red-600",
  CANCELADA: "bg-secondary/40",
  CONFIRMADA: "bg-secondary",
  PENDIENTE_DEPOSITO: "bg-amber-500",
  CITA_EN_CURSO: "bg-green-500",
};

const STATUS_OPTIONS: ReadonlyArray<HistoryStatusFilter> = [
  "ALL",
  "PENDIENTE_DEPOSITO",
  "CONFIRMADA",
  "COMPLETADA",
  "CANCELADA",
  "NO_SHOW",
];

export function HistoryTab({ reservations, status, query, onStatusChange, onQueryChange, onOpenInCalendar }: HistoryTabProps) {
  const rows = filterHistory(reservations, status, query);

  return (
    <section className="flex flex-col gap-4 rounded-[2rem] border border-tertiary/25 bg-[#FCF6EB] p-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-heading text-xl text-secondary">Historial · últimas {reservations.length}</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondary/45" />
            <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar tratamiento…" aria-label="Buscar en el historial" className={`${INPUT_CLASS} pl-9 sm:w-56`} />
          </div>
          <select value={status} onChange={(event) => onStatusChange(event.target.value as HistoryStatusFilter)} aria-label="Filtrar por estado" className={`${INPUT_CLASS} sm:w-48`}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "ALL" ? "Estado: todos" : RESERVATION_STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>
      </header>

      {rows.length === 0 ? (
        <p className="py-8 text-center font-sans text-sm text-secondary/60">No hay reservas con ese filtro.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-tertiary/20">
          {rows.map((reservation) => (
            <li key={reservation.reservationId}>
              <button type="button" onClick={() => onOpenInCalendar(reservation.reservationId)} className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:bg-white/60">
                <span className="flex min-w-0 items-start gap-3">
                  <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${DOT[reservation.status] ?? "bg-tertiary"}`} />
                  <span className="min-w-0">
                    <span className="block font-sans text-sm text-secondary">
                      {describeReservationStatus(reservation.status, reservation.cancellationSource)} · {reservation.treatment}
                    </span>
                    <span className="block font-sans text-xs text-secondary/55">
                      {formatBogotaTime(reservation.scheduledStart)} · {reservation.category} · {formatCopFromThousands(reservation.finalPrice)}
                      {reservation.comboGroupId ? " · combo" : ""}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-secondary/5 px-2.5 py-1 font-sans text-[11px] text-secondary/70">
                  {formatBogotaDayLabel(reservation.scheduledStart)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
