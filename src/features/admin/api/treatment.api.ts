import { httpClient } from "@/src/lib/api/client";
import type {
  CreateTreatmentRequest,
  FindTreatmentsParams,
  SetHairColorSurchargesRequest,
  SetHairLengthPricingRequest,
  UpdateTreatmentRequest,
} from "../types/treatments.types";

export const treatmentsApi = {
  findMany(params?: FindTreatmentsParams) {
    return httpClient.request("/treatments", "GET", {
      params,
    });
  },

  findOne(treatmentId: string) {
    return httpClient.request(`/treatments/${treatmentId}`, "GET");
  },

  create(data: CreateTreatmentRequest) {
    return httpClient.request("/treatments", "POST", data);
  },

  update(treatmentId: string, data: UpdateTreatmentRequest) {
    return httpClient.request(`/treatments/${treatmentId}`, "PATCH", data);
  },

  getHairLengthPricing(treatmentId: string) {
    return httpClient.request(
      `/treatments/${treatmentId}/hair-length-pricing`,
      "GET",
    );
  },

  setHairLengthPricing(treatmentId: string, data: SetHairLengthPricingRequest) {
    return httpClient.request(
      `/treatments/${treatmentId}/hair-length-pricing`,
      "PATCH",
      data,
    );
  },

  getHairColorSurcharges(treatmentId: string) {
    return httpClient.request(
      `/treatments/${treatmentId}/hair-color-surcharges`,
      "GET",
    );
  },

  setHairColorSurcharges(
    treatmentId: string,
    data: SetHairColorSurchargesRequest,
  ) {
    return httpClient.request(
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
