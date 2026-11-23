export type PromotionValidity = "CURRENT" | "UPCOMING" | "EXPIRED";

export type PromotionTarget =
  | "TREATMENT"
  | "CATEGORY"
  | "PRODUCT"
  | "PRODUCT_CATEGORY";

export type PromotionDomain = "SERVICES" | "PRODUCTS";

export interface Promotion {
  id: string;
  name: string;
  discountPercentage: string;
  startsAt: string;
  endsAt: string;
  treatmentId: string | null;
  categoryId: string | null;
  productId: string | null;
  productCategoryId: string | null;
  isActive: boolean;
  createdAt: string;
  treatment: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  product?: {
    id: string;
    name: string;
    kind: "SINGLE" | "COMBO";
    productCategoryId: string;
  } | null;
  productCategory?: { id: string; name: string } | null;
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
  productId?: string;
  productCategoryId?: string;
  domain?: PromotionDomain;
}

export interface CreatePromotionRequest {
  name: string;
  discountPercentage: number;
  startsAt: string;
  endsAt: string;
  treatmentId?: string;
  categoryId?: string;
  productId?: string;
  productCategoryId?: string;
}

export interface UpdatePromotionRequest {
  name?: string;
  discountPercentage?: number;
  startsAt?: string;
  endsAt?: string;
  treatmentId?: string;
  categoryId?: string;
  productId?: string;
  productCategoryId?: string;
  isActive?: boolean;
}
