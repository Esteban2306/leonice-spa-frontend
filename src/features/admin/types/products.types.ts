export type ProductStatusFilter = "ACTIVE" | "INACTIVE" | "ALL";
export type ProductKind = "SINGLE" | "COMBO";

export interface ProductVariant {
  id: string;
  productId: string;
  brand: string;
  presentation: string;
  price: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProductTag {
  id: string;
  name: string;
  isActive: boolean;
}

export interface AdminRitualItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  brand: string;
  presentation: string;
  quantity: number;
  unitPricePesos: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface AdminRitual {
  pricePesos: number;
  separatePricePesos: number;
  savingsPesos: number;
  savingsPercent: number;
  isComplete: boolean;
  items: AdminRitualItem[];
}

export interface ProductContent {
  tagline: string | null;
  purpose: string | null;
  benefits: string[];
  howToUse: string[];
  idealFor: string[];
  usageFrequency: string | null;
  precautions: string[];
}

export interface AdminProduct extends ProductContent {
  id: string;
  kind: ProductKind;
  productCategoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  category: { id: string; name: string; isActive: boolean };
  tagAssignments: { id: string; tagId: string; tag: ProductTag }[];
  _count: { viewLogs: number; recommendations: number };
  ritual: AdminRitual | null;
  includedInRituals: { id: string; name: string; slug: string }[];
}

export interface ProductRecommendation {
  id: string;
  createdAt: string;
  treatment: { id: string; name: string; isActive: boolean };
}

export interface AdminProductDetail extends AdminProduct {
  recommendations: ProductRecommendation[];
}

export interface AdminProductCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: { products: number };
}

export interface AdminProductTag extends ProductTag {
  createdAt: string;
  _count: { assignments: number };
}

export interface FindAdminProductsParams {
  q?: string;
  productCategoryId?: string;
  status?: ProductStatusFilter;
  kind?: ProductKind;
}

export interface CreateProductVariantRequest {
  brand: string;
  presentation: string;
  price: number;
}

export interface CreateProductRequest {
  productCategoryId: string;
  name: string;
  description?: string | null;
  isFeatured?: boolean;
  tagIds?: string[];
  variants?: CreateProductVariantRequest[];
}

export interface UpdateProductRequest extends Partial<ProductContent> {
  productCategoryId?: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface RitualItemRequest {
  variantId: string;
  quantity: number;
}

export interface CreateRitualRequest extends Partial<ProductContent> {
  name: string;
  description?: string | null;
  isFeatured?: boolean;
  price: number;
  items: RitualItemRequest[];
}

export interface CreateProductCategoryRequest {
  name: string;
}

export interface UpdateProductCategoryRequest {
  name?: string;
  isActive?: boolean;
}

export interface UpdateProductVariantRequest {
  brand?: string;
  presentation?: string;
  price?: number;
  isActive?: boolean;
}

export interface CreateRecommendationRequest {
  treatmentId: string;
  productId: string;
}

export interface CreateProductTagRequest {
  name: string;
}

export interface UpdateProductTagRequest {
  name?: string;
  isActive?: boolean;
}
