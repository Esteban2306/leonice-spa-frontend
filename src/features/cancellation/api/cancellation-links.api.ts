import { httpClient } from "@/src/lib/api/client";

import type {
  CancelWithLinkRequest,
  CancelWithLinkResult,
  CancellationLinkDetails,
} from "../types";

const PUBLIC = { auth: false, retryOnUnauthorized: false } as const;

export const cancellationLinksApi = {
  describe(token: string) {
    return httpClient.request<CancellationLinkDetails>(
      `/cancellation-links/${encodeURIComponent(token)}`,
      "GET",
      undefined,
      PUBLIC,
    );
  },

  cancel(token: string, data: CancelWithLinkRequest) {
    return httpClient.request<CancelWithLinkResult>(
      `/cancellation-links/${encodeURIComponent(token)}/cancel`,
      "POST",
      data,
      PUBLIC,
    );
  },
};
