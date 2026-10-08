import { CalendarDays, ChevronRight, Phone } from "lucide-react";

import { formatBogotaDayLabel } from "@/src/lib/date/bogota";
import type { ClientListItem } from "@/src/features/admin/types/clients.types";
import { RESERVATION_STATUS_LABELS } from "@/src/features/admin/utils/reservation-status.utils";

import { ClientInitialsAvatar } from "../components/client-avatar";
import { HairStatusChip } from "../components/hair-status-chip";

interface ClientDirectoryCardProps {
  client: ClientListItem;
  onOpen: (clientId: string) => void;
}

export function ClientDirectoryCard({ client, onOpen }: ClientDirectoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(client.id)}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-[1.5rem] border border-tertiary/25 bg-[#FCF6EB] p-4 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-tertiary/60 hover:shadow-[0_18px_40px_-28px_rgba(6,33,18,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
    >
      <ClientInitialsAvatar name={client.name} />

      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans text-lg text-secondary">
          {client.name}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-secondary/60">
          <Phone className="size-3" />
          {client.phone}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          <HairStatusChip status={client.hairProfileStatus} />
          <span className="inline-flex items-center rounded-full bg-secondary/5 px-2.5 py-0.5 font-sans text-[11px] text-secondary/70">
            {client.reservationCount} {client.reservationCount === 1 ? "reserva" : "reservas"}
          </span>
          {client.lastReservation && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/5 px-2.5 py-0.5 font-sans text-[11px] text-secondary/70">
              <CalendarDays className="size-3" />
              {formatBogotaDayLabel(client.lastReservation.scheduledStart)} ·{" "}
              {RESERVATION_STATUS_LABELS[client.lastReservation.status]}
            </span>
          )}
        </span>
      </span>

      <ChevronRight className="size-5 shrink-0 text-secondary/30 transition-transform group-hover:translate-x-0.5 group-hover:text-secondary" />
    </button>
  );
}
