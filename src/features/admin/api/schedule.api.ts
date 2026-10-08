import { httpClient } from "@/src/lib/api/client";
import type {
  CreateScheduleExceptionRequest,
  ScheduleChangeResult,
  ScheduleDay,
  ScheduleException,
} from "../types/schedule.types";

export interface FindScheduleExceptionsParams {
  from: string;
  to: string;
  categoryId?: string;
}

export const scheduleApi = {
  getDay(date: string) {
    return httpClient.request<ScheduleDay>(`/admin/schedule/days/${date}`, "GET");
  },

  listExceptions(params: FindScheduleExceptionsParams) {
    return httpClient.request<ScheduleException[]>(
      "/admin/schedule/exceptions",
      "GET",
      undefined,
      { params },
    );
  },

  createException(data: CreateScheduleExceptionRequest) {
    return httpClient.request<ScheduleChangeResult>(
      "/admin/schedule/exceptions",
      "POST",
      data,
    );
  },

  deleteException(exceptionId: string) {
    return httpClient.request<ScheduleChangeResult>(
      `/admin/schedule/exceptions/${exceptionId}`,
      "DELETE",
    );
  },
};
