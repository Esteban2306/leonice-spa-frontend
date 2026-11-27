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

export interface StageStep {
  label: string;
  state: "done" | "current" | "pending";
}

export interface ReservationStage {
  headline: string;
  tone: StageTone;
  /** Recorrido de la cita; null cuando ya se salió de él. */
  steps: StageStep[] | null;
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

function journey(withAssessment: boolean, current: string): StageStep[] {
  const labels = [
    ...(withAssessment ? ["Valoración"] : []),
    "Pago",
    "Confirmada",
    "En el spa",
    "Terminada",
  ];
  const position = labels.indexOf(current);
  return labels.map((label, index) => ({
    label,
    state:
      index < position ? "done" : index === position ? "current" : "pending",
  }));
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
    return {
      headline: "Hay que valorar el cabello",
      tone: "attention",
      steps: journey(true, "Valoración"),
      primary: needsAssessment(reservation) ? "assess" : null,
    };
  }

  switch (status) {
    case "SOLICITUD_INICIADA":
      return {
        headline: "La solicitud no se terminó",
        tone: "attention",
        steps: journey(false, "Pago"),
        primary: null,
      };
    case "PENDIENTE_DEPOSITO": {
      const steps = journey(false, "Pago");
      if (reservation.proofUrl && reservation.isProofUnderReview) {
        return {
          headline: "Revisa el comprobante",
          tone: "attention",
          steps,
          primary: "approve-proof",
        };
      }
      const deadline = reservation.depositExpiresAt
        ? ` · ${describeDeadline(reservation.depositExpiresAt, nowMs)}`
        : "";
      const problem =
        reservation.depositStatus === "RECHAZADO"
          ? "Comprobante rechazado"
          : "Falta el pago";
      return {
        headline: `${problem}${deadline}`,
        tone: "attention",
        steps,
        primary: "register-payment",
      };
    }
    case "CONFIRMADA": {
      const past = !isToday && !isUpcoming;
      return {
        headline: isToday
          ? "Esperando que llegue"
          : past
            ? "No se registró la llegada"
            : "Todo listo",
        tone: past ? "attention" : "ready",
        steps: journey(false, "Confirmada"),
        primary: isToday ? "check-in" : null,
      };
    }
    case "CITA_EN_CURSO":
      return {
        headline: "La están atendiendo",
        tone: "active",
        steps: journey(false, "En el spa"),
        primary: "complete",
      };
    case "COMPLETADA":
      return {
        headline: "Cita terminada",
        tone: "done",
        steps: journey(false, "Terminada").map((step) => ({
          ...step,
          state: "done",
        })),
        primary: null,
      };
    case "NO_SHOW":
      return {
        headline: "No llegó",
        tone: "lost",
        steps: null,
        primary: isToday ? "check-in-late" : null,
      };
    case "CANCELADA":
      return {
        headline: describeReservationStatus(status, cancellationSource),
        tone: "lost",
        steps: null,
        primary:
          cancellationSource === "TIMEOUT" && isUpcoming ? "revive" : null,
      };
    case "REPROGRAMADA":
      return {
        headline: "Se movió a otra fecha",
        tone: "lost",
        steps: null,
        primary: null,
      };
  }
}
