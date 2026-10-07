import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { mapGroupedReservationToPendingReservation } from "../mapper/grouped-reservation.mapper";
import { reservationsListOptions } from "./use-reservations";

import type { PendingReservationsData } from "../types/dashboard.types";
import type { ReservationStatus } from "../types/enums";
import type { PaginatedGroupedReservations } from "../types/reservations.types";

const PENDING_DEPOSIT_STATUS: ReservationStatus = "PENDIENTE_DEPOSITO";
const PENDING_REFETCH_INTERVAL_MS = 60 * 1000;

function selectPendingReservations(
  response: PaginatedGroupedReservations,
): PendingReservationsData {
  return {
    reservations: response.data.map(mapGroupedReservationToPendingReservation),
    pagination: response.pagination,
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
  return useQuery({
    ...reservationsListOptions({
      status: PENDING_DEPOSIT_STATUS,
      page,
      pageSize,
    }),
    select: selectPendingReservations,
    placeholderData: keepPreviousData,
    refetchInterval: PENDING_REFETCH_INTERVAL_MS,
  });
}
