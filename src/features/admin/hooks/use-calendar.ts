import { useQuery } from "@tanstack/react-query";

import { calendarApi } from "../api/calendar.api";
import { adminQueryKeys } from "./query-keys";

import type { FindCalendarParams } from "../types/calendar.types";

const CALENDAR_STALE_TIME = 15 * 1000;

export function useCalendar(params: FindCalendarParams) {
  return useQuery({
    queryKey: adminQueryKeys.calendar.byDate(params),
    queryFn: () => calendarApi.findByDate(params),
    staleTime: CALENDAR_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}
