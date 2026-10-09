import type { CatalogStatus } from "./catalog.types";

export interface Category {
  id: string;
  name: string;
  isPrincipal: boolean;
  isActive: boolean;
  tracksHairProfile?: boolean;
}

export interface AdminCategory extends Category {
  tracksHairProfile: boolean;
  treatmentCount: number;
  activeTreatmentCount: number;
  capacityPoolCount: number;
  totalCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface FindAdminCategoriesParams {
  q?: string;
  status?: CatalogStatus;
  isPrincipal?: boolean;
  tracksHairProfile?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  isPrincipal?: boolean;
  tracksHairProfile?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  isPrincipal?: boolean;
  tracksHairProfile?: boolean;
  isActive?: boolean;
}
