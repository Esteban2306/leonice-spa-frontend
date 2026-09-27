import type { HairColor, HairLength } from "../types/enums";

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
  hairLength?: HairLength;
  hairColor?: HairColor;
}
