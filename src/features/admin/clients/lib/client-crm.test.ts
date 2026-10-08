import { describe, expect, it } from "vitest";

import {
  ageOn,
  attendanceRate,
  daysUntilBirthday,
  filterHistory,
  getInitials,
  validityProgress,
} from "./client-crm";

describe("client-crm", () => {
  it("edad y próximo cumpleaños por fecha de calendario", () => {
    expect(ageOn("1998-10-17", "2026-10-08")).toBe(27);
    expect(ageOn("1998-10-08", "2026-10-08")).toBe(28);
    expect(daysUntilBirthday("1998-10-17", "2026-10-08")).toBe(9);
    expect(daysUntilBirthday("1998-10-01", "2026-10-08")).toBe(358);
  });

  it("iniciales de hasta dos palabras", () => {
    expect(getInitials("Mariana Cifuentes López")).toBe("MC");
  });

  it("asistencia sobre citas que ya ocurrieron", () => {
    expect(attendanceRate({ completed: 12, noShow: 1 })).toBe(92);
    expect(attendanceRate({ completed: 0, noShow: 0 })).toBeNull();
  });

  it("vigencia restante del perfil capilar", () => {
    const now = new Date("2026-10-08T00:00:00Z").getTime();
    expect(
      validityProgress("2026-09-08T00:00:00Z", "2027-01-08T00:00:00Z", now),
    ).toEqual({ percent: 75, daysLeft: 92 });
    expect(validityProgress(null, null, now)).toBeNull();
  });

  it("filtra historial por estado y texto", () => {
    const rows = [
      { status: "COMPLETADA", treatment: "Alisado", category: "Capilar" },
      { status: "CANCELADA", treatment: "Pedespa", category: "Uñas" },
    ] as unknown as Parameters<typeof filterHistory>[0];
    expect(filterHistory(rows, "COMPLETADA", "").length).toBe(1);
    expect(filterHistory(rows, "ALL", "uñas")[0].treatment).toBe("Pedespa");
  });
});
