import { httpClient } from "@/src/lib/api/client";
import type {
  ClientDetail,
  ClientView,
  CreateClientRequest,
  FindClientsParams,
  HairProfileView,
  PaginatedClients,
  RecordConsentRequest,
  ResolveClientRequest,
  SetHairProfileRequest,
  UpdateClientRequest,
  PaginatedPendingHairProfiles,
} from "../types/clients.types";

export const clientsApi = {
  search(params: FindClientsParams) {
    return httpClient.request<PaginatedClients>("/clients", "GET", undefined, {
      params,
    });
  },

  findOne(clientId: string) {
    return httpClient.request<ClientDetail>(`/clients/${clientId}`, "GET");
  },

  create(data: CreateClientRequest) {
    return httpClient.request<ClientView>("/clients", "POST", data);
  },

  resolve(data: ResolveClientRequest) {
    return httpClient.request("/clients/resolve", "POST", data);
  },

  update(clientId: string, data: UpdateClientRequest) {
    return httpClient.request<ClientView>(
      `/clients/${clientId}`,
      "PATCH",
      data,
    );
  },

  setHairProfile(clientId: string, data: SetHairProfileRequest) {
    return httpClient.request<HairProfileView>(
      `/clients/${clientId}/hair-profile`,
      "PUT",
      data,
    );
  },

  findPendingHairProfiles(params: { page?: number; pageSize?: number }) {
    return httpClient.request<PaginatedPendingHairProfiles>(
      "/clients/hair-profiles/pending",
      "GET",
      undefined,
      { params },
    );
  },

  confirmHairProfile(clientId: string) {
    return httpClient.request<HairProfileView>(
      `/clients/${clientId}/hair-profile/confirm`,
      "POST",
    );
  },

  recordConsent(clientId: string, data: RecordConsentRequest) {
    return httpClient.request<ClientDetail>(
      `/clients/${clientId}/consents`,
      "POST",
      data,
    );
  },
};
