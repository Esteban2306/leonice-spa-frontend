import { describe, expect, it } from "vitest";

import {
  campaignProgress,
  dateTimeLocalToIso,
  formatDuration,
  minuteToTime,
  timeToMinute,
  windowsAreValid,
} from "./campaign-format";

describe("campaignProgress", () => {
  it("cuenta como avance lo enviado, lo fallido y lo omitido", () => {
    expect(
      campaignProgress({ total: 10, sent: 4, failed: 1, skipped: 1 }),
    ).toBe(60);
    expect(campaignProgress({ total: 0, sent: 0, failed: 0, skipped: 0 })).toBe(
      0,
    );
  });
});

describe("horas de envío", () => {
  it("convierte entre minutos y HH:MM", () => {
    expect(minuteToTime(8 * 60 + 5)).toBe("08:05");
    expect(timeToMinute("14:30")).toBe(870);
    expect(timeToMinute("25:00")).toBeNull();
    expect(timeToMinute("abc")).toBeNull();
  });

  it("solo acepta franjas dentro de 6:00 y 23:00 de al menos media hora", () => {
    expect(windowsAreValid([{ startMinute: 480, endMinute: 690 }])).toBe(true);
    expect(windowsAreValid([{ startMinute: 300, endMinute: 690 }])).toBe(false);
    expect(windowsAreValid([{ startMinute: 480, endMinute: 500 }])).toBe(false);
    expect(windowsAreValid([])).toBe(false);
  });
});

describe("dateTimeLocalToIso y formatDuration", () => {
  it("interpreta la hora escrita como hora de Bogotá", () => {
    expect(dateTimeLocalToIso("2026-11-10T08:30")).toBe(
      "2026-11-10T08:30:00-05:00",
    );
    expect(dateTimeLocalToIso("")).toBeUndefined();
  });

  it("describe cuánto tarda", () => {
    expect(formatDuration(1)).toBe("en el día");
    expect(formatDuration(3)).toBe("en 3 días");
  });
});
