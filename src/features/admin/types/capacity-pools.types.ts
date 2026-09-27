export interface FindCapacityPoolsParams {
  categoryId: string;
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
