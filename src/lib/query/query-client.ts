import { MutationCache, QueryClient } from "@tanstack/react-query";

import { HttpError } from "../api/http-error";

const STALE_DATA_STATUSES = new Set([404, 409]);

export function isStaleDataError(error: unknown): boolean {
  return error instanceof HttpError && STALE_DATA_STATUSES.has(error.status);
}

export function createQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isStaleDataError(error)) void queryClient.invalidateQueries();
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return queryClient;
}
