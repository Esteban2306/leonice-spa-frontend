import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { productsApi } from "../api/products.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateProductCategoryRequest,
  CreateProductRequest,
  CreateProductTagRequest,
  CreateProductVariantRequest,
  CreateRecommendationRequest,
  FindAdminProductsParams,
  UpdateProductCategoryRequest,
  UpdateProductRequest,
  UpdateProductTagRequest,
  UpdateProductVariantRequest,
} from "../types/products.types";

const ADMIN_PRODUCTS_STALE_TIME = 60 * 1000;

function invalidateProducts(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: adminQueryKeys.products.all(),
  });
}

export function useAdminProducts(params: FindAdminProductsParams) {
  return useQuery({
    queryKey: adminQueryKeys.products.list(params),
    queryFn: () => productsApi.findManyForAdmin(params),
    placeholderData: keepPreviousData,
    staleTime: ADMIN_PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useAdminProduct(productId: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.products.detail(productId ?? ""),
    queryFn: () => productsApi.findOneForAdmin(productId ?? ""),
    enabled: Boolean(productId),
    staleTime: ADMIN_PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useAdminProductCategories() {
  return useQuery({
    queryKey: adminQueryKeys.products.categories.lists(),
    queryFn: () => productsApi.categories.findManyForAdmin(),
    staleTime: ADMIN_PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useAdminProductTags() {
  return useQuery({
    queryKey: adminQueryKeys.products.tags.lists(),
    queryFn: () => productsApi.tags.findManyForAdmin(),
    staleTime: ADMIN_PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

function useProductsMutation<TVariables, TResult>(
  name: string,
  mutationFn: (variables: TVariables) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "products", name],
    mutationFn,
    onSuccess: () => invalidateProducts(queryClient),
  });
}

export function useCreateProduct() {
  return useProductsMutation("create", (data: CreateProductRequest) =>
    productsApi.create(data),
  );
}

export function useUpdateProduct() {
  return useProductsMutation(
    "update",
    ({ productId, data }: { productId: string; data: UpdateProductRequest }) =>
      productsApi.update(productId, data),
  );
}

export function useToggleProductActive() {
  return useProductsMutation("toggle-active", (productId: string) =>
    productsApi.toggleActive(productId),
  );
}

export function useRemoveProduct() {
  return useProductsMutation("remove", (productId: string) =>
    productsApi.remove(productId),
  );
}

export function useAssignProductTags() {
  return useProductsMutation(
    "assign-tags",
    ({ productId, tagIds }: { productId: string; tagIds: string[] }) =>
      productsApi.assignTags(productId, tagIds),
  );
}

export function useCreateProductVariant() {
  return useProductsMutation(
    "variants-create",
    ({
      productId,
      data,
    }: {
      productId: string;
      data: CreateProductVariantRequest;
    }) => productsApi.variants.create(productId, data),
  );
}

export function useUpdateProductVariant() {
  return useProductsMutation(
    "variants-update",
    ({
      variantId,
      data,
    }: {
      variantId: string;
      data: UpdateProductVariantRequest;
    }) => productsApi.variants.update(variantId, data),
  );
}

export function useRemoveProductVariant() {
  return useProductsMutation("variants-remove", (variantId: string) =>
    productsApi.variants.remove(variantId),
  );
}

export function useUploadVariantImage() {
  return useProductsMutation(
    "variants-upload-image",
    ({ variantId, file }: { variantId: string; file: File }) =>
      productsApi.variants.uploadImage(variantId, file),
  );
}

export function useRemoveVariantImage() {
  return useProductsMutation("variants-remove-image", (variantId: string) =>
    productsApi.variants.removeImage(variantId),
  );
}

export function useCreateProductCategory() {
  return useProductsMutation(
    "categories-create",
    (data: CreateProductCategoryRequest) => productsApi.categories.create(data),
  );
}

export function useUpdateProductCategory() {
  return useProductsMutation(
    "categories-update",
    ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateProductCategoryRequest;
    }) => productsApi.categories.update(categoryId, data),
  );
}

export function useRemoveProductCategory() {
  return useProductsMutation("categories-remove", (categoryId: string) =>
    productsApi.categories.remove(categoryId),
  );
}

export function useCreateProductTag() {
  return useProductsMutation("tags-create", (data: CreateProductTagRequest) =>
    productsApi.tags.create(data),
  );
}

export function useUpdateProductTag() {
  return useProductsMutation(
    "tags-update",
    ({ tagId, data }: { tagId: string; data: UpdateProductTagRequest }) =>
      productsApi.tags.update(tagId, data),
  );
}

export function useRemoveProductTag() {
  return useProductsMutation("tags-remove", (tagId: string) =>
    productsApi.tags.remove(tagId),
  );
}

export function useCreateProductRecommendation() {
  return useProductsMutation(
    "recommendations-create",
    (data: CreateRecommendationRequest) =>
      productsApi.recommendations.create(data),
  );
}

export function useRemoveProductRecommendation() {
  return useProductsMutation(
    "recommendations-remove",
    (recommendationId: string) =>
      productsApi.recommendations.remove(recommendationId),
  );
}
