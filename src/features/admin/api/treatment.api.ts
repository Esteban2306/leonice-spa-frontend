import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";
import type {
  AdminTreatment,
  CreateTreatmentRequest,
  FindAdminTreatmentsParams,
  FindTreatmentsParams,
  HairColorSurchargeRow,
  HairLengthPricingRow,
  SetHairColorSurchargesRequest,
  SetHairLengthPricingRequest,
  Treatment,
  UpdateTreatmentRequest,
} from "../types/treatments.types";

export const treatmentsApi = {
  findMany(params?: FindTreatmentsParams) {
    return httpClient.request<Treatment[]>("/treatments", "GET", undefined, {
      params,
    });
  },

  findAdmin(params?: FindAdminTreatmentsParams, options: QueryOptions = {}) {
    return httpClient.request<AdminTreatment[]>(
      "/treatments/admin",
      "GET",
      undefined,
      { params, signal: options.signal },
    );
  },

  findOne(treatmentId: string) {
    return httpClient.request<Treatment>(`/treatments/${treatmentId}`, "GET");
  },

  create(data: CreateTreatmentRequest) {
    return httpClient.request<Treatment>("/treatments", "POST", data);
  },

  update(treatmentId: string, data: UpdateTreatmentRequest) {
    return httpClient.request<Treatment>(
      `/treatments/${treatmentId}`,
      "PATCH",
      data,
    );
  },

  uploadVideo(treatmentId: string, file: File) {
    const form = new FormData();
    form.append("video", file);
    return httpClient.request<Treatment>(
      `/treatments/${treatmentId}/video`,
      "POST",
      form,
    );
  },

  removeVideo(treatmentId: string) {
    return httpClient.request<Treatment>(
      `/treatments/${treatmentId}/video`,
      "DELETE",
    );
  },

  getHairLengthPricing(treatmentId: string) {
    return httpClient.request<HairLengthPricingRow[]>(
      `/treatments/${treatmentId}/hair-length-pricing`,
      "GET",
    );
  },

  setHairLengthPricing(treatmentId: string, data: SetHairLengthPricingRequest) {
    return httpClient.request<unknown>(
      `/treatments/${treatmentId}/hair-length-pricing`,
      "PATCH",
      data,
    );
  },

  getHairColorSurcharges(treatmentId: string) {
    return httpClient.request<HairColorSurchargeRow[]>(
      `/treatments/${treatmentId}/hair-color-surcharges`,
      "GET",
    );
  },

  setHairColorSurcharges(
    treatmentId: string,
    data: SetHairColorSurchargesRequest,
  ) {
    return httpClient.request<unknown>(
      `/treatments/${treatmentId}/hair-color-surcharges`,
      "PATCH",
      data,
    );
  },

  getHairPricingMatrix(treatmentId: string) {
    return httpClient.request(
      `/treatments/${treatmentId}/hair-pricing-matrix`,
      "GET",
    );
  },
};
