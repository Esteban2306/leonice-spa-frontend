import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { capacityPoolsApi } from "../api/capacity-pools.api";
import { invalidateCatalogDomain } from "./invalidate-catalog-domain";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateCapacityPoolRequest,
  FindCapacityPoolsParams,
  UpdateCapacityPoolRequest,
} from "../types/capacity-pools.types";

const CAPACITY_POOLS_STALE_TIME = 5 * 60 * 1000;

export function useCapacityPools(params: FindCapacityPoolsParams = {}) {
  return useQuery({
    queryKey: adminQueryKeys.capacityPools.list(params),
    queryFn: ({ signal }) => capacityPoolsApi.findMany(params, { signal }),
    staleTime: CAPACITY_POOLS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useCapacityPool(poolId: string) {
  return useQuery({
    queryKey: adminQueryKeys.capacityPools.detail(poolId),
    queryFn: () => capacityPoolsApi.findOne(poolId),
    enabled: Boolean(poolId),
    staleTime: CAPACITY_POOLS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useCreateCapacityPool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "capacity-pools", "create"],
    mutationFn: (data: CreateCapacityPoolRequest) =>
      capacityPoolsApi.create(data),
    onSuccess: () => invalidateCatalogDomain(queryClient),
  });
}

export function useUpdateCapacityPool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "capacity-pools", "update"],
    mutationFn: ({
      poolId,
      data,
    }: {
      poolId: string;
      data: UpdateCapacityPoolRequest;
    }) => capacityPoolsApi.update(poolId, data),
    onSuccess: () => invalidateCatalogDomain(queryClient),
  });
}
