import type {
  PendingReservation,
  PendingReservationItem,
} from "../types/dashboard.types";

interface ApiLatestDeposit {
  status: string;
  coverage: string | null;
  imageUrl: string | null;
}

interface ApiGroupedReservationItem {
  reservationId: string;
  treatment: { id: string; name: string };
  category: { id: string; name: string };
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  finalPrice: string;
  depositExpiresAt: string | null;
  latestDeposit: ApiLatestDeposit | null;
  hasUnresolvedDeposit: boolean;
}

export interface ApiGroupedReservation {
  isCombo: boolean;
  comboGroupId: string | null;
  client: { id: string; name: string; phone: string };
  items: ApiGroupedReservationItem[];
}

const TIME_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const DAY_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const dayPart = DAY_FORMATTER.format(date).replace(".", "");

  if (isSameCalendarDay(date, now)) return `Hoy · ${dayPart}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (isSameCalendarDay(date, tomorrow)) return `Mañana · ${dayPart}`;

  return dayPart;
}

function formatTimeLabel(isoDate: string): string {
  return TIME_FORMATTER.format(new Date(isoDate));
}

function mapItem(item: ApiGroupedReservationItem): PendingReservationItem {
  return {
    reservationId: item.reservationId,
    treatmentName: item.treatment.name,
    categoryLabel: item.category.name,
    durationMinutes: Math.round(
      (new Date(item.scheduledEnd).getTime() -
        new Date(item.scheduledStart).getTime()) /
        60_000,
    ),
    timeLabel: formatTimeLabel(item.scheduledStart),
    totalPrice: Number(item.finalPrice),
    proofUrl: item.latestDeposit?.imageUrl ?? null,
    verified: item.latestDeposit?.status === "CONFIRMADO",
    depositExpiresAt: item.depositExpiresAt,
  };
}

export function mapGroupedReservationToPendingReservation(
  group: ApiGroupedReservation,
): PendingReservation {
  const [firstItem] = group.items;

  return {
    clientId: group.client.id,
    client: {
      name: group.client.name,
      phone: group.client.phone,
    },
    dateLabel: formatDateLabel(firstItem.scheduledStart),
    items: group.items.map(mapItem),
  };
}
