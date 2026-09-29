const TODAY_PREFIX_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const dayPart = TODAY_PREFIX_FORMATTER.format(date).replace(".", "");

  if (isSameCalendarDay(date, now)) {
    return `Hoy · ${dayPart}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (isSameCalendarDay(date, tomorrow)) {
    return `Mañana · ${dayPart}`;
  }

  return dayPart;
}

export function formatTimeLabel(isoDate: string): string {
  return TIME_FORMATTER.format(new Date(isoDate)).toLowerCase();
}
