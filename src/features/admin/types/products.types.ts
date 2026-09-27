export interface FindProductsParams {
  productCategoryId?: string;
  search?: string;
  tagId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateProductRequest {
  productCategoryId: string;
  name: string;
  description?: string;
}

export interface UpdateProductRequest {
  productCategoryId?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateProductCategoryRequest {
  name: string;
}

export interface UpdateProductCategoryRequest {
  name?: string;
  isActive?: boolean;
}

export interface CreateProductVariantRequest {
  brand: string;
  presentation: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateProductVariantRequest {
  brand?: string;
  presentation?: string;
  price?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateRecommendationRequest {
  treatmentId: string;
  productId: string;
}

export interface AssignProductTagsRequest {
  tagIds: string[];
}

export interface LogProductViewRequest {
  phone: string;
}

export interface CreateProductTagRequest {
  name: string;
  isActive?: boolean;
}
