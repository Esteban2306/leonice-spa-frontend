import type {
  CancellationSource,
  DepositCoverage,
  DepositStatus,
  ReservationChannel,
  ReservationStatus,
} from "../types/enums";

export type FindReservationsParams = {
  date?: string;
  from?: string;
  to?: string;
  status?: ReservationStatus;
  cancellationSources?: string;
  categoryId?: string;
  clientId?: string;
  hasUnresolvedDeposit?: boolean;
  page?: number;
  pageSize?: number;
};

export type GetAvailabilityParams = {
  treatmentId: string;
  date: string;
};

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

export interface IssueCancellationLinkRequest {
  send: boolean;
}

export interface IssuedCancellationLink {
  reservationId: string;
  url: string;
  expiresAt: string;
  sent: boolean;
}

export interface ReservationDetail {
  id: string;
  status: ReservationStatus;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface LatestDepositSummary {
  status: DepositStatus;
  coverage: DepositCoverage | null;
  imageUrl: string | null;
  amount: string | null;
}

export interface GroupedReservationItem {
  reservationId: string;
  treatment: { id: string; name: string };
  category: { id: string; name: string };
  status: ReservationStatus;
  scheduledStart: string;
  scheduledEnd: string;
  finalPrice: string;
  latestDeposit: LatestDepositSummary | null;
  hasUnresolvedDeposit: boolean;
  isProofUnderReview: boolean;
  depositExpiresAt: string | null;
  cancellationSource: CancellationSource | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  checkedInAt: string | null;
}

export interface GroupedReservation {
  isCombo: boolean;
  comboGroupId: string | null;
  client: { id: string; name: string; phone: string };
  items: GroupedReservationItem[];
}

export interface ReservationsPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedGroupedReservations {
  data: GroupedReservation[];
  pagination: ReservationsPagination;
}
