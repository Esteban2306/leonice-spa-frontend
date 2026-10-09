import type { QueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "./query-keys";

export async function invalidateCatalogDomain(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.treatments.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.categories.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.capacityPools.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.promotions.all(),
    }),
    queryClient.invalidateQueries({
      queryKey: [...adminQueryKeys.reservations.all(), "availability"],
    }),
    queryClient.invalidateQueries({
      queryKey: [...adminQueryKeys.reservations.all(), "availability-calendar"],
    }),
  ]);
}
