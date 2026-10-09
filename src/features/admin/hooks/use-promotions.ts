import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { promotionsApi } from "../api/promotions.api";
import { invalidateCatalogDomain } from "./invalidate-catalog-domain";
import { adminQueryKeys } from "./query-keys";

import type {
  CreatePromotionRequest,
  FindPromotionsParams,
  UpdatePromotionRequest,
} from "../types/promotions.types";

const PROMOTIONS_STALE_TIME = 2 * 60 * 1000;

export function usePromotions(
  params?: FindPromotionsParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: adminQueryKeys.promotions.list(params),
    queryFn: ({ signal }) => promotionsApi.findMany(params, { signal }),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
    staleTime: PROMOTIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function usePromotion(promotionId: string) {
  return useQuery({
    queryKey: adminQueryKeys.promotions.detail(promotionId),
    queryFn: () => promotionsApi.findOne(promotionId),
    enabled: Boolean(promotionId),
    staleTime: PROMOTIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "promotions", "create"],
    mutationFn: (data: CreatePromotionRequest) => promotionsApi.create(data),
    onSuccess: () => invalidateCatalogDomain(queryClient),
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "promotions", "update"],
    mutationFn: ({
      promotionId,
      data,
    }: {
      promotionId: string;
      data: UpdatePromotionRequest;
    }) => promotionsApi.update(promotionId, data),
    onSuccess: () => invalidateCatalogDomain(queryClient),
  });
}

export function useDeactivatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "promotions", "deactivate"],
    mutationFn: (promotionId: string) => promotionsApi.deactivate(promotionId),
    onSuccess: () => invalidateCatalogDomain(queryClient),
  });
}
