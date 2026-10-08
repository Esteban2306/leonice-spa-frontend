import { describe, expect, it } from "vitest";

import type { ScheduleException } from "@/src/features/admin/types/schedule.types";

import { summarizeScheduleByDay } from "./schedule-summary";

const exception = (overrides: Partial<ScheduleException>): ScheduleException => ({
  id: "e1",
  date: "2026-12-09",
  type: "BLOCK",
  categoryId: null,
  categoryName: null,
  scope: "GLOBAL",
  allDay: true,
  startTime: null,
  endTime: null,
  reason: null,
  createdAt: "2026-10-08T00:00:00.000Z",
  ...overrides,
});

describe("summarizeScheduleByDay", () => {
  it("un bloqueo global de día completo cierra el día", () => {
    expect(summarizeScheduleByDay([exception({})])["2026-12-09"]).toEqual({
      isClosed: true,
      hasExceptions: true,
    });
  });

  it("bloqueos parciales o por categoría solo marcan horario modificado", () => {
    const summary = summarizeScheduleByDay([
      exception({ allDay: false, startTime: "08:00", endTime: "10:00" }),
      exception({ id: "e2", date: "2026-12-10", scope: "CATEGORY", categoryId: "c" }),
      exception({ id: "e3", date: "2026-12-11", type: "OPEN", allDay: false }),
    ]);
    expect(summary["2026-12-09"].isClosed).toBe(false);
    expect(summary["2026-12-10"].isClosed).toBe(false);
    expect(summary["2026-12-11"]).toEqual({ isClosed: false, hasExceptions: true });
  });
});
