export type PromotionValidity = "CURRENT" | "UPCOMING" | "EXPIRED";

export type PromotionTarget = "TREATMENT" | "CATEGORY";

export interface Promotion {
  id: string;
  name: string;
  discountPercentage: string;
  startsAt: string;
  endsAt: string;
  treatmentId: string | null;
  categoryId: string | null;
  isActive: boolean;
  createdAt: string;
  treatment: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
}

export interface FindPromotionsParams {
  name?: string;
  treatmentId?: string;
  categoryId?: string;
  isActive?: boolean;
  currentlyValid?: boolean;
  validity?: PromotionValidity;
  appliesTo?: PromotionTarget;
  withinCategoryId?: string;
}

export interface CreatePromotionRequest {
  name: string;
  discountPercentage: number;
  startsAt: string;
  endsAt: string;
  treatmentId?: string;
  categoryId?: string;
}

export interface UpdatePromotionRequest {
  name?: string;
  discountPercentage?: number;
  startsAt?: string;
  endsAt?: string;
  treatmentId?: string;
  categoryId?: string;
  isActive?: boolean;
}
