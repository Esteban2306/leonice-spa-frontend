import type { HairColor, HairLength } from "../types/enums";
import type { CatalogStatus, SortOrder } from "./catalog.types";

export interface FindTreatmentsParams {
  categoryId?: string;
}

export type TreatmentSortField =
  "name" | "price" | "duration" | "createdAt" | "updatedAt";

export interface FindAdminTreatmentsParams {
  q?: string;
  categoryId?: string;
  status?: CatalogStatus;
  requiresPriorAssessment?: boolean;
  hasHairVariablePricing?: boolean;
  hasActivePromotion?: boolean;
  hasPrice?: boolean;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  sortBy?: TreatmentSortField;
  sortOrder?: SortOrder;
}

export interface TreatmentPromotionSummary {
  id: string;
  name: string;
  discountPercentage: string;
}

export interface Treatment {
  id: string;
  categoryId: string;
  name: string;
  isActive: boolean;
  requiresPriorAssessment: boolean;
  hasHairVariablePricing: boolean;
  basePriceMin: string | null;
  basePriceMax: string | null;
  baseDurationMinMinutes: number | null;
  baseDurationMaxMinutes: number | null;
  activePromotion?: TreatmentPromotionSummary | null;
  effectiveBasePriceMin?: number | null;
  effectiveBasePriceMax?: number | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
}

export interface HairLengthPricingRow {
  id: string;
  treatmentId: string;
  hairLength: HairLength;
  price: string;
  durationMinutes: number;
}

export interface HairColorSurchargeRow {
  id: string;
  treatmentId: string;
  hairColor: HairColor;
  surcharge: string;
  extraDurationMinutes: number;
}

export interface AdminTreatment extends Treatment {
  category: { id: string; name: string };
  hairLengthPricing: HairLengthPricingRow[];
  hairColorSurcharges: HairColorSurchargeRow[];
  activePromotion: TreatmentPromotionSummary | null;
  reservationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentRequest {
  categoryId: string;
  name: string;
  requiresPriorAssessment?: boolean;
  hasHairVariablePricing?: boolean;
  basePriceMin?: number;
  basePriceMax?: number;
  baseDurationMinMinutes?: number;
  baseDurationMaxMinutes?: number;
}

export interface UpdateTreatmentRequest {
  categoryId?: string;
  name?: string;
  requiresPriorAssessment?: boolean;
  hasHairVariablePricing?: boolean;
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
