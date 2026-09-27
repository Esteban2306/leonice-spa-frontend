import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoriesApi } from "../api/categoties.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categories.types";

const CATEGORIES_STALE_TIME = 10 * 60 * 1000;

export function useCategories() {
  return useQuery({
    queryKey: adminQueryKeys.categories.lists(),
    queryFn: () => categoriesApi.findMany(),
    staleTime: CATEGORIES_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: adminQueryKeys.categories.detail(categoryId),
    queryFn: () => categoriesApi.findOne(categoryId),
    enabled: Boolean(categoryId),
    staleTime: CATEGORIES_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "categories", "create"],
    mutationFn: (data: CreateCategoryRequest) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.categories.lists(),
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "categories", "update"],
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryRequest;
    }) => categoriesApi.update(categoryId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.categories.detail(variables.categoryId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.categories.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.lists(),
      });
    },
  });
}
