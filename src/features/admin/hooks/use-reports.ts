import { useQuery } from "@tanstack/react-query";

import { reportsApi } from "../api/reports.api";
import { adminQueryKeys } from "./query-keys";

const DAILY_REPORT_STALE_TIME = 10 * 60 * 1000;

export function useDailyReport(
  date: string | null,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: adminQueryKeys.reports.daily(date),
    queryFn: () => reportsApi.daily(date ?? undefined),
    enabled: options.enabled ?? true,
    staleTime: DAILY_REPORT_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}
