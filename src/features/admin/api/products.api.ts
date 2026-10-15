import { httpClient } from "@/src/lib/api/client";
import type {
  AdminProduct,
  AdminProductCategory,
  AdminProductDetail,
  AdminProductTag,
  CreateProductCategoryRequest,
  CreateProductRequest,
  CreateProductTagRequest,
  CreateProductVariantRequest,
  CreateRecommendationRequest,
  FindAdminProductsParams,
  ProductRecommendation,
  ProductTag,
  ProductVariant,
  UpdateProductCategoryRequest,
  UpdateProductRequest,
  UpdateProductTagRequest,
  UpdateProductVariantRequest,
} from "../types/products.types";

export const productsApi = {
  findManyForAdmin(params?: FindAdminProductsParams) {
    return httpClient.request<AdminProduct[]>(
      "/products/admin",
      "GET",
      undefined,
      {
        params: params ? { ...params } : undefined,
      },
    );
  },

  findOneForAdmin(productId: string) {
    return httpClient.request<AdminProductDetail>(
      `/products/admin/${productId}`,
      "GET",
    );
  },

  create(data: CreateProductRequest) {
    return httpClient.request<AdminProduct>("/products", "POST", data);
  },

  update(productId: string, data: UpdateProductRequest) {
    return httpClient.request<AdminProduct>(
      `/products/${productId}`,
      "PATCH",
      data,
    );
  },

  toggleActive(productId: string) {
    return httpClient.request<AdminProduct>(
      `/products/${productId}/toggle`,
      "PATCH",
    );
  },

  remove(productId: string) {
    return httpClient.request<null>(`/products/${productId}`, "DELETE");
  },

  assignTags(productId: string, tagIds: string[]) {
    return httpClient.request<null>(`/products/${productId}/tags`, "PATCH", {
      tagIds,
    });
  },

  variants: {
    create(productId: string, data: CreateProductVariantRequest) {
      return httpClient.request<ProductVariant>(
        `/products/${productId}/variants`,
        "POST",
        data,
      );
    },

    update(variantId: string, data: UpdateProductVariantRequest) {
      return httpClient.request<ProductVariant>(
        `/products/variants/${variantId}`,
        "PATCH",
        data,
      );
    },

    remove(variantId: string) {
      return httpClient.request<null>(
        `/products/variants/${variantId}`,
        "DELETE",
      );
    },

    uploadImage(variantId: string, file: File) {
      const form = new FormData();
      form.append("image", file);
      return httpClient.request<ProductVariant>(
        `/products/variants/${variantId}/image`,
        "POST",
        form,
      );
    },

    removeImage(variantId: string) {
      return httpClient.request<ProductVariant>(
        `/products/variants/${variantId}/image`,
        "DELETE",
      );
    },
  },

  categories: {
    findManyForAdmin() {
      return httpClient.request<AdminProductCategory[]>(
        "/products/categories/admin",
        "GET",
      );
    },

    create(data: CreateProductCategoryRequest) {
      return httpClient.request<AdminProductCategory>(
        "/products/categories",
        "POST",
        data,
      );
    },

    update(categoryId: string, data: UpdateProductCategoryRequest) {
      return httpClient.request<AdminProductCategory>(
        `/products/categories/${categoryId}`,
        "PATCH",
        data,
      );
    },

    remove(categoryId: string) {
      return httpClient.request<null>(
        `/products/categories/${categoryId}`,
        "DELETE",
      );
    },
  },

  tags: {
    findManyForAdmin() {
      return httpClient.request<AdminProductTag[]>(
        "/products/tags/admin",
        "GET",
      );
    },

    create(data: CreateProductTagRequest) {
      return httpClient.request<ProductTag>("/products/tags", "POST", data);
    },

    update(tagId: string, data: UpdateProductTagRequest) {
      return httpClient.request<ProductTag>(
        `/products/tags/${tagId}`,
        "PATCH",
        data,
      );
    },

    remove(tagId: string) {
      return httpClient.request<null>(`/products/tags/${tagId}`, "DELETE");
    },
  },

  recommendations: {
    create(data: CreateRecommendationRequest) {
      return httpClient.request<ProductRecommendation>(
        "/products/recommendations",
        "POST",
        data,
      );
    },

    remove(recommendationId: string) {
      return httpClient.request<null>(
        `/products/recommendations/${recommendationId}`,
        "DELETE",
      );
    },
  },
};
