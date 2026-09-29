import { useMemo } from "react";
import { useReservations } from "./use-reservations";
import { mapGroupedReservationToPendingReservation } from "../mapper/grouped-reservation.mapper";
import type { ApiGroupedReservation } from "../mapper/grouped-reservation.mapper";

const PENDING_DEPOSIT_STATUS = "PENDIENTE_DEPOSITO" as const;

interface UsePendingReservationsParams {
  page: number;
  pageSize: number;
}

interface PendingReservationsApiResponse {
  data: ApiGroupedReservation[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function usePendingReservations({
  page,
  pageSize,
}: UsePendingReservationsParams) {
  const query = useReservations({
    status: PENDING_DEPOSIT_STATUS,
    page,
    pageSize,
  });

  const mapped = useMemo(() => {
    const response = query.data as PendingReservationsApiResponse | undefined;
    if (!response) return undefined;

    return {
      reservations: response.data.map(
        mapGroupedReservationToPendingReservation,
      ),
      pagination: response.pagination,
    };
  }, [query.data]);

  return {
    ...query,
    data: mapped,
  };
}
