import { httpClient } from "@/src/lib/api/client";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categories.types";

export const categoriesApi = {
  findMany() {
    return httpClient.request("/categories", "GET");
  },

  findOne(categoryId: string) {
    return httpClient.request(`/categories/${categoryId}`, "GET");
  },

  create(data: CreateCategoryRequest) {
    return httpClient.request("/categories", "POST", data);
  },

  update(categoryId: string, data: UpdateCategoryRequest) {
    return httpClient.request(`/categories/${categoryId}`, "PATCH", data);
  },
};
