export type ProductStatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

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

export interface AdminProduct {
  id: string;
  productCategoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  category: { id: string; name: string; isActive: boolean };
  tagAssignments: { id: string; tagId: string; tag: ProductTag }[];
  _count: { viewLogs: number; recommendations: number };
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
  tagIds?: string[];
  variants?: CreateProductVariantRequest[];
}

export interface UpdateProductRequest {
  productCategoryId?: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
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
