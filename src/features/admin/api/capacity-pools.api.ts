import { httpClient } from "@/src/lib/api/client";
import type {
  CreateCapacityPoolRequest,
  FindCapacityPoolsParams,
  UpdateCapacityPoolRequest,
} from "../types/capacity-pools.types";

export const capacityPoolsApi = {
  findByCategory(params: FindCapacityPoolsParams) {
    return httpClient.request("/capacity-pools", "GET", {
      params,
    });
  },

  findOne(poolId: string) {
    return httpClient.request(`/capacity-pools/${poolId}`, "GET");
  },

  create(data: CreateCapacityPoolRequest) {
    return httpClient.request("/capacity-pools", "POST", data);
  },

  update(poolId: string, data: UpdateCapacityPoolRequest) {
    return httpClient.request(`/capacity-pools/${poolId}`, "PATCH", data);
  },
};
