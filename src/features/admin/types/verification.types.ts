import type { ConduitAiModel } from "./conduit.types";

export type VerificationMode = "OFF" | "SHADOW" | "ACTIVE";

export type VerificationDecision = "APPROVED" | "REJECTED";

export type ChecklistKey =
  "runtime" | "images" | "specialist" | "model" | "binding";

export interface ChecklistItem {
  key: ChecklistKey;
  ok: boolean | null;
}

export interface VerificationSpecialist {
  id: string;
  key: string;
  name: string;
  status: string;
  version: number;
}

export interface VerificationBinding {
  mode: VerificationMode;
  onFailure: string;
  timeoutMs: number;
  blockMessage: string | null;
}

export interface RecentVerification {
  id: string;
  createdAt: string | null;
  verdict: string;
  mode: string;
  reasonCodes: string[];
  amount: number | null;
  date: string | null;
  destinationLast4: string | null;
  pendingReview: boolean;
  reviewDecision: string | null;
}

export interface VerificationStatus {
  runtimeEnabled: boolean | null;
  imageAnalysisEnabled: boolean;
  specialist: VerificationSpecialist | null;
  binding: VerificationBinding | null;
  models: ConduitAiModel[];
  recent: RecentVerification[];
  pendingReview: number;
  checklist: ChecklistItem[];
  ready: boolean;
  partial: boolean;
}
