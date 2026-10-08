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
