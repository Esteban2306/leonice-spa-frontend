import type {
  ClientReservationSummary,
  HairProfileStatus,
} from "@/src/features/admin/types/clients.types";
import type { ReservationStatus } from "@/src/features/admin/types/enums";

const DAY_MS = 86_400_000;
const BIRTHDAY_SOON_DAYS = 30;

export const HAIR_STATUS_LABELS: Readonly<Record<HairProfileStatus, string>> = {
  VALID: "Perfil capilar vigente",
  EXPIRED: "Perfil capilar vencido",
  MISSING: "Sin perfil capilar",
};

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function parseCalendarDate(dateKey: string): { y: number; m: number; d: number } {
  const [y, m, d] = dateKey.split("-").map(Number);
  return { y, m, d };
}

export function ageOn(birthDate: string, todayKey: string): number {
  const birth = parseCalendarDate(birthDate);
  const today = parseCalendarDate(todayKey);
  const hadBirthday =
    today.m > birth.m || (today.m === birth.m && today.d >= birth.d);
  return today.y - birth.y - (hadBirthday ? 0 : 1);
}

export function daysUntilBirthday(birthDate: string, todayKey: string): number {
  const birth = parseCalendarDate(birthDate);
  const today = parseCalendarDate(todayKey);
  const todayUtc = Date.UTC(today.y, today.m - 1, today.d);
  let next = Date.UTC(today.y, birth.m - 1, birth.d);
  if (next < todayUtc) next = Date.UTC(today.y + 1, birth.m - 1, birth.d);
  return Math.round((next - todayUtc) / DAY_MS);
}

export function isBirthdaySoon(birthDate: string, todayKey: string): boolean {
  return daysUntilBirthday(birthDate, todayKey) <= BIRTHDAY_SOON_DAYS;
}

export function attendanceRate(stats: {
  completed: number;
  noShow: number;
}): number | null {
  const attended = stats.completed + stats.noShow;
  return attended === 0 ? null : Math.round((stats.completed / attended) * 100);
}

export function validityProgress(
  updatedAt: string | null,
  validUntil: string | null,
  nowMs: number,
): { percent: number; daysLeft: number } | null {
  if (!updatedAt || !validUntil) return null;
  const start = new Date(updatedAt).getTime();
  const end = new Date(validUntil).getTime();
  const total = end - start;
  if (total <= 0) return null;
  const left = Math.max(end - nowMs, 0);
  return {
    percent: Math.round((left / total) * 100),
    daysLeft: Math.ceil(left / DAY_MS),
  };
}

export type HistoryStatusFilter = "ALL" | ReservationStatus;

export function filterHistory(
  reservations: readonly ClientReservationSummary[],
  status: HistoryStatusFilter,
  query: string,
): ClientReservationSummary[] {
  const normalized = query.trim().toLowerCase();
  return reservations.filter(
    (reservation) =>
      (status === "ALL" || reservation.status === status) &&
      (normalized.length === 0 ||
        reservation.treatment.toLowerCase().includes(normalized) ||
        reservation.category.toLowerCase().includes(normalized)),
  );
}
