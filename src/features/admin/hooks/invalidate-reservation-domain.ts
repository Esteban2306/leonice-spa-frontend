import type { QueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "./query-keys";

export async function invalidateReservationDomain(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.reservations.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.deposits.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.calendar.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.dashboard.summary(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.clients.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.reports.all(),
    }),
  ]);
}
