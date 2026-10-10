"use client";

import { useQuery } from "@tanstack/react-query";

import { conduitApi } from "@/src/features/admin/api/conduit.api";
import { adminQueryKeys } from "@/src/features/admin/hooks/query-keys";

import { isHandoff, needsAttention } from "./whatsapp-format";

const COUNTS_PARAMS = { limit: 100 } as const;
const BADGE_POLL_MS = 60_000;

export function useInboxCounts(options: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: adminQueryKeys.conduit.conversationList(COUNTS_PARAMS),
    queryFn: ({ signal }) =>
      conduitApi.conversations(COUNTS_PARAMS, { signal }),
    enabled: options.enabled ?? true,
    refetchInterval: BADGE_POLL_MS,
    refetchIntervalInBackground: true,
    retry: false,
  });
  const data = (query.data?.data ?? []).filter(needsAttention);
  return {
    pending: data.length,
    awaiting: data.filter((c) => c.awaitingReply).length,
    paused: data.filter((c) => c.botPaused).length,
    handoffs: data.filter((c) => c.botPaused && isHandoff(c.botPauseReason))
      .length,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
