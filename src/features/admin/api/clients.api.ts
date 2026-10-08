import { httpClient } from "@/src/lib/api/client";
import type {
  FindClientsParams,
  ResolveClientRequest,
  UpdateClientRequest,
} from "../types/clients.types";

export const clientsApi = {
  search(params: FindClientsParams) {
    return httpClient.request("/clients", "GET", undefined, { params });
  },

  findOne(clientId: string) {
    return httpClient.request(`/clients/${clientId}`, "GET");
  },

  resolve(data: ResolveClientRequest) {
    return httpClient.request("/clients/resolve", "POST", data);
  },

  update(clientId: string, data: UpdateClientRequest) {
    return httpClient.request(`/clients/${clientId}`, "PATCH", data);
  },
};
