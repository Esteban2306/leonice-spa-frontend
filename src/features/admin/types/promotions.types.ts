export interface FindPromotionsParams {
  name?: string;
  treatmentId?: string;
  categoryId?: string;
  isActive?: boolean;
  currentlyValid?: boolean;
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
