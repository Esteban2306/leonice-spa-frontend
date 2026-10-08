import { httpClient } from "@/src/lib/api/client";
import type {
  CalendarRangeResponse,
  FindCalendarParams,
} from "../types/calendar.types";

export const calendarApi = {
  findRange(params: FindCalendarParams) {
    return httpClient.request<CalendarRangeResponse>(
      "/admin/calendar",
      "GET",
      undefined,
      { params },
    );
  },
};
