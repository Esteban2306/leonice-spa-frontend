export type ConnectionStatus =
  "CONNECTED" | "CONNECTING" | "DISCONNECTED" | "ERROR" | "BANNED";
export type WarmupLevel = "FRESH" | "NORMAL" | "TRUSTED";
export type CampaignPolicy = "INBOUND_ONLY" | "ANY";

export interface ConduitConnection {
  id: string;
  name: string;
  phoneNumber: string | null;
  status: ConnectionStatus;
  warmupLevel: WarmupLevel;
  campaignPolicy: CampaignPolicy;
  inboundLookbackDays: number;
  connectedAt: string | null;
  disconnectedAt: string | null;
  updatedAt?: string;
}

export interface ConnectionHealth {
  id: string;
  status: ConnectionStatus;
  isConnected: boolean;
  rateLimiter: {
    warmupLevel: WarmupLevel;
    riskLevel: number;
    queueSize: number;
    lanes: { conversation: number; campaign: number };
  };
}

export interface ConnectionQr {
  id: string;
  status: ConnectionStatus;
  lastQr: string | null;
}

export interface ConduitServiceHealth {
  status: "ok" | "degraded" | string;
  service?: {
    database?: { status: string };
    redis?: { status: string; error?: string };
    whatsapp?: { status: string; connections?: Record<string, number> };
  };
}

export interface ConduitAiModel {
  id: string;
  provider: string;
  model: string;
  role: "CONVERSATION" | "IMAGE_ANALYSIS" | "FALLBACK";
  tier: "FREE" | "PAID";
  priority: number;
  dailyTokenLimit: number | null;
  minuteRequestLimit: number | null;
  tokensUsedToday: number;
  requestsThisMinute?: number;
  isActive: boolean;
  createdAt?: string;
}

export interface ConduitBot {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  imageAnalysisEnabled: boolean;
  maxHistoryMessages: number;
  conversationTimeoutMinutes?: number;
  maxMessageAgeMinutes: number;
  humanTakeoverMinutes: number;
  botResponseDelaySeconds: number;
  updatedAt?: string;
  aiModels?: ConduitAiModel[];
}

export interface UpdateBotRequest {
  botResponseDelaySeconds?: number;
  humanTakeoverMinutes?: number;
  maxHistoryMessages?: number;
  maxMessageAgeMinutes?: number;
  imageAnalysisEnabled?: boolean;
}

export interface TemplateUsage {
  name: string;
  envKey: string;
  templateId: string | null;
  configured: boolean;
  source: "env" | "catalog" | null;
  catalogName: string;
  description: string;
  suggestedBody: string;
}

