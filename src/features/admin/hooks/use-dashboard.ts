import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "../api/dashboard.api";
import { adminQueryKeys } from "./query-keys";

const DASHBOARD_STALE_TIME = 30 * 1000;

export function useDashboardSummary() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard.summary(),
    queryFn: () => dashboardApi.getSummary(),
    staleTime: DASHBOARD_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}
