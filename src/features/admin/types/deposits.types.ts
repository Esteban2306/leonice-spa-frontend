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

export interface DepositRecordView {
  id: string;
  status: DepositStatus;
  method: DepositVerificationMethod;
  coverage: DepositCoverage | null;
  amount: string | null;
  imageUrl: string | null;
  rejectionReason: string | null;
  createdAt: string;
  reservation: {
    id: string;
    scheduledStart: string;
    treatment: { id: string; name: string };
  };
}

export interface PaginatedDeposits {
  data: DepositRecordView[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface ClientCredit {
  depositId: string;
  amount: string;
  originReservationId: string;
  originStatus: string;
  confirmedAt: string | null;
}

export interface ClientCreditSummary {
  clientId: string;
  credits: ClientCredit[];
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
