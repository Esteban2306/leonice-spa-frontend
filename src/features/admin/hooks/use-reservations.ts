import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reservationsApi } from "../api/reservations.api";
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

export function useReservations(params?: FindReservationsParams) {
  return useQuery({
    queryKey: adminQueryKeys.reservations.list(params),
    queryFn: () => reservationsApi.findMany(params),
    staleTime: RESERVATIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
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

function invalidateReservationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  reservationId?: string,
) {
  queryClient.invalidateQueries({
    queryKey: adminQueryKeys.reservations.lists(),
  });

  queryClient.invalidateQueries({
    queryKey: adminQueryKeys.calendar.all(),
  });

  queryClient.invalidateQueries({
    queryKey: adminQueryKeys.dashboard.summary(),
  });

  if (reservationId) {
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.reservations.detail(reservationId),
    });

    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.deposits.byReservation(reservationId),
    });
  }
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "create"],
    mutationFn: (data: CreateReservationRequest) =>
      reservationsApi.create(data),
    onSuccess: (_data) => {
      invalidateReservationQueries(queryClient);
    },
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
    onSuccess: (_data, variables) => {
      invalidateReservationQueries(queryClient, variables.reservationId);
    },
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
    onSuccess: (_data, variables) => {
      invalidateReservationQueries(queryClient, variables.reservationId);
    },
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
    onSuccess: (_data, variables) => {
      invalidateReservationQueries(queryClient, variables.reservationId);
    },
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
    onSuccess: (_data, variables) => {
      invalidateReservationQueries(queryClient, variables.reservationId);
    },
  });
}

export function useCheckInReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "check-in"],
    mutationFn: (reservationId: string) =>
      reservationsApi.checkIn(reservationId),
    onSuccess: (_data, reservationId) => {
      invalidateReservationQueries(queryClient, reservationId);
    },
  });
}

export function useCompleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "reservations", "complete"],
    mutationFn: (reservationId: string) =>
      reservationsApi.complete(reservationId),
    onSuccess: (_data, reservationId) => {
      invalidateReservationQueries(queryClient, reservationId);
    },
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
    onSuccess: (_data, variables) => {
      invalidateReservationQueries(queryClient, variables.reservationId);
    },
  });
}
