import { describe, expect, it } from "vitest";

import {
  toDayOverrideRequest,
  validateDayOverrideDraft,
  type DayOverrideDraft,
} from "./day-override-draft";

const december: DayOverrideDraft = {
  from: "2026-12-01",
  to: "2026-12-31",
  closed: false,
  windows: [{ startTime: "07:00", endTime: "19:00" }],
  fixedStarts: true,
  startTimes: ["14:00", "07:00", "10:00"],
  reason: " Horarios de diciembre ",
};

describe("horario de una fecha", () => {
  it("diciembre con horas de inicio fijas es válido y se envía ordenado", () => {
    expect(validateDayOverrideDraft(december)).toEqual([]);
    expect(toDayOverrideRequest(december)).toEqual({
      from: "2026-12-01",
      to: "2026-12-31",
      windows: [{ startTime: "07:00", endTime: "19:00" }],
      startTimes: ["07:00", "10:00", "14:00"],
      reason: "Horarios de diciembre",
    });
  });

  it("un día cerrado no envía franjas ni horas", () => {
    const closed = { ...december, closed: true };
    expect(validateDayOverrideDraft(closed)).toEqual([]);
    expect(toDayOverrideRequest(closed)).toMatchObject({
      windows: [],
      startTimes: [],
    });
  });

  it("sin horas fijas no envía horas de inicio", () => {
    expect(
      toDayOverrideRequest({ ...december, fixedStarts: false }).startTimes,
    ).toEqual([]);
  });

  it("detecta fechas al revés, rangos largos, franjas cruzadas y horas fuera de franja", () => {
    expect(
      validateDayOverrideDraft({ ...december, to: "2026-11-30" }),
    ).toHaveLength(1);
    expect(
      validateDayOverrideDraft({ ...december, to: "2027-02-15" })[0],
    ).toContain("62");
    expect(
      validateDayOverrideDraft({
        ...december,
        windows: [
          { startTime: "07:00", endTime: "12:00" },
          { startTime: "11:00", endTime: "15:00" },
        ],
        startTimes: ["07:00"],
      }),
    ).toEqual(["Las franjas no pueden cruzarse."]);
    expect(
      validateDayOverrideDraft({ ...december, startTimes: ["20:00"] })[0],
    ).toContain("20:00");
  });
});
