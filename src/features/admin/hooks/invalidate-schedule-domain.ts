import type { QueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "./query-keys";

export async function invalidateScheduleDomain(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.schedule.all() }),
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.calendar.all() }),
    queryClient.invalidateQueries({
      queryKey: [...adminQueryKeys.reservations.all(), "availability"],
    }),
  ]);
}
