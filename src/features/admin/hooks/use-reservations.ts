import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { reservationsApi } from "../api/reservations.api";
import { invalidateReservationDomain } from "./invalidate-reservation-domain";
import { adminQueryKeys } from "./query-keys";

import type {
  AdminCancelReservationRequest,
  AdminRescheduleReservationRequest,
  CancelReservationRequest,
  ConfirmValoracionRequest,
  CreateReservationRequest,
  FindReservationsParams,
  GetAvailabilityParams,
  RescheduleReservationRequest,
} from "../types/reservations.types";

const RESERVATIONS_STALE_TIME = 30 * 1000;
const AVAILABILITY_STALE_TIME = 15 * 1000;

export function reservationsListOptions(params?: FindReservationsParams) {
  return queryOptions({
    queryKey: adminQueryKeys.reservations.list(params),
    queryFn: () => reservationsApi.findMany(params),
    staleTime: RESERVATIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

interface UseReservationsOptions {
  keepPreviousData?: boolean;
  refetchIntervalMs?: number;
}

export function useReservations(
  params?: FindReservationsParams,
  options?: UseReservationsOptions,
) {
  return useQuery({
    ...reservationsListOptions(params),
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
    refetchInterval: options?.refetchIntervalMs,
  });
}

export function useReservation(reservationId: string) {
  return useQuery({
    queryKey: adminQueryKeys.reservations.detail(reservationId),
    queryFn: () => reservationsApi.findOne(reservationId),
    enabled: Boolean(reservationId),
    staleTime: RESERVATIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

export function useReservationAvailability(params: GetAvailabilityParams) {
  return useQuery({
    queryKey: adminQueryKeys.reservations.availability(params),
    queryFn: () => reservationsApi.getAvailability(params),
    enabled: Boolean(params.treatmentId && params.date),
    staleTime: AVAILABILITY_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "create"],
    mutationFn: (data: CreateReservationRequest) =>
      reservationsApi.create(data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "cancel"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: CancelReservationRequest;
    }) => reservationsApi.cancel(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useAdminCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "admin-cancel"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: AdminCancelReservationRequest;
    }) => reservationsApi.adminCancel(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useRescheduleReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "reschedule"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: RescheduleReservationRequest;
    }) => reservationsApi.reschedule(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useAdminRescheduleReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "admin-reschedule"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: AdminRescheduleReservationRequest;
    }) => reservationsApi.adminReschedule(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useCheckInReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "check-in"],
    mutationFn: (reservationId: string) =>
      reservationsApi.checkIn(reservationId),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useCompleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "complete"],
    mutationFn: (reservationId: string) =>
      reservationsApi.complete(reservationId),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useConfirmValoracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "confirm-valoracion"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: ConfirmValoracionRequest;
    }) => reservationsApi.confirmValoracion(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}
