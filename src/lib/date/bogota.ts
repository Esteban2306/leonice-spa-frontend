export const BUSINESS_TIME_ZONE = "America/Bogota";

const DAY_MS = 86_400_000;

const timeFormatter = new Intl.DateTimeFormat("es-CO", {
  timeZone: BUSINESS_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const shortDayFormatter = new Intl.DateTimeFormat("es-CO", {
  timeZone: BUSINESS_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getBogotaDayKey(date: Date): string {
  return dayKeyFormatter.format(date);
}

export function formatBogotaTime(isoDate: string): string {
  return timeFormatter.format(new Date(isoDate));
}

export function formatBogotaDayLabel(
  isoDate: string,
  now: Date = new Date(),
): string {
  const date = new Date(isoDate);
  const dayPart = shortDayFormatter.format(date).replace(".", "");
  const dayKey = getBogotaDayKey(date);

  if (dayKey === getBogotaDayKey(now)) return `Hoy · ${dayPart}`;

  const tomorrow = new Date(now.getTime() + DAY_MS);
  if (dayKey === getBogotaDayKey(tomorrow)) return `Mañana · ${dayPart}`;

  return dayPart;
}
