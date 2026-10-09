import { httpClient } from "@/src/lib/api/client";
import type {
  BaseScheduleWindow,
  CreateScheduleExceptionRequest,
  ScheduleChangeResult,
  ScheduleDay,
  ScheduleException,
  UpdateBaseScheduleRequest,
  UpdateBaseScheduleResult,
} from "../types/schedule.types";

export interface FindScheduleExceptionsParams {
  from: string;
  to: string;
  categoryId?: string;
}

export const scheduleApi = {
  getBase() {
    return httpClient.request<BaseScheduleWindow[]>(
      "/admin/schedule/base",
      "GET",
    );
  },

  updateBase(data: UpdateBaseScheduleRequest) {
    return httpClient.request<UpdateBaseScheduleResult>(
      "/admin/schedule/base",
      "PUT",
      data,
    );
  },

  getDay(date: string) {
    return httpClient.request<ScheduleDay>(
      `/admin/schedule/days/${date}`,
      "GET",
    );
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
