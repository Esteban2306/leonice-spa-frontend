import type {
  Campaign,
  CampaignRecipientStatus,
  CampaignStatus,
  PaceProfile,
  SendWindow,
} from "@/src/features/admin/types/campaigns.types";

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  RUNNING: "En curso",
  PAUSED: "Pausada",
  COMPLETED: "Terminada",
  CANCELLED: "Cancelada",
};

export const RECIPIENT_STATUS_LABELS: Record<CampaignRecipientStatus, string> =
  {
    PENDING: "Pendiente",
    SENT: "Enviado",
    FAILED: "Falló",
    SKIPPED: "Omitida",
  };

export const PACE_OPTIONS: ReadonlyArray<{
  value: PaceProfile;
  label: string;
  hourlyCap: number;
  description: string;
}> = [
  {
    value: "SEGURO",
    label: "Seguro",
    hourlyCap: 20,
    description:
      "Hasta 20 por hora y pausas largas. Ideal si el número es sensible o lo usas mucho con el bot.",
  },
  {
    value: "EQUILIBRADO",
    label: "Equilibrado",
    hourlyCap: 30,
    description:
      "Hasta 30 por hora con pausas variables. Es el punto medio recomendado.",
  },
  {
    value: "RAPIDO",
    label: "Rápido",
    hourlyCap: 45,
    description:
      "Hasta 45 por hora. Termina antes, pero con más riesgo de bloqueo.",
  },
];

export function paceLabel(pace: PaceProfile): string {
  return PACE_OPTIONS.find((option) => option.value === pace)?.label ?? pace;
}

export function campaignProgress(
  campaign: Pick<Campaign, "total" | "sent" | "failed" | "skipped">,
): number {
  if (campaign.total === 0) return 0;
  const done = campaign.sent + campaign.failed + campaign.skipped;
  return Math.min(100, Math.round((done / campaign.total) * 100));
}

export function minuteToTime(minute: number): string {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function timeToMinute(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const minute = Number(match[1]) * 60 + Number(match[2]);
  return minute >= 0 && minute <= 1440 ? minute : null;
}

export function windowsAreValid(windows: readonly SendWindow[]): boolean {
  return (
    windows.length > 0 &&
    windows.every(
      (window) =>
        window.startMinute >= 6 * 60 &&
        window.endMinute <= 23 * 60 &&
        window.endMinute - window.startMinute >= 30,
    )
  );
}

const DATE_TIME = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDateTime(iso: string | null): string {
  return iso ? DATE_TIME.format(new Date(iso)).replace(".", "") : "—";
}

export function dateTimeLocalToIso(value: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
    ? `${value}:00-05:00`
    : undefined;
}

export function formatDuration(days: number): string {
  return days <= 1 ? "en el día" : `en ${days} días`;
}