export interface ConduitOverview {
  reachable: boolean;
  health: ConduitServiceHealth | null;
  connection: ConduitConnection | null;
  connectionHealth: ConnectionHealth | null;
  bot: ConduitBot | null;
  errors: {
    health: string | null;
    connection: string | null;
    bot: string | null;
  };
  templates: TemplateUsage[];
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

export type ConversationStatus =
  "ACTIVE" | "WAITING_PAYMENT" | "COMPLETED" | "ABANDONED";
export type MessageAuthor = "user" | "bot" | "human" | "system";

export interface ConversationSummary {
  id: string;
  phoneNumber: string;
  status: ConversationStatus;
  summary: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  botPaused: boolean;
  botPausedUntil: string | null;
  botPauseReason: string | null;
  awaitingReply: boolean;
  lastMessage: {
    direction: "INBOUND" | "OUTBOUND";
    content: string;
    processedBy: MessageAuthor;
  } | null;
}

export interface ConversationMessage {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  content: string;
  hasImage: boolean;
  processedBy: MessageAuthor;
  createdAt: string;
}

export interface FindConversationsParams {
  status?: ConversationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Contact {
  address: string;
  lastInboundAt: string | null;
  onWhatsApp: boolean | null;
  checkedAt: string | null;
}

export interface PromptSettings {
  agentName?: string | null;
  tone?: string | null;
  personality?: string | null;
  goals?: string | null;
  companyName?: string | null;
  companyServices?: string | null;
  businessHours?: string | null;
  greeting?: string | null;
  farewell?: string | null;
  restrictions?: string | null;
  responseLength?: "SHORT" | "MEDIUM" | "LONG";
  emojiLevel?: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  allowMarkdown?: boolean;
  temperature?: number;
  maxTokensConversation?: number;
}

export interface PromptSettingsResponse {
  configured: boolean;
  message?: string;
  settings: PromptSettings;
}

export type PromptType =
  | "CONVERSATION"
  | "SUMMARY"
  | "IMAGE_ANALYSIS"
  | "SALES"
  | "APPOINTMENT"
  | "SUPPORT";

export interface PromptVersion {
  id?: string;
  type: PromptType;
  content?: string;
  version?: number;
  isActive?: boolean;
  updatedAt?: string;
}

export interface CreateAiModelRequest {
  provider: string;
  model: string;
  apiKey: string;
  role: ConduitAiModel["role"];
  tier: ConduitAiModel["tier"];
  priority: number;
  dailyTokenLimit?: number;
  minuteRequestLimit?: number;
  baseUrl?: string;
}

export interface BotTool {
  id: string;
  name: string;
  description: string;
  endpointUrl: string;
  httpMethod: string;
  isActive: boolean;
  requiresImageAttachment: boolean;
  injectPhoneParamName: string | null;
  pausesBotMinutes: number | null;
}

export interface EscalationContact {
  id: string;
  label: string;
  phoneNumber: string;
  notifyOn: Array<"TECHNICAL_ERROR" | "BUSINESS_ERROR">;
}

export interface ConduitTemplate {
  id: string;
  name: string;
  description: string | null;
  channel: string;
  subject: string | null;
  bodyHandlebars: string;
  variablesSchema?: string | null;
  isActive: boolean;
  updatedAt: string;
}

export interface SaveTemplateRequest {
  name: string;
  description?: string;
  channel: "WHATSAPP";
  bodyHandlebars: string;
}

export type OutboundStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "SENT"
  | "FAILED"
  | "RETRYING"
  | "DEAD"
  | "CANCELLED";

export interface AttemptLog {
  id: string;
  attemptNumber: number;
  status: string;
  errorCode: string | null;
  errorDetail: string | null;
  durationMs: number | null;
  createdAt: string;
}

export interface OutboundMessage {
  id: string;
  recipient: string;
  status: OutboundStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  lastError: string | null;
  template: { id: string; name: string } | null;
  queue: "immediate" | "scheduled";
  minutesUntilSend: number | null;
  isOverdue: boolean;
  createdAt: string;
  attemptLogs?: AttemptLog[];
}

export interface FindMessagesParams {
  status?: OutboundStatus;
  recipient?: string;
  queue?: "immediate" | "scheduled" | "all";
  page?: number;
  limit?: number;
}

export interface DeadLetter {
  id?: string;
  messageId: string;
  reason: string | null;
  lastErrorCode: string | null;
  totalAttempts: number;
  createdAt: string;
  message?: {
    recipient?: string;
    renderedBody?: string | null;
    template?: { name: string } | null;
  } | null;
}

export interface OutboxEvent {
  id: string;
  eventType: string;
  status: "PENDING" | "SENT" | "FAILED";
  attempts: number;
  lastError: string | null;
  createdAt: string;
  sentAt: string | null;
}

export interface DeliveryEvent {
  id: string;
  messageId: string;
  status: string;
  recipient: string;
  errorMessage: string | null;
  receivedAt: string;
}

export interface BusinessSettings {
  id: string;
  depositAmount: number | null;
  depositInstructions: string | null;
  depositPolicy: string | null;
  cancellationPolicy: string | null;
  address: string | null;
  additionalInfo: string | null;
  updatedAt: string | null;
}

export type UpdateBusinessSettingsRequest = Partial<
  Omit<BusinessSettings, "id" | "updatedAt">
>;
