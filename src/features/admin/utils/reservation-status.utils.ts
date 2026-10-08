import type { CancellationSource, ReservationStatus } from "../types/enums";

export const PENDING_CONFIRMATION_STATUS: ReservationStatus =
  "PENDIENTE_DEPOSITO";

export const RESERVATION_STATUS_LABELS: Readonly<Record<ReservationStatus, string>> = {
  SOLICITUD_INICIADA: "Solicitud iniciada",
  PENDIENTE_VALORACION: "Pendiente de valoración",
  PENDIENTE_DEPOSITO: "Esperando depósito",
  CONFIRMADA: "Confirmada",
  CITA_EN_CURSO: "En curso",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
  REPROGRAMADA: "Reprogramada",
  NO_SHOW: "No asistió",
};

export const CANCELLATION_SOURCE_LABELS: Readonly<Record<CancellationSource, string>> = {
  CLIENT: "Cancelada por el cliente",
  ADMIN: "Cancelada por el administrador",
  TIMEOUT: "Cancelada por vencimiento del depósito",
};

const CANCELLABLE_STATUSES: readonly ReservationStatus[] = [
  "PENDIENTE_VALORACION",
  "PENDIENTE_DEPOSITO",
  "CONFIRMADA",
];

export function isCancellableStatus(status: ReservationStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

export function canCheckIn(status: ReservationStatus, isToday: boolean): boolean {
  return isToday && (status === "CONFIRMADA" || status === "NO_SHOW");
}

export function canRevive(
  status: ReservationStatus,
  cancellationSource: CancellationSource | null,
  isUpcoming: boolean,
): boolean {
  return status === "CANCELADA" && cancellationSource === "TIMEOUT" && isUpcoming;
}

export function describeReservationStatus(
  status: ReservationStatus,
  cancellationSource: CancellationSource | null,
): string {
  if (status === "CANCELADA" && cancellationSource) {
    return CANCELLATION_SOURCE_LABELS[cancellationSource];
  }
  return RESERVATION_STATUS_LABELS[status];
}
