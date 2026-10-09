import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoriesApi } from "../api/categoties.api";
import { invalidateCatalogDomain } from "./invalidate-catalog-domain";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateCategoryRequest,
  FindAdminCategoriesParams,
  UpdateCategoryRequest,
} from "../types/categories.types";

const CATEGORIES_STALE_TIME = 10 * 60 * 1000;
const ADMIN_CATEGORIES_STALE_TIME = 60 * 1000;

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

export function useAdminCategories(params: FindAdminCategoriesParams = {}) {
  return useQuery({
    queryKey: adminQueryKeys.categories.adminList(params),
    queryFn: ({ signal }) => categoriesApi.findAdmin(params, { signal }),
    staleTime: ADMIN_CATEGORIES_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
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
    onSuccess: () => invalidateCatalogDomain(queryClient),
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
    onSuccess: () => invalidateCatalogDomain(queryClient),
  });
}
