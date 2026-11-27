import {
  formatBogotaTime,
  getBogotaDayKey,
  BUSINESS_TIME_ZONE,
} from "@/src/lib/date/bogota";
import { describeReservationStatus } from "@/src/features/admin/utils/reservation-status.utils";

import type { CalendarReservation } from "../types/calendar.types";

export type StageAction =
  | "assess"
  | "register-payment"
  | "approve-proof"
  | "check-in"
  | "check-in-late"
  | "complete"
  | "revive";

export type StageTone = "attention" | "ready" | "active" | "done" | "lost";

export interface ReservationStage {
  /** Estado en una o dos palabras. */
  label: string;
  tone: StageTone;
  /** Qué le toca hacer ahora a quien atiende, también cuando es nada. */
  next: string;
  primary: StageAction | null;
}

export const STAGE_ACTION_LABELS: Readonly<Record<StageAction, string>> = {
  assess: "Registrar valoración",
  "register-payment": "Registrar pago",
  "approve-proof": "Aprobar el pago",
  "check-in": "Ya llegó",
  "check-in-late": "Llegó tarde",
  complete: "Terminar cita",
  revive: "Reactivar cita",
};

interface StageContext {
  todayKey: string;
  nowMs: number;
}

const DAY_MS = 86_400_000;

const shortDay = new Intl.DateTimeFormat("es-CO", {
  timeZone: BUSINESS_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function describeDeadline(iso: string, nowMs: number): string {
  const deadline = new Date(iso);
  if (deadline.getTime() <= nowMs) return "el plazo venció";

  const key = getBogotaDayKey(deadline);
  const time = formatBogotaTime(iso);
  if (key === getBogotaDayKey(new Date(nowMs))) return `vence hoy ${time}`;
  if (key === getBogotaDayKey(new Date(nowMs + DAY_MS))) {
    return `vence mañana ${time}`;
  }
  return `vence ${shortDay.format(deadline)} ${time}`;
}

export function needsAssessment(reservation: CalendarReservation): boolean {
  return reservation.assessment?.state === "PENDING";
}

export function describeStage(
  reservation: CalendarReservation,
  { todayKey, nowMs }: StageContext,
): ReservationStage {
  const { status, cancellationSource } = reservation;
  const isToday = reservation.dateKey === todayKey;
  const isUpcoming = new Date(reservation.startsAt).getTime() > nowMs;

  const waiting =
    status === "PENDIENTE_VALORACION" || status === "PENDIENTE_DEPOSITO";

  // La valoración va primero porque define el precio que se va a cobrar.
  if (
    status === "PENDIENTE_VALORACION" ||
    (waiting && needsAssessment(reservation))
  ) {
    const canAssess = needsAssessment(reservation);
    return {
      label: "Falta valorar",
      tone: "attention",
      next: canAssess
        ? "Registra la valoración del cabello y revisa que el precio sea el correcto."
        : "Falta confirmar el precio de la valoración.",
      primary: canAssess ? "assess" : null,
    };
  }

  switch (status) {
    case "SOLICITUD_INICIADA":
      return {
        label: "Sin terminar",
        tone: "attention",
        next: "La solicitud quedó a medias. Escríbele para completarla.",
        primary: null,
      };
    case "PENDIENTE_DEPOSITO": {
      if (reservation.proofUrl && reservation.isProofUnderReview) {
        return {
          label: "Comprobante por revisar",
          tone: "attention",
          next: "Mira la imagen y, si el dinero llegó, aprueba el pago.",
          primary: "approve-proof",
        };
      }
      const due = reservation.depositExpiresAt
        ? describeDeadline(reservation.depositExpiresAt, nowMs)
        : null;
      const deadline = !due
        ? ""
        : due === "el plazo venció"
          ? " El plazo ya venció."
          : ` Plazo: ${due}.`;
      return {
        label:
          reservation.depositStatus === "RECHAZADO"
            ? "Comprobante rechazado"
            : "Falta el pago",
        tone: "attention",
        next: `Cuando pague, regístralo para confirmar la cita.${deadline}`,
        primary: "register-payment",
      };
    }
    case "CONFIRMADA": {
      if (isToday) {
        return {
          label: "Confirmada",
          tone: "ready",
          next: "Cuando llegue, toca «Ya llegó».",
          primary: "check-in",
        };
      }
      if (!isUpcoming) {
        return {
          label: "Sin registrar llegada",
          tone: "attention",
          next: "Pasó la fecha y no se marcó la llegada.",
          primary: null,
        };
      }
      return {
        label: "Confirmada",
        tone: "ready",
        next: `Nada por ahora. El ${shortDay.format(new Date(reservation.startsAt))}, cuando llegue, aquí aparece «Ya llegó».`,
        primary: null,
      };
    }
    case "CITA_EN_CURSO":
      return {
        label: "En el spa",
        tone: "active",
        next: "Al finalizar, toca «Terminar cita» para registrar el cobro.",
        primary: "complete",
      };
    case "COMPLETADA":
      return {
        label: "Terminada",
        tone: "done",
        next: "No queda nada pendiente.",
        primary: null,
      };
    case "NO_SHOW":
      return {
        label: "No llegó",
        tone: "lost",
        next: isToday
          ? "Si llegó tarde, todavía puedes registrarla."
          : "Si quiere volver, agenda una cita nueva.",
        primary: isToday ? "check-in-late" : null,
      };
    case "CANCELADA": {
      const canRevive = cancellationSource === "TIMEOUT" && isUpcoming;
      return {
        label: describeReservationStatus(status, cancellationSource),
        tone: "lost",
        next: canRevive
          ? "Si todavía quiere venir, reactívala."
          : "Si quiere volver, agenda una cita nueva.",
        primary: canRevive ? "revive" : null,
      };
    }
    case "REPROGRAMADA":
      return {
        label: "Movida",
        tone: "lost",
        next: "Se atiende en la nueva fecha.",
        primary: null,
      };
  }
}

/**
 * Anticipo registrado en esta cita, en miles de COP. No se calcula cuánto falta:
 * un mismo pago puede cubrir varias citas y el calendario no lo dice.
 */
export function receivedDeposit(
  reservation: CalendarReservation,
): number | null {
  return reservation.depositStatus === "CONFIRMADO"
    ? reservation.depositAmount
    : null;
}

export function canReschedule({ status }: CalendarReservation): boolean {
  return status === "PENDIENTE_DEPOSITO" || status === "CONFIRMADA";
}
