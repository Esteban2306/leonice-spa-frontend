import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";

import type {
  VerificationDecision,
  VerificationMode,
  VerificationStatus,
} from "../types/verification.types";

const BASE = "/admin/conduit/specialist";

export const verificationApi = {
  status: (options?: QueryOptions) =>
    httpClient.request<VerificationStatus>(BASE, "GET", undefined, {
      signal: options?.signal,
    }),

  setMode: (mode: VerificationMode) =>
    httpClient.request<unknown>(`${BASE}/binding`, "PUT", { mode }),

  rotateKey: (modelId: string, apiKey: string) =>
    httpClient.request<unknown>(`${BASE}/models/${modelId}/key`, "PATCH", {
      apiKey,
    }),

  reactivateModel: (modelId: string) =>
    httpClient.request<unknown>(`${BASE}/models/${modelId}/reactivate`, "POST"),

  review: (id: string, decision: VerificationDecision, note?: string) =>
    httpClient.request<unknown>(`${BASE}/verifications/${id}/review`, "POST", {
      decision,
      ...(note ? { note } : {}),
    }),
};
