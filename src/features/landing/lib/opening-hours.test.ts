import { describe, expect, it } from "vitest";

import type { BusinessHours } from "../api/business-hours";
import { formatClock, groupOpeningHours, toOpeningHoursSpecification } from "./opening-hours";

const plain = (text: string) => text.replace(/\u00a0/g, " ");

const split = [
  { opens: "08:00", closes: "12:00" },
  { opens: "14:00", closes: "17:00" },
];
const weekend = [
  { opens: "07:00", closes: "12:00" },
  { opens: "14:00", closes: "17:00" },
];

const hours = (byDay: Record<number, typeof split>): BusinessHours => ({
  timeZone: "America/Bogota",
  days: [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({ dayOfWeek, windows: byDay[dayOfWeek] ?? [] })),
});

describe("formatClock", () => {
  it("usa el formato colombiano con mediodía como m.", () => {
    expect(plain(formatClock("08:00"))).toBe("8:00 a. m.");
    expect(plain(formatClock("12:00"))).toBe("12:00 m.");
    expect(plain(formatClock("12:30"))).toBe("12:30 p. m.");
    expect(plain(formatClock("17:30"))).toBe("5:30 p. m.");
    expect(plain(formatClock("00:00"))).toBe("12:00 a. m.");
  });
});

describe("groupOpeningHours", () => {
  it("usa espacios de no separación para que la hora no se parta entre líneas", () => {
    expect(formatClock("14:00")).toBe("2:00\u00a0p.\u00a0m.");
  });

  it("agrupa días consecutivos con las mismas franjas empezando el lunes", () => {
    const rows = groupOpeningHours(
      hours({ 0: weekend, 1: split, 2: split, 3: split, 4: split, 5: split, 6: weekend }),
    );
    expect(rows.map((row) => ({ ...row, hours: plain(row.hours) }))).toEqual([
      { days: "Lun – Vie", hours: "8:00 a. m. – 12:00 m. y 2:00 p. m. – 5:00 p. m." },
      { days: "Sáb – Dom", hours: "7:00 a. m. – 12:00 m. y 2:00 p. m. – 5:00 p. m." },
    ]);
  });

  it("muestra los días sin franjas como cerrados", () => {
    const rows = groupOpeningHours(hours({ 1: split, 2: split, 3: split, 4: split, 5: split, 6: weekend }));
    expect(rows.at(-1)).toEqual({ days: "Dom", hours: "Cerrado" });
  });
});

describe("toOpeningHoursSpecification", () => {
  it("genera una especificación por franja con los días de schema.org", () => {
    const spec = toOpeningHoursSpecification(hours({ 1: split, 6: weekend }));
    expect(spec).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["https://schema.org/Monday"],
        opens: "08:00",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["https://schema.org/Monday", "https://schema.org/Saturday"],
        opens: "14:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["https://schema.org/Saturday"],
        opens: "07:00",
        closes: "12:00",
      },
    ]);
  });
});
