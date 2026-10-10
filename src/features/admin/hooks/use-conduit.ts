import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { businessSettingsApi, conduitApi } from "../api/conduit.api";
import { adminQueryKeys } from "./query-keys";

import type {
  FindConversationsParams,
  FindMessagesParams,
  OutboxEvent,
  PromptType,
} from "../types/conduit.types";

const VISIBLE_POLL_MS = 10_000;
const HIDDEN_POLL_MS = 60_000;
const QR_POLL_MS = 3_000;
const MESSAGES_PAGE = 50;

export function visibilityAwareInterval(): number {
  if (typeof document === "undefined") return HIDDEN_POLL_MS;
  return document.visibilityState === "visible"
    ? VISIBLE_POLL_MS
    : HIDDEN_POLL_MS;
}

const LIVE = {
  refetchInterval: visibilityAwareInterval,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  retry: false,
} as const;

const STATIC = {
  staleTime: 60_000,
  refetchOnWindowFocus: false,
  retry: false,
} as const;

export function useConduitOverview(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.overview(),
    queryFn: ({ signal }) => conduitApi.overview({ signal }),
    enabled: options.enabled ?? true,
    ...LIVE,
  });
}

export function useConduitQr(enabled: boolean) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.qr(),
    queryFn: ({ signal }) => conduitApi.qr({ signal }),
    enabled,
    refetchInterval: enabled ? QR_POLL_MS : false,
    refetchIntervalInBackground: true,
    retry: false,
  });
}

export function useConduitContacts(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.contacts(params),
    queryFn: () => conduitApi.contacts(params),
    placeholderData: keepPreviousData,
    ...STATIC,
  });
}

export function useConduitBot() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.bot(),
    queryFn: () => conduitApi.bot(),
    ...STATIC,
  });
}

export function useConduitPromptSettings() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.promptSettings(),
    queryFn: () => conduitApi.promptSettings(),
    ...STATIC,
  });
}

export function useConduitPrompt(type: PromptType) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.prompt(type),
    queryFn: () => conduitApi.prompt(type),
    ...STATIC,
  });
}

export function useConduitModels() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.models(),
    queryFn: () => conduitApi.models(),
    ...STATIC,
  });
}

export function useConduitTools() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.tools(),
    queryFn: () => conduitApi.tools(),
    ...STATIC,
  });
}

export function useEscalationContacts() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.escalation(),
    queryFn: () => conduitApi.escalationContacts(),
    ...STATIC,
  });
}

export function useConversations(
  params: FindConversationsParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.conversationList(params),
    queryFn: ({ signal }) => conduitApi.conversations(params, { signal }),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
    ...LIVE,
  });
}

export function useConversationMessages(conversationId: string | null) {
  return useInfiniteQuery({
    queryKey: adminQueryKeys.conduit.conversationMessages(conversationId ?? ""),
    queryFn: ({ pageParam, signal }) =>
      conduitApi.conversationMessages(
        conversationId ?? "",
        { limit: MESSAGES_PAGE, ...(pageParam ? { before: pageParam } : {}) },
        { signal },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.length < MESSAGES_PAGE ? null : (lastPage[0]?.createdAt ?? null),
    enabled: Boolean(conversationId),
    ...LIVE,
  });
}

export function useConduitTemplates() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.templates(),
    queryFn: () => conduitApi.templates(),
    ...STATIC,
  });
}

export function useTemplateUsage() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.templateUsage(),
    queryFn: () => conduitApi.templateUsage(),
    ...STATIC,
  });
}

export function useOutboundMessages(params: FindMessagesParams) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.messages(params),
    queryFn: () => conduitApi.messages(params),
    placeholderData: keepPreviousData,
    ...STATIC,
    staleTime: 15_000,
  });
}

export function useDeadLetters(
  params: { requeued?: boolean; page?: number; limit?: number },
  options: { live?: boolean } = {},
) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.deadLetters(params),
    queryFn: ({ signal }) => conduitApi.deadLetters(params, { signal }),
    placeholderData: keepPreviousData,
    ...(options.live ? LIVE : { ...STATIC, staleTime: 15_000 }),
  });
}

export function useOutboxEvents(params: {
  status?: OutboxEvent["status"];
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.outbox(params),
    queryFn: () => conduitApi.outbox(params),
    placeholderData: keepPreviousData,
    ...STATIC,
    staleTime: 15_000,
  });
}

export function useDeliveryEvents(params: {
  status?: string;
  messageId?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.conduit.deliveryEvents(params),
    queryFn: () => conduitApi.deliveryEvents(params),
    ...STATIC,
    staleTime: 15_000,
  });
}

export function useBusinessSettings() {
  return useQuery({
    queryKey: adminQueryKeys.conduit.businessSettings(),
    queryFn: () => businessSettingsApi.get(),
    ...STATIC,
  });
}
