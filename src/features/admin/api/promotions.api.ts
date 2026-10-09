import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";
import type {
  CreatePromotionRequest,
  FindPromotionsParams,
  Promotion,
  UpdatePromotionRequest,
} from "../types/promotions.types";

export const promotionsApi = {
  findMany(params?: FindPromotionsParams, options: QueryOptions = {}) {
    return httpClient.request<Promotion[]>("/promotions", "GET", undefined, {
      params,
      signal: options.signal,
    });
  },

  findOne(promotionId: string) {
    return httpClient.request<Promotion>(`/promotions/${promotionId}`, "GET");
  },

  create(data: CreatePromotionRequest) {
    return httpClient.request<Promotion>("/promotions", "POST", data);
  },

  update(promotionId: string, data: UpdatePromotionRequest) {
    return httpClient.request<Promotion>(
      `/promotions/${promotionId}`,
      "PATCH",
      data,
    );
  },

  deactivate(promotionId: string) {
    return httpClient.request<Promotion>(
      `/promotions/${promotionId}/deactivate`,
      "PATCH",
    );
  },
};
