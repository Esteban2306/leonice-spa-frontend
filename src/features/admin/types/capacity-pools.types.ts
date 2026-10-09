import type { CatalogStatus } from "./catalog.types";

export interface CapacityPool {
  id: string;
  categoryId: string;
  name: string;
  maxConcurrent: number;
  isActive: boolean;
  category: { id: string; name: string };
}

export interface FindCapacityPoolsParams {
  categoryId?: string;
  q?: string;
  status?: CatalogStatus;
}

export interface CreateCapacityPoolRequest {
  categoryId: string;
  name: string;
  maxConcurrent: number;
}

export interface UpdateCapacityPoolRequest {
  categoryId?: string;
  name?: string;
  maxConcurrent?: number;
  isActive?: boolean;
}
