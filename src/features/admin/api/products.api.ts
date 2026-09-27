import { httpClient } from "@/src/lib/api/client";
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

export const productsApi = {
  categories: {
    findMany() {
      return httpClient.request("/products/categories", "GET");
    },

    create(data: CreateProductCategoryRequest) {
      return httpClient.request("/products/categories", "POST", data);
    },

    update(categoryId: string, data: UpdateProductCategoryRequest) {
      return httpClient.request(
        `/products/categories/${categoryId}`,
        "PATCH",
        data,
      );
    },
  },

  recommendations: {
    findByTreatment(treatmentId: string) {
      return httpClient.request(
        `/products/recommendations/${treatmentId}`,
        "GET",
      );
    },

    create(data: CreateRecommendationRequest) {
      return httpClient.request("/products/recommendations", "POST", data);
    },

    remove(recommendationId: string) {
      return httpClient.request(
        `/products/recommendations/${recommendationId}`,
        "DELETE",
      );
    },
  },

  findMany(params?: FindProductsParams) {
    return httpClient.request("/products", "GET", {
      params,
    });
  },

  findOne(productId: string) {
    return httpClient.request(`/products/${productId}`, "GET");
  },

  create(data: CreateProductRequest) {
    return httpClient.request("/products", "POST", data);
  },

  update(productId: string, data: UpdateProductRequest) {
    return httpClient.request(`/products/${productId}`, "PATCH", data);
  },

  variants: {
    create(productId: string, data: CreateProductVariantRequest) {
      return httpClient.request(
        `/products/${productId}/variants`,
        "POST",
        data,
      );
    },

    update(variantId: string, data: UpdateProductVariantRequest) {
      return httpClient.request(
        `/products/variants/${variantId}`,
        "PATCH",
        data,
      );
    },
  },

  tags: {
    findMany() {
      return httpClient.request("/products/tags", "GET");
    },

    create(data: CreateProductTagRequest) {
      return httpClient.request("/products/tags", "POST", data);
    },
  },

  findRecommendedForClient(phone: string) {
    return httpClient.request("/products/recommended-for-client", "GET", {
      params: { phone },
    });
  },

  toggleActive(productId: string) {
    return httpClient.request(`/products/${productId}/toggle`, "PATCH");
  },

  assignTags(productId: string, data: AssignProductTagsRequest) {
    return httpClient.request(`/products/${productId}/tags`, "PATCH", data);
  },

  findRelated(productId: string) {
    return httpClient.request(`/products/${productId}/related`, "GET");
  },

  logView(productId: string, data: LogProductViewRequest) {
    return httpClient.request(`/products/${productId}/view`, "POST", data);
  },
};
