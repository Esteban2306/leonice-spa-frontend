const STORAGE_PREFIX = "leonice:daily-report-seen";
export const SERVER_SNAPSHOT = "__server__";

export function seenStorageKey(userId: string | null): string {
  return `${STORAGE_PREFIX}:${userId ?? "anon"}`;
}

export function readSeenDay(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function markDaySeen(key: string, dayKey: string): void {
  try {
    window.localStorage.setItem(key, dayKey);
  } catch {
    return;
  }
}

export function shouldShowDailyReport(
  seenDay: string | null,
  todayKey: string,
): boolean {
  if (seenDay === SERVER_SNAPSHOT) return false;
  return seenDay !== todayKey;
}
