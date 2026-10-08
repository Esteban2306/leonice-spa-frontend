import { getBogotaDayKey } from "@/src/lib/date/bogota";

import type { CalendarViewMode } from "../types/calendar.types";

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

const DAY_MONTH_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
});

export function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfWeek(date: Date): Date {
  const offset = (date.getDay() + 6) % 7;
  return addDays(date, -offset);
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getMonthDays(date: Date): Date[] {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = startOfWeek(firstOfMonth);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export function formatPeriodLabel(
  cursor: Date,
  mode: CalendarViewMode,
): string {
  if (mode === "month") return MONTH_YEAR_FORMATTER.format(cursor);

  const days = getWeekDays(cursor);
  const first = days[0];
  const last = days[6];

  return `${DAY_MONTH_FORMATTER.format(first)} – ${DAY_MONTH_FORMATTER.format(last)} ${last.getFullYear()}`;
}

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function fromDateKey(dateKey: string): Date | null {
  const match = DATE_KEY_PATTERN.exec(dateKey);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return toDateKey(date) === dateKey ? date : null;
}

export function getBusinessToday(now: Date = new Date()): Date {
  return fromDateKey(getBogotaDayKey(now)) ?? now;
}

export function getVisibleDays(cursor: Date, mode: CalendarViewMode): Date[] {
  return mode === "month" ? getMonthDays(cursor) : getWeekDays(cursor);
}

export function getVisibleRange(
  cursor: Date,
  mode: CalendarViewMode,
): { from: string; to: string } {
  const days = getVisibleDays(cursor, mode);
  return { from: toDateKey(days[0]), to: toDateKey(days[days.length - 1]) };
}
