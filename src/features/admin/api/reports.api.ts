import { httpClient } from "@/src/lib/api/client";
import type { DailyReport } from "../types/reports.types";

export const reportsApi = {
  daily(date?: string) {
    return httpClient.request<DailyReport>(
      "/admin/reports/daily",
      "GET",
      undefined,
      { params: date ? { date } : undefined },
    );
  },
};
