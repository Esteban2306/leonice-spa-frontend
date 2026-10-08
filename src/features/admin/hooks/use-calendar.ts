import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { calendarApi } from "../api/calendar.api";
import { mapCalendarReservations } from "../calendar/lib/map-calendar-reservation";
import { adminQueryKeys } from "./query-keys";

import type { CalendarRangeResponse } from "../types/calendar.types";

const CALENDAR_STALE_TIME = 15 * 1000;
const CALENDAR_REFETCH_INTERVAL_MS = 60 * 1000;

function selectReservations(response: CalendarRangeResponse) {
  return mapCalendarReservations(response.reservations);
}

export function useCalendarRange(params: { from: string; to: string }) {
  return useQuery({
    queryKey: adminQueryKeys.calendar.range(params),
    queryFn: () => calendarApi.findRange(params),
    select: selectReservations,
    placeholderData: keepPreviousData,
    staleTime: CALENDAR_STALE_TIME,
    refetchInterval: CALENDAR_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
