import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";
import type {
  CapacityPool,
  CreateCapacityPoolRequest,
  FindCapacityPoolsParams,
  UpdateCapacityPoolRequest,
} from "../types/capacity-pools.types";

export const capacityPoolsApi = {
  findMany(params?: FindCapacityPoolsParams, options: QueryOptions = {}) {
    return httpClient.request<CapacityPool[]>(
      "/capacity-pools",
      "GET",
      undefined,
      { params, signal: options.signal },
    );
  },

  findOne(poolId: string) {
    return httpClient.request<CapacityPool>(`/capacity-pools/${poolId}`, "GET");
  },

  create(data: CreateCapacityPoolRequest) {
    return httpClient.request<CapacityPool>("/capacity-pools", "POST", data);
  },

  update(poolId: string, data: UpdateCapacityPoolRequest) {
    return httpClient.request<CapacityPool>(
      `/capacity-pools/${poolId}`,
      "PATCH",
      data,
    );
  },
};
