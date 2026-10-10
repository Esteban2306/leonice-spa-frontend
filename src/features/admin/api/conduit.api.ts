import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";

import type {
  BotTool,
  BusinessSettings,
  CampaignPolicy,
  ConduitAiModel,
  ConduitBot,
  ConduitConnection,
  ConduitOverview,
  ConduitTemplate,
  ConnectionHealth,
  ConnectionQr,
  Contact,
  ConversationMessage,
  ConversationSummary,
  CreateAiModelRequest,
  DeadLetter,
  DeliveryEvent,
  EscalationContact,
  FindConversationsParams,
  FindMessagesParams,
  OutboundMessage,
  OutboxEvent,
  Paginated,
  PromptSettings,
  PromptSettingsResponse,
  PromptType,
  PromptVersion,
  SaveTemplateRequest,
  TemplateUsage,
  UpdateBotRequest,
  UpdateBusinessSettingsRequest,
  WarmupLevel,
} from "../types/conduit.types";

const BASE = "/admin/conduit";

function get<T>(path: string, params?: object, options: QueryOptions = {}) {
  return httpClient.request<T>(`${BASE}${path}`, "GET", undefined, {
    params,
    signal: options.signal,
  });
}

export const conduitApi = {
  overview: (options?: QueryOptions) =>
    get<ConduitOverview>("/overview", undefined, options),

  connection: () => get<ConduitConnection>("/connection"),
  qr: (options?: QueryOptions) =>
    get<ConnectionQr>("/connection/qr", undefined, options),
  connectionHealth: () => get<ConnectionHealth>("/connection/health"),
  connectionAction: (action: "connect" | "disconnect" | "reconnect") =>
    httpClient.request<unknown>(`${BASE}/connection/${action}`, "POST"),
  setWarmupLevel: (warmupLevel: WarmupLevel) =>
    httpClient.request<unknown>(`${BASE}/connection/warmup-level`, "PUT", {
      warmupLevel,
    }),
  setCampaignPolicy: (
    campaignPolicy: CampaignPolicy,
    inboundLookbackDays: number,
  ) =>
    httpClient.request<unknown>(`${BASE}/connection/campaign-policy`, "PUT", {
      campaignPolicy,
      inboundLookbackDays,
    }),
  contacts: (params: { search?: string; page?: number; limit?: number }) =>
    get<Paginated<Contact>>("/connection/contacts", params),

  bot: () => get<ConduitBot>("/bot"),
  updateBot: (data: UpdateBotRequest) =>
    httpClient.request<ConduitBot>(`${BASE}/bot`, "PUT", data),
  toggleBot: () =>
    httpClient.request<ConduitBot>(`${BASE}/bot/toggle`, "PATCH"),
  promptSettings: () => get<PromptSettingsResponse>("/bot/prompts/settings"),
  updatePromptSettings: (data: PromptSettings) =>
    httpClient.request<unknown>(`${BASE}/bot/prompts/settings`, "PUT", data),
  prompts: () => get<PromptVersion[]>("/bot/prompts"),
  prompt: (type: PromptType) => get<PromptVersion>(`/bot/prompts/${type}`),
  updatePrompt: (type: PromptType, content: string) =>
    httpClient.request<unknown>(`${BASE}/bot/prompts/${type}`, "PUT", {
      content,
    }),
  previewPrompt: (type: PromptType) =>
    httpClient.request<unknown>(`${BASE}/bot/prompts/preview`, "POST", {
      type,
    }),
  models: () => get<ConduitAiModel[]>("/bot/models"),
  addModel: (data: CreateAiModelRequest) =>
    httpClient.request<ConduitAiModel>(`${BASE}/bot/models`, "POST", data),
  removeModel: (modelId: string) =>
    httpClient.request<unknown>(`${BASE}/bot/models/${modelId}`, "DELETE"),
  resetModel: (modelId: string) =>
    httpClient.request<unknown>(`${BASE}/bot/models/${modelId}/reset`, "PATCH"),
  tools: () => get<BotTool[]>("/bot/tools"),
  setToolActive: (toolId: string, isActive: boolean) =>
    httpClient.request<BotTool>(`${BASE}/bot/tools/${toolId}`, "PATCH", {
      isActive,
    }),
  escalationContacts: () =>
    get<EscalationContact[]>("/bot/escalation-contacts"),
  addEscalationContact: (data: Omit<EscalationContact, "id">) =>
    httpClient.request<EscalationContact>(
      `${BASE}/bot/escalation-contacts`,
      "POST",
      data,
    ),
  removeEscalationContact: (contactId: string) =>
    httpClient.request<unknown>(
      `${BASE}/bot/escalation-contacts/${contactId}`,
      "DELETE",
    ),

  conversations: (params: FindConversationsParams, options?: QueryOptions) =>
    get<Paginated<ConversationSummary>>("/conversations", params, options),
  conversationMessages: (
    id: string,
    params: { before?: string; limit?: number },
    options?: QueryOptions,
  ) =>
    get<ConversationMessage[]>(
      `/conversations/${id}/messages`,
      params,
      options,
    ),
  reply: (id: string, text: string) =>
    httpClient.request<unknown>(
      `${BASE}/conversations/${id}/messages`,
      "POST",
      { text },
    ),
  pause: (id: string, minutes: number, reason?: string) =>
    httpClient.request<unknown>(`${BASE}/conversations/${id}/pause`, "POST", {
      minutes,
      ...(reason ? { reason } : {}),
    }),
  resume: (id: string) =>
    httpClient.request<unknown>(`${BASE}/conversations/${id}/resume`, "POST"),
  close: (id: string) =>
    httpClient.request<unknown>(`${BASE}/conversations/${id}/close`, "POST"),

  templates: () =>
    get<Paginated<ConduitTemplate>>("/templates", { limit: 100 }),
  templateUsage: () => get<TemplateUsage[]>("/templates/usage"),
  createTemplate: (data: SaveTemplateRequest) =>
    httpClient.request<ConduitTemplate>(`${BASE}/templates`, "POST", data),
  updateTemplate: (id: string, data: SaveTemplateRequest) =>
    httpClient.request<ConduitTemplate>(`${BASE}/templates/${id}`, "PUT", data),
  removeTemplate: (id: string) =>
    httpClient.request<unknown>(`${BASE}/templates/${id}`, "DELETE"),
  previewTemplate: (id: string, variables: Record<string, string>) =>
    httpClient.request<unknown>(`${BASE}/templates/${id}/preview`, "POST", {
      variables,
    }),

  messages: (params: FindMessagesParams) =>
    get<Paginated<OutboundMessage>>("/messages", { limit: 20, ...params }),
  message: (id: string) => get<OutboundMessage>(`/messages/${id}`),
  cancelMessage: (id: string) =>
    httpClient.request<unknown>(`${BASE}/messages/${id}`, "DELETE"),
  deadLetters: (
    params: { requeued?: boolean; page?: number; limit?: number },
    options?: QueryOptions,
  ) => get<Paginated<DeadLetter>>("/dead-letters", params, options),
  requeue: (messageId: string) =>
    httpClient.request<unknown>(
      `${BASE}/dead-letters/${messageId}/requeue`,
      "POST",
    ),
  outbox: (params: {
    status?: OutboxEvent["status"];
    page?: number;
    pageSize?: number;
  }) => get<Paginated<OutboxEvent>>("/outbox", params),
  retryOutbox: (id: string) =>
    httpClient.request<unknown>(`${BASE}/outbox/${id}/retry`, "POST"),
  deliveryEvents: (params: { status?: string; messageId?: string }) =>
    httpClient.request<DeliveryEvent[]>(
      "/integrations/conduit/message-events",
      "GET",
      undefined,
      { params },
    ),
};

export const businessSettingsApi = {
  get: () => httpClient.request<BusinessSettings>("/business-settings", "GET"),
  update: (data: UpdateBusinessSettingsRequest) =>
    httpClient.request<BusinessSettings>("/business-settings", "PUT", data),
};
