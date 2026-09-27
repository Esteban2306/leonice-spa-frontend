import { httpClient } from "@/src/lib/api/client";
import type {
  CreatePromotionRequest,
  FindPromotionsParams,
  UpdatePromotionRequest,
} from "../types/promotions.types";

export const promotionsApi = {
  findMany(params?: FindPromotionsParams) {
    return httpClient.request("/promotions", "GET", {
      params,
    });
  },

  findOne(promotionId: string) {
    return httpClient.request(`/promotions/${promotionId}`, "GET");
  },

  create(data: CreatePromotionRequest) {
    return httpClient.request("/promotions", "POST", data);
  },

  update(promotionId: string, data: UpdatePromotionRequest) {
    return httpClient.request(`/promotions/${promotionId}`, "PATCH", data);
  },

  deactivate(promotionId: string) {
    return httpClient.request(`/promotions/${promotionId}/deactivate`, "PATCH");
  },
};
