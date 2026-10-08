import type {
  DepositCoverage,
  DepositStatus,
  DepositVerificationMethod,
} from "../types/enums";

export interface FindDepositsParams {
  status?: DepositStatus;
  method?: DepositVerificationMethod;
  reservationId?: string;
  clientId?: string;
  page?: number;
  pageSize?: number;
}

export type ApproveDepositScope = "GROUP" | "SINGLE";

export interface ApproveDepositRequest {
  coverage: DepositCoverage;
  amount: number;
  scope?: ApproveDepositScope;
}

export interface RejectDepositRequest {
  reason: string;
}

export interface SubmitAutomaticDepositRequest {
  phone: string;
  coverage: DepositCoverage;
  imageBase64: string;
  reservationId?: string;
}

export interface SubmitDepositProofRequest {
  phone: string;
  image: File;
}

export interface FindPendingDepositsParams {
  phone: string;
}
