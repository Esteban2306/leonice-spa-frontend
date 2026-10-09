import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";
import type {
  AdminCategory,
  Category,
  CreateCategoryRequest,
  FindAdminCategoriesParams,
  UpdateCategoryRequest,
} from "../types/categories.types";

export const categoriesApi = {
  findMany() {
    return httpClient.request<Category[]>("/categories", "GET");
  },

  findAdmin(params?: FindAdminCategoriesParams, options: QueryOptions = {}) {
    return httpClient.request<AdminCategory[]>(
      "/categories/admin",
      "GET",
      undefined,
      { params, signal: options.signal },
    );
  },

  findOne(categoryId: string) {
    return httpClient.request<Category>(`/categories/${categoryId}`, "GET");
  },

  create(data: CreateCategoryRequest) {
    return httpClient.request<Category>("/categories", "POST", data);
  },

  update(categoryId: string, data: UpdateCategoryRequest) {
    return httpClient.request<Category>(
      `/categories/${categoryId}`,
      "PATCH",
      data,
    );
  },
};
