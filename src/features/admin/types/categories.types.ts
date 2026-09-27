export interface CreateCategoryRequest {
  name: string;
  isPrincipal?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  isPrincipal?: boolean;
  isActive?: boolean;
}
