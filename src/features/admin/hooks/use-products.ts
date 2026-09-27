import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productsApi } from "../api/products.api";
import { adminQueryKeys } from "./query-keys";

import type {
  AssignProductTagsRequest,
  CreateProductCategoryRequest,
  CreateProductRequest,
  CreateProductTagRequest,
  CreateProductVariantRequest,
  CreateRecommendationRequest,
  FindProductsParams,
  LogProductViewRequest,
  UpdateProductCategoryRequest,
  UpdateProductRequest,
  UpdateProductVariantRequest,
} from "../types/products.types";

const PRODUCTS_STALE_TIME = 5 * 60 * 1000;

export function useProducts(params?: FindProductsParams) {
  return useQuery({
    queryKey: adminQueryKeys.products.list(params),
    queryFn: () => productsApi.findMany(params),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: adminQueryKeys.products.detail(productId),
    queryFn: () => productsApi.findOne(productId),
    enabled: Boolean(productId),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: adminQueryKeys.products.categories.lists(),
    queryFn: () => productsApi.categories.findMany(),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useProductTags() {
  return useQuery({
    queryKey: adminQueryKeys.products.tags.lists(),
    queryFn: () => productsApi.tags.findMany(),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useProductRecommendations(treatmentId: string) {
  return useQuery({
    queryKey: adminQueryKeys.products.recommendations(treatmentId),
    queryFn: () => productsApi.recommendations.findByTreatment(treatmentId),
    enabled: Boolean(treatmentId),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useRecommendedProductsForClient(phone: string) {
  return useQuery({
    queryKey: adminQueryKeys.products.recommendedForClient(phone),
    queryFn: () => productsApi.findRecommendedForClient(phone),
    enabled: Boolean(phone),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: adminQueryKeys.products.related(productId),
    queryFn: () => productsApi.findRelated(productId),
    enabled: Boolean(productId),
    staleTime: PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "create"],
    mutationFn: (data: CreateProductRequest) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.lists(),
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "update"],
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => productsApi.update(productId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.detail(variables.productId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.lists(),
      });
    },
  });
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "categories", "create"],
    mutationFn: (data: CreateProductCategoryRequest) =>
      productsApi.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.categories.lists(),
      });
    },
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "categories", "update"],
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateProductCategoryRequest;
    }) => productsApi.categories.update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.categories.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.lists(),
      });
    },
  });
}

export function useCreateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "variants", "create"],
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: CreateProductVariantRequest;
    }) => productsApi.variants.create(productId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.detail(variables.productId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.lists(),
      });
    },
  });
}

export function useUpdateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "variants", "update"],
    mutationFn: ({
      variantId,
      data,
    }: {
      variantId: string;
      data: UpdateProductVariantRequest;
    }) => productsApi.variants.update(variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.all(),
      });
    },
  });
}

export function useCreateProductRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "recommendations", "create"],
    mutationFn: (data: CreateRecommendationRequest) =>
      productsApi.recommendations.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.recommendations(
          variables.treatmentId,
        ),
      });
    },
  });
}

export function useRemoveProductRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "recommendations", "remove"],
    mutationFn: ({
      recommendationId,
      treatmentId,
    }: {
      recommendationId: string;
      treatmentId: string;
    }) => productsApi.recommendations.remove(recommendationId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.recommendations(
          variables.treatmentId,
        ),
      });
    },
  });
}

export function useCreateProductTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "tags", "create"],
    mutationFn: (data: CreateProductTagRequest) =>
      productsApi.tags.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.tags.lists(),
      });
    },
  });
}

export function useToggleProductActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "toggle-active"],
    mutationFn: (productId: string) => productsApi.toggleActive(productId),
    onSuccess: (_data, productId) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.detail(productId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.lists(),
      });
    },
  });
}

export function useAssignProductTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", "assign-tags"],
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: AssignProductTagsRequest;
    }) => productsApi.assignTags(productId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.detail(variables.productId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products.lists(),
      });
    },
  });
}

export function useLogProductView() {
  return useMutation({
    mutationKey: ["admin", "products", "log-view"],
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: LogProductViewRequest;
    }) => productsApi.logView(productId, data),
  });
}
