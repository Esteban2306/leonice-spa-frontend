import { httpClient } from "@/src/lib/api/client";
import type { FindCalendarParams } from "../types/calendar.types";

export const calendarApi = {
  findByDate(params?: FindCalendarParams) {
    return httpClient.request("/admin/calendar", "GET", {
      params,
    });
  },
};
