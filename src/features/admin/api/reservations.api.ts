import { httpClient } from "@/src/lib/api/client";
import type {
  AdminCancelReservationRequest,
  AdminRescheduleReservationRequest,
  CancelReservationRequest,
  ConfirmValoracionRequest,
  CreateReservationRequest,
  FindReservationsParams,
  GetAvailabilityParams,
  IssueCancellationLinkRequest,
  IssuedCancellationLink,
  PaginatedGroupedReservations,
  ReservationDetail,
  RescheduleReservationRequest,
} from "../types/reservations.types";

export const reservationsApi = {
  findMany(params?: FindReservationsParams) {
    return httpClient.request<PaginatedGroupedReservations>(
      "/reservations",
      "GET",
      undefined,
      { params },
    );
  },

  getAvailability(params: GetAvailabilityParams) {
    return httpClient.request("/reservations/availability", "GET", undefined, {
      params,
    });
  },

  findOne(reservationId: string) {
    return httpClient.request<ReservationDetail>(
      `/reservations/${reservationId}`,
      "GET",
    );
  },

  create(data: CreateReservationRequest) {
    return httpClient.request("/reservations", "POST", data);
  },

  cancel(reservationId: string, data: CancelReservationRequest) {
    return httpClient.request(
      `/reservations/${reservationId}/cancel`,
      "PATCH",
      data,
    );
  },

  adminCancel(reservationId: string, data: AdminCancelReservationRequest) {
    return httpClient.request(
      `/reservations/${reservationId}/admin-cancel`,
      "PATCH",
      data,
    );
  },

  reschedule(reservationId: string, data: RescheduleReservationRequest) {
    return httpClient.request(
      `/reservations/${reservationId}/reschedule`,
      "PATCH",
      data,
    );
  },

  adminReschedule(
    reservationId: string,
    data: AdminRescheduleReservationRequest,
  ) {
    return httpClient.request(
      `/reservations/${reservationId}/admin-reschedule`,
      "PATCH",
      data,
    );
  },

  revive(reservationId: string) {
    return httpClient.request(
      `/reservations/${reservationId}/revive`,
      "PATCH",
    );
  },

  issueCancellationLink(
    reservationId: string,
    data: IssueCancellationLinkRequest,
  ) {
    return httpClient.request<IssuedCancellationLink>(
      `/reservations/${reservationId}/cancellation-link`,
      "POST",
      data,
    );
  },

  checkIn(reservationId: string) {
    return httpClient.request(
      `/reservations/${reservationId}/check-in`,
      "PATCH",
    );
  },

  complete(reservationId: string) {
    return httpClient.request(
      `/reservations/${reservationId}/complete`,
      "PATCH",
    );
  },

  confirmValoracion(reservationId: string, data: ConfirmValoracionRequest) {
    return httpClient.request(
      `/reservations/${reservationId}/confirm-valoracion`,
      "PATCH",
      data,
    );
  },
};
