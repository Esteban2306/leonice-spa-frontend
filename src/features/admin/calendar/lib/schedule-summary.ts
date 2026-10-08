import type { ScheduleException } from "@/src/features/admin/types/schedule.types";

import type { DayScheduleSummary } from "../types/calendar.types";

export function summarizeScheduleByDay(
  exceptions: readonly ScheduleException[],
): Record<string, DayScheduleSummary> {
  const byDay: Record<string, DayScheduleSummary> = {};

  for (const exception of exceptions) {
    const current = byDay[exception.date] ?? {
      isClosed: false,
      hasExceptions: false,
    };

    byDay[exception.date] = {
      hasExceptions: true,
      isClosed:
        current.isClosed ||
        (exception.type === "BLOCK" &&
          exception.scope === "GLOBAL" &&
          exception.allDay),
    };
  }

  return byDay;
}
