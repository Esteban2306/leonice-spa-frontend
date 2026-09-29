import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
  GroupedReservation,
  GroupedReservationItem,
  RescheduleReservationRequest,
} from "../types/reservations.types";
import {
  PendingReservation,
  PendingReservationItem,
  PendingReservationsData,
} from "../types/dashboard.types";
import { useMemo } from "react";
import { ReservationStatus } from "../types/enums";

const RESERVATIONS_STALE_TIME = 30 * 1000;
const AVAILABILITY_STALE_TIME = 15 * 1000;

const PENDING_DEPOSIT_STATUS: ReservationStatus = "PENDIENTE_DEPOSITO";

interface UseReservationsOptions {
  keepPreviousData?: boolean;
  refetchIntervalMs?: number;
}

export function useReservations(
  params?: FindReservationsParams,
  options?: UseReservationsOptions,
) {
  return useQuery({
    queryKey: adminQueryKeys.reservations.list(params),
    queryFn: () => reservationsApi.findMany(params),
    staleTime: RESERVATIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
    refetchInterval: options?.refetchIntervalMs,
  });
}

const PENDING_REFETCH_INTERVAL_MS = 60 * 1000;

const DAY_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLabel(date: Date): string {
  const dayPart = DAY_FORMATTER.format(date).replace(".", "");
  const now = new Date();

  if (isSameCalendarDay(date, now)) return `Hoy · ${dayPart}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (isSameCalendarDay(date, tomorrow)) return `Mañana · ${dayPart}`;

  return dayPart;
}

function toPendingReservationItem(
  item: GroupedReservationItem,
): PendingReservationItem {
  const start = new Date(item.scheduledStart);
  const end = new Date(item.scheduledEnd);

  return {
    reservationId: item.reservationId,
    treatmentName: item.treatment.name,
    categoryLabel: item.category.name,
    durationMinutes: Math.round((end.getTime() - start.getTime()) / 60_000),
    timeLabel: TIME_FORMATTER.format(start),
    totalPrice: Number(item.finalPrice),
    proofUrl: item.latestDeposit?.imageUrl ?? null,
    verified: item.latestDeposit?.status === "CONFIRMADO",
    depositExpiresAt: item.depositExpiresAt,
  };
}

export function toPendingReservation(
  group: GroupedReservation,
): PendingReservation {
  return {
    clientId: group.client.id,
    client: {
      name: group.client.name,
      phone: group.client.phone,
    },
    dateLabel: formatDateLabel(new Date(group.items[0].scheduledStart)),
    items: group.items.map(toPendingReservationItem),
  };
}

interface UsePendingReservationsParams {
  page: number;
  pageSize: number;
}

export function usePendingReservations({
  page,
  pageSize,
}: UsePendingReservationsParams) {
  const query = useReservations(
    { status: PENDING_DEPOSIT_STATUS, page, pageSize },
    { keepPreviousData: true, refetchIntervalMs: PENDING_REFETCH_INTERVAL_MS },
  );

  const data = useMemo<PendingReservationsData | undefined>(() => {
    if (!query.data) return undefined;

    return {
      reservations: query.data.data.map(toPendingReservation),
      pagination: query.data.pagination,
    };
  }, [query.data]);

  return {
    data,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    isError: query.isError,
    refetch: query.refetch,
  };
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
