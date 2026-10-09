import { describe, expect, it } from "vitest";

import {
  draftFromBase,
  draftToRequest,
  isSameSchedule,
  suggestNextWindow,
  totalWeeklyHours,
  validateWeeklyDraft,
} from "./weekly-schedule";

const BASE = [
  { dayOfWeek: 1, startTime: "14:00", endTime: "16:00" },
  { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" },
  { dayOfWeek: 0, startTime: "07:00", endTime: "12:00" },
];

describe("weekly schedule draft", () => {
  it("arma los 7 días ordenados y vuelve al formato del backend", () => {
    const draft = draftFromBase(BASE);
    expect(Object.keys(draft)).toHaveLength(7);
    expect(draft[1].map((w) => w.startTime)).toEqual(["08:00", "14:00"]);
    expect(draft[3]).toEqual([]);
    const request = draftToRequest(draft);
    expect(request.days[0]).toEqual({
      dayOfWeek: 1,
      windows: [
        { startTime: "08:00", endTime: "12:00" },
        { startTime: "14:00", endTime: "16:00" },
      ],
    });
    expect(request.days.at(-1)?.dayOfWeek).toBe(0);
  });

  it("detecta si hubo cambios", () => {
    const draft = draftFromBase(BASE);
    expect(isSameSchedule(draft, BASE)).toBe(true);
    draft[3] = [{ key: "x", startTime: "09:00", endTime: "10:00" }];
    expect(isSameSchedule(draft, BASE)).toBe(false);
  });

  it("valida franjas invertidas, cruzadas y la semana vacía", () => {
    const draft = draftFromBase([]);
    expect(validateWeeklyDraft(draft)[-1]).toBeDefined();
    draft[2] = [{ key: "a", startTime: "12:00", endTime: "08:00" }];
    draft[3] = [
      { key: "b", startTime: "08:00", endTime: "12:00" },
      { key: "c", startTime: "11:00", endTime: "13:00" },
    ];
    const errors = validateWeeklyDraft(draft);
    expect(errors[2]).toMatch(/terminar/);
    expect(errors[3]).toMatch(/cruzan/);
    expect(errors[-1]).toBeUndefined();
  });

  it("propone la siguiente franja y suma las horas", () => {
    const draft = draftFromBase(BASE);
    expect(suggestNextWindow(draft[1])).toEqual({
      startTime: "17:00",
      endTime: "20:00",
    });
    expect(suggestNextWindow([])).toEqual({
      startTime: "08:00",
      endTime: "12:00",
    });
    expect(totalWeeklyHours(draft)).toBe(11);
  });
});
