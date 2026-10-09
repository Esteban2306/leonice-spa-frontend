import { describe, expect, it } from "vitest";

import {
  SERVER_SNAPSHOT,
  seenStorageKey,
  shouldShowDailyReport,
} from "./daily-report-seen";

describe("daily report gate", () => {
  it("se muestra una vez por día", () => {
    expect(shouldShowDailyReport(null, "2026-10-09")).toBe(true);
    expect(shouldShowDailyReport("2026-10-08", "2026-10-09")).toBe(true);
    expect(shouldShowDailyReport("2026-10-09", "2026-10-09")).toBe(false);
  });

  it("no se muestra durante el render del servidor", () => {
    expect(shouldShowDailyReport(SERVER_SNAPSHOT, "2026-10-09")).toBe(false);
  });

  it("separa el registro por usuario", () => {
    expect(seenStorageKey("u1")).not.toBe(seenStorageKey("u2"));
  });
});
