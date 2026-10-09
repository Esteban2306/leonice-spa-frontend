import type {
  CancellationSource,
  HairColor,
  HairLength,
  ReservationStatus,
} from "../types/enums";

export interface FindClientsParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface ResolveClientRequest {
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
}

export interface UpdateClientRequest {
  name?: string;
  birthDate?: string;
  allergies?: string;
  isPregnant?: boolean;
}

export interface CreateClientRequest {
  phone: string;
  name: string;
  birthDate: string;
  allergies?: string;
  isPregnant?: boolean;
  healthDataPolicyVersion?: string;
}

export type HairProfileStatus = "MISSING" | "EXPIRED" | "VALID";

export interface HairProfileView {
  hairLength: HairLength | null;
  hairColor: HairColor | null;
  updatedAt: string | null;
  validUntil: string | null;
  status: HairProfileStatus;
}

export interface SetHairProfileRequest {
  hairLength: HairLength;
  hairColor: HairColor;
}

export type ConsentType =
  "DATOS_SALUD" | "MARKETING" | "TERMINOS_SERVICIO" | "AUTORIZACION_MENOR";

export interface RecordConsentRequest {
  type: ConsentType;
  policyVersion: string;
}

export interface ClientListItem {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  reservationCount: number;
  lastReservation: { scheduledStart: string; status: ReservationStatus } | null;
  hairProfileStatus: HairProfileStatus;
}

export interface PaginatedClients {
  data: ClientListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientView {
  id: string;
  name: string;
  phone: string;
  whatsappJid: string | null;
  birthDate: string;
  allergies: string | null;
  isPregnant: boolean;
  hairProfile: HairProfileView;
  createdAt: string;
  updatedAt: string;
}

export interface ClientReservationSummary {
  reservationId: string;
  status: ReservationStatus;
  scheduledStart: string;
  scheduledEnd: string;
  treatment: string;
  category: string;
  finalPrice: number;
  comboGroupId: string | null;
  cancellationSource: CancellationSource | null;
}

export interface ClientDetail extends ClientView {
  stats: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    upcoming: number;
  };
  reservations: ClientReservationSummary[];
  consents: Array<{
    type: ConsentType;
    policyVersion: string;
    consentedAt: string;
  }>;
}

export const HEALTH_DATA_POLICY_VERSION = "v1.0-2026-08";

export interface PendingHairProfile {
  clientId: string;
  name: string;
  phone: string;
  hairProfile: HairProfileView;
  nextReservation: {
    reservationId: string;
    scheduledStart: string;
    status: string;
    treatment: string;
  } | null;
}

export interface PaginatedPendingHairProfiles {
  data: PendingHairProfile[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
