import type { ReservationChannel, ReservationStatus } from "../types/enums";

export interface FindReservationsParams {
  date?: string;
  status?: ReservationStatus;
  categoryId?: string;
  clientId?: string;
  hasUnresolvedDeposit?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GetAvailabilityParams {
  treatmentId: string;
  date: string;
}

export interface RescheduleReservationRequest {
  phone: string;
  newScheduledStart: string;
}

export interface CreateReservationRequest {
  client: {
    phone: string;
    whatsappJid?: string;
    name?: string;
    birthDate?: string;
    allergies?: string;
    isPregnant?: boolean;
    consent?: {
      healthDataConsent: boolean;
      policyVersion: string;
    };
    hairLength?: import("../types/enums").HairLength;
    hairColor?: import("../types/enums").HairColor;
  };
  treatments: string[];
  scheduledStart: string;
  channel?: ReservationChannel;
}

export interface ConfirmValoracionRequest {
  finalPrice: number;
  finalDurationMinutes: number;
}

export interface CancelReservationRequest {
  phone: string;
  reason?: string;
}

export interface AdminRescheduleReservationRequest {
  newScheduledStart: string;
  notifyClient?: boolean;
  internalNote?: string;
}

export interface AdminCancelReservationRequest {
  reason?: string;
  notifyClient?: boolean;
}
