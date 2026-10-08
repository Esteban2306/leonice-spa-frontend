import { httpClient } from "@/src/lib/api/client";
import type {
  ApproveDepositRequest,
  ClientCreditSummary,
  PaginatedDeposits,
  FindDepositsParams,
  FindPendingDepositsParams,
  RejectDepositRequest,
  SubmitAutomaticDepositRequest,
} from "../types/deposits.types";

export interface SubmitDepositProofData {
  phone: string;
  image: File;
}

export const depositsApi = {
  findMany(params?: FindDepositsParams) {
    return httpClient.request<PaginatedDeposits>("/deposits", "GET", undefined, {
      params,
    });
  },

  findClientCredits(clientId: string) {
    return httpClient.request<ClientCreditSummary>(
      "/deposits/credits",
      "GET",
      undefined,
      { params: { clientId } },
    );
  },

  findPending(params: FindPendingDepositsParams) {
    return httpClient.request("/deposits/pending", "GET", undefined, {
      params,
    });
  },

  findByReservation(reservationId: string) {
    return httpClient.request(`/reservations/${reservationId}/deposits`, "GET");
  },

  submitProof(reservationId: string, data: SubmitDepositProofData) {
    const formData = new FormData();

    formData.append("phone", data.phone);
    formData.append("image", data.image);

    return httpClient.request(
      `/reservations/${reservationId}/deposits`,
      "POST",
      formData,
    );
  },

  submitAutomatic(data: SubmitAutomaticDepositRequest) {
    return httpClient.request("/deposits/automatic", "POST", data);
  },

  submitAutomaticForReservation(
    reservationId: string,
    data: SubmitAutomaticDepositRequest,
  ) {
    return httpClient.request(
      `/reservations/${reservationId}/deposits/automatic`,
      "POST",
      data,
    );
  },

  approve(reservationId: string, data: ApproveDepositRequest) {
    return httpClient.request(
      `/reservations/${reservationId}/deposits/approve`,
      "PATCH",
      data,
    );
  },

  reject(reservationId: string, data: RejectDepositRequest) {
    return httpClient.request(
      `/reservations/${reservationId}/deposits/reject`,
      "PATCH",
      data,
    );
  },
};
