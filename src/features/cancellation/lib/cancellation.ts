import type {
  CancelWithLinkRequest,
  CancellationLinkDetails,
  CancellationScope,
} from "../types";

export const CANCELLATION_REASONS: readonly string[] = [
  "Me surgió un imprevisto",
  "Quiero otra fecha",
  "Motivos de salud",
  "Ya no necesito el servicio",
];

export const MAX_REASON_LENGTH = 300;

export function cancellableReservations(details: CancellationLinkDetails) {
  return details.reservations.filter((r) => r.cancellable);
}

export function availableScopes(
  details: CancellationLinkDetails,
): CancellationScope[] {
  const cancellable = cancellableReservations(details);
  const linkIsCancellable = cancellable.some(
    (r) => r.reservationId === details.linkReservationId,
  );
  if (cancellable.length === 0) return [];
  if (!linkIsCancellable) return ["DAY"];
  return cancellable.length > 1 ? ["SINGLE", "DAY"] : ["SINGLE"];
}

export function composeReason(
  chip: string | null,
  note: string,
): string | undefined {
  const text = [chip, note.trim()].filter(Boolean).join(". ");
  return text ? text.slice(0, MAX_REASON_LENGTH) : undefined;
}

export function buildCancelRequest(
  details: CancellationLinkDetails,
  scope: CancellationScope,
  reason: string | undefined,
): CancelWithLinkRequest {
  return {
    scope,
    reservationId: details.linkReservationId,
    ...(reason ? { reason } : {}),
  };
}

export function whatsappLink(
  rawNumber: string | undefined,
  message: string,
): string | null {
  const digits = (rawNumber ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const DAY_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  weekday: "long",
  day: "numeric",
  month: "long",
});

const TIME_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDayKey(dayKey: string): string {
  return DAY_FORMAT.format(new Date(`${dayKey}T12:00:00-05:00`));
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${TIME_FORMAT.format(new Date(startIso))} – ${TIME_FORMAT.format(new Date(endIso))}`;
}

const ONE_MINUTE_MS = 60_000;

export function formatExpiry(iso: string): string {
  const lastMinute = new Date(new Date(iso).getTime() - ONE_MINUTE_MS);
  return `${DAY_FORMAT.format(lastMinute)} a las ${TIME_FORMAT.format(lastMinute)}`;
}

export function reservationStatusLabel(
  status: string,
  cancellable: boolean,
): string {
  if (status === "CANCELADA") return "Cancelada";
  if (!cancellable) return "Ya no se puede cancelar";
  return STATUS_COPY[status] ?? "Agendada";
}

const STATUS_COPY: Record<string, string> = {
  PENDIENTE_VALORACION: "Agendada",
  PENDIENTE_DEPOSITO: "Esperando depósito",
  CONFIRMADA: "Confirmada",
};
