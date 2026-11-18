import {
  ChevronDown,
  Pencil,
  Plus,
  Power,
  Ticket,
  Trash2,
  Trophy,
} from "lucide-react";

import type { PromoEvent } from "@/src/features/admin/types/promo-events.types";

import { EventTickets } from "../components/event-tickets";
import {
  EVENT_STATE_LABELS,
  canDraw,
  eventState,
  formatEventRange,
  type EventState,
} from "../lib/events-page";

interface EventsViewProps {
  events: readonly PromoEvent[];
  isLoading: boolean;
  isError: boolean;
  nowMs: number;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onCreate: () => void;
  onEdit: (event: PromoEvent) => void;
  onToggleActive: (event: PromoEvent) => void;
  onDelete: (event: PromoEvent) => void;
  onDraw: (event: PromoEvent) => void;
  onRetry: () => void;
}

const STATE_CLASS: Record<EventState, string> = {
  CURRENT: "bg-emerald-100 text-emerald-800",
  UPCOMING: "bg-sky-100 text-sky-800",
  ENDED: "bg-secondary/10 text-secondary/70",
  INACTIVE: "bg-red-50 text-red-700",
};

const ICON_BUTTON =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-tertiary/40 text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-40";

function EventCard(props: EventsViewProps & { event: PromoEvent }) {
  const { event } = props;
  const state = eventState(event, props.nowMs);
  const expanded = props.expandedId === event.id;
  const removable = event.ticketCount === 0;

  return (
    <article className="flex flex-col gap-4 rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-2xl text-secondary">
              {event.name}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 font-sans text-xs font-medium ${STATE_CLASS[state]}`}
            >
              {EVENT_STATE_LABELS[state]}
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-secondary/70">
            {formatEventRange(event)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Editar ${event.name}`}
            onClick={() => props.onEdit(event)}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={
              event.isActive
                ? `Desactivar ${event.name}`
                : `Activar ${event.name}`
            }
            onClick={() => props.onToggleActive(event)}
            className={ICON_BUTTON}
          >
            <Power className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${event.name}`}
            title={
              removable
                ? undefined
                : "Tiene boletas: desactívalo para conservar el registro"
            }
            disabled={!removable}
            onClick={() => props.onDelete(event)}
            className={ICON_BUTTON}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <p className="font-sans text-sm text-secondary/85">{event.description}</p>
      {event.prizes && (
        <p className="font-sans text-sm text-secondary">
          <span className="font-semibold">Premios:</span> {event.prizes}
        </p>
      )}

      {event.ticketsEnabled ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-sans text-sm text-secondary">
            <Ticket className="size-4" strokeWidth={1.75} />
            <span className="tabular-nums">{event.ticketCount}</span> boletas
          </span>
          <span className="inline-flex items-center gap-1.5 font-sans text-sm text-secondary">
            <Trophy className="size-4" strokeWidth={1.75} />
            <span className="tabular-nums">{event.winnerCount}</span> ganadoras
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => props.onToggleExpand(event.id)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/40 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25"
            >
              {expanded ? "Ocultar boletas" : "Ver boletas"}
              <ChevronDown
                className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                strokeWidth={1.75}
              />
            </button>
            <button
              type="button"
              disabled={!canDraw(event)}
              onClick={() => props.onDraw(event)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 font-sans text-sm font-semibold text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trophy className="size-4" strokeWidth={1.75} />
              Sortear
            </button>
          </div>
        </div>
      ) : (
        <p className="font-sans text-xs text-secondary/70">
          Sin boletas: el evento solo se anuncia y el asistente lo explica.
        </p>
      )}

      {expanded && <EventTickets eventId={event.id} />}
    </article>
  );
}

export function EventsView(props: EventsViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">Eventos</h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
              Rifas, aniversarios y actividades especiales. Mientras un evento
              está vigente, el asistente de WhatsApp lo conoce; con boletas,
              cada visita completada participa y el sorteo se hace aquí.
            </p>
          </div>
          <button
            type="button"
            onClick={props.onCreate}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
          >
            <Plus className="size-4" strokeWidth={2} />
            Nuevo evento
          </button>
        </header>

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudieron cargar los eventos.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {props.isLoading && (
          <p className="font-sans text-sm text-secondary/70">
            Cargando eventos…
          </p>
        )}

        {!props.isLoading && !props.isError && props.events.length === 0 && (
          <p className="rounded-[1.5rem] border border-dashed border-tertiary/50 p-6 text-center font-sans text-sm text-secondary/75">
            Aún no hay eventos. Crea el primero con “Nuevo evento”.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {props.events.map((event) => (
            <EventCard key={event.id} {...props} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
