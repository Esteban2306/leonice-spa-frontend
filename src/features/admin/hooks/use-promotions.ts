import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { promotionsApi } from "../api/promotions.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreatePromotionRequest,
  FindPromotionsParams,
  UpdatePromotionRequest,
} from "../types/promotions.types";

const PROMOTIONS_STALE_TIME = 2 * 60 * 1000;

export function usePromotions(params?: FindPromotionsParams) {
  return useQuery({
    queryKey: adminQueryKeys.promotions.list(params),
    queryFn: () => promotionsApi.findMany(params),
    staleTime: PROMOTIONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.promotions.lists(),
      });
    },
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.promotions.detail(variables.promotionId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.promotions.lists(),
      });
    },
  });
}

export function useDeactivatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "promotions", "deactivate"],
    mutationFn: (promotionId: string) => promotionsApi.deactivate(promotionId),
    onSuccess: (_data, promotionId) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.promotions.detail(promotionId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.promotions.lists(),
      });
    },
  });
}
