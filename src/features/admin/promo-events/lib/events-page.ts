import type { PromoEvent } from "@/src/features/admin/types/promo-events.types";

export type EventState = "CURRENT" | "UPCOMING" | "ENDED" | "INACTIVE";

export const EVENT_STATE_LABELS: Record<EventState, string> = {
  CURRENT: "Vigente",
  UPCOMING: "Programado",
  ENDED: "Terminado",
  INACTIVE: "Desactivado",
};

export function eventState(
  event: Pick<PromoEvent, "isActive" | "startsAt" | "endsAt">,
  nowMs: number,
): EventState {
  if (!event.isActive) return "INACTIVE";
  if (new Date(event.endsAt).getTime() < nowMs) return "ENDED";
  if (new Date(event.startsAt).getTime() > nowMs) return "UPCOMING";
  return "CURRENT";
}

const DAY_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "numeric",
  month: "short",
});

export function formatEventRange(
  event: Pick<PromoEvent, "startsAt" | "endsAt">,
): string {
  return `${DAY_FORMAT.format(new Date(event.startsAt))} al ${DAY_FORMAT.format(new Date(event.endsAt))}`;
}

export function sortEvents(
  events: readonly PromoEvent[],
  nowMs: number,
): PromoEvent[] {
  const order: Record<EventState, number> = {
    CURRENT: 0,
    UPCOMING: 1,
    ENDED: 2,
    INACTIVE: 3,
  };
  return [...events].sort(
    (a, b) =>
      order[eventState(a, nowMs)] - order[eventState(b, nowMs)] ||
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function canDraw(event: PromoEvent): boolean {
  return event.ticketsEnabled && event.ticketCount > event.winnerCount;
}
