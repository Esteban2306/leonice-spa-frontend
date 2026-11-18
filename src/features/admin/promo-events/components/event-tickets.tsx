"use client";

import { Trophy } from "lucide-react";

import { useEventTickets } from "@/src/features/admin/hooks/use-promo-events";

const DATE_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "numeric",
  month: "short",
});

export function EventTickets({ eventId }: { eventId: string }) {
  const query = useEventTickets(eventId);

  if (query.isLoading) {
    return (
      <p className="font-sans text-sm text-secondary/70">Cargando boletas…</p>
    );
  }
  if (query.isError) {
    return (
      <p role="alert" className="font-sans text-sm text-red-700">
        No se pudieron cargar las boletas.
      </p>
    );
  }
  const tickets = query.data ?? [];
  if (tickets.length === 0) {
    return (
      <p className="font-sans text-sm text-secondary/70">
        Aún no hay boletas. Se entregan solas cuando completas una cita durante
        el evento.
      </p>
    );
  }

  const winners = tickets.filter((ticket) => ticket.wonAt !== null);
  return (
    <div className="flex flex-col gap-3">
      {winners.length > 0 && (
        <ul className="flex flex-col gap-2">
          {winners.map((ticket) => (
            <li
              key={ticket.id}
              className="flex items-center gap-2 rounded-xl bg-tertiary/20 px-3 py-2 font-sans text-sm text-secondary"
            >
              <Trophy className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="font-semibold tabular-nums">
                #{ticket.number}
              </span>
              <span className="truncate">{ticket.client.name}</span>
              <span className="ml-auto truncate text-secondary/75">
                {ticket.prize}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="max-h-72 overflow-y-auto rounded-xl border border-secondary/10 bg-white">
        <table className="w-full font-sans text-sm text-secondary">
          <thead className="sticky top-0 bg-white text-left text-xs text-secondary/70">
            <tr>
              <th className="px-3 py-2 font-medium">Boleta</th>
              <th className="px-3 py-2 font-medium">Clienta</th>
              <th className="px-3 py-2 font-medium">Teléfono</th>
              <th className="px-3 py-2 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-secondary/5">
                <td className="px-3 py-2 font-semibold tabular-nums">
                  #{ticket.number}
                </td>
                <td className="px-3 py-2">{ticket.client.name}</td>
                <td className="px-3 py-2 tabular-nums text-secondary/75">
                  {ticket.client.phone}
                </td>
                <td className="px-3 py-2 text-secondary/75">
                  {DATE_FORMAT.format(new Date(ticket.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
