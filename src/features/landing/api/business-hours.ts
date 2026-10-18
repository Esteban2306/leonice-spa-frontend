export interface BusinessHoursWindow {
  opens: string;
  closes: string;
}

export interface BusinessHours {
  timeZone: string;
  days: { dayOfWeek: number; windows: BusinessHoursWindow[] }[];
}

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 4000;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function isBusinessHours(value: unknown): value is BusinessHours {
  if (typeof value !== "object" || value === null) return false;
  const days = (value as { days?: unknown }).days;
  return (
    Array.isArray(days) &&
    days.every(
      (day: { dayOfWeek?: unknown; windows?: unknown }) =>
        typeof day.dayOfWeek === "number" &&
        day.dayOfWeek >= 0 &&
        day.dayOfWeek <= 6 &&
        Array.isArray(day.windows) &&
        day.windows.every(
          (window: { opens?: unknown; closes?: unknown }) =>
            typeof window.opens === "string" &&
            typeof window.closes === "string" &&
            TIME.test(window.opens) &&
            TIME.test(window.closes),
        ),
    )
  );
}

export async function getBusinessHours(): Promise<BusinessHours | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/business-hours`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    return isBusinessHours(payload) ? payload : null;
  } catch {
    return null;
  }
}
