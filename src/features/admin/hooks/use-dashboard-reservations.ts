import { useQuery } from "@tanstack/react-query";

import { buildDashboardViewParams } from "../dashboard/lib/dashboard-views";
import { mapGroupedReservationToDashboard } from "../mapper/grouped-reservation.mapper";
import { reservationsListOptions } from "./use-reservations";

import type {
  DashboardReservationsData,
  DashboardView,
} from "../types/dashboard.types";
import type { PaginatedGroupedReservations } from "../types/reservations.types";

const DASHBOARD_REFETCH_INTERVAL_MS = 60 * 1000;

function selectDashboardReservations(
  response: PaginatedGroupedReservations,
): DashboardReservationsData {
  const now = new Date();

  return {
    reservations: response.data.map((group) =>
      mapGroupedReservationToDashboard(group, now),
    ),
    pagination: response.pagination,
  };
}

interface UseDashboardReservationsParams {
  view: DashboardView;
  page: number;
  pageSize: number;
  todayKey: string;
}

export function useDashboardReservations({
  view,
  page,
  pageSize,
  todayKey,
}: UseDashboardReservationsParams) {
  const viewParams = buildDashboardViewParams(
    view,
    new Date(`${todayKey}T12:00:00-05:00`),
  );
  const viewSignature = JSON.stringify(viewParams);

  return useQuery({
    ...reservationsListOptions({ ...viewParams, page, pageSize }),
    select: selectDashboardReservations,
    placeholderData: (previous, previousQuery) => {
      const previousParams = previousQuery?.queryKey.at(-1) as
        | Record<string, unknown>
        | undefined;
      if (!previousParams) return undefined;
      const rest = Object.fromEntries(
        Object.entries(previousParams).filter(
          ([key]) => key !== "page" && key !== "pageSize",
        ),
      );
      return JSON.stringify(rest) === viewSignature ? previous : undefined;
    },
    refetchInterval: DASHBOARD_REFETCH_INTERVAL_MS,
  });
}
