import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  scheduleApi,
  type FindScheduleExceptionsParams,
} from "../api/schedule.api";
import { invalidateScheduleDomain } from "./invalidate-schedule-domain";
import { adminQueryKeys } from "./query-keys";

import type { CreateScheduleExceptionRequest } from "../types/schedule.types";

const SCHEDULE_STALE_TIME = 30 * 1000;

export function useScheduleDay(date: string) {
  return useQuery({
    queryKey: adminQueryKeys.schedule.day(date),
    queryFn: () => scheduleApi.getDay(date),
    enabled: Boolean(date),
    staleTime: SCHEDULE_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useScheduleExceptions(params: FindScheduleExceptionsParams) {
  return useQuery({
    queryKey: adminQueryKeys.schedule.exceptions(params),
    queryFn: () => scheduleApi.listExceptions(params),
    staleTime: SCHEDULE_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useCreateScheduleException() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "schedule", "create-exception"],
    mutationFn: (data: CreateScheduleExceptionRequest) =>
      scheduleApi.createException(data),
    onSuccess: () => invalidateScheduleDomain(queryClient),
  });
}

export function useDeleteScheduleException() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "schedule", "delete-exception"],
    mutationFn: (exceptionId: string) =>
      scheduleApi.deleteException(exceptionId),
    onSuccess: () => invalidateScheduleDomain(queryClient),
  });
}
