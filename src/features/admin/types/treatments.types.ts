import type { HairColor, HairLength } from "../types/enums";

export interface FindTreatmentsParams {
  categoryId?: string;
}

export interface Treatment {
  id: string;
  categoryId: string;
  name: string;
  isActive: boolean;
  requiresPriorAssessment: boolean;
  basePriceMin: string | null;
  basePriceMax: string | null;
  baseDurationMinMinutes: number | null;
  baseDurationMaxMinutes: number | null;
}

export interface CreateTreatmentRequest {
  categoryId: string;
  name: string;
  requiresPriorAssessment?: boolean;
  basePriceMin?: number;
  basePriceMax?: number;
  baseDurationMinMinutes?: number;
  baseDurationMaxMinutes?: number;
}

export interface UpdateTreatmentRequest {
  categoryId?: string;
  name?: string;
  requiresPriorAssessment?: boolean;
  basePriceMin?: number;
  basePriceMax?: number;
  baseDurationMinMinutes?: number;
  baseDurationMaxMinutes?: number;
  isActive?: boolean;
}

export interface SetHairLengthPricingRequest {
  entries: Array<{
    hairLength: HairLength;
    price: number;
    durationMinutes: number;
  }>;
}

export interface SetHairColorSurchargesRequest {
  entries: Array<{
    hairColor: HairColor;
    surcharge: number;
    extraDurationMinutes: number;
  }>;
}
