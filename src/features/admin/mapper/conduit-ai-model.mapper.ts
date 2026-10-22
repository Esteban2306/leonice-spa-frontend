import type { ConduitAiModel } from "../types/conduit.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const count = (value: unknown): number | null =>
  typeof value === "number" ? value : null;

export function toConduitAiModel(raw: unknown): ConduitAiModel | null {
  if (!isRecord(raw) || typeof raw.id !== "string") return null;
  const role = raw.role;
  const tier = raw.tier;
  return {
    id: raw.id,
    provider: text(raw.provider) ?? "",
    model: text(raw.model) ?? "",
    role:
      role === "IMAGE_ANALYSIS" || role === "FALLBACK" ? role : "CONVERSATION",
    tier: tier === "PAID" ? "PAID" : "FREE",
    priority: count(raw.priority) ?? 0,
    dailyTokenLimit: count(raw.dailyTokenLimit),
    minuteRequestLimit: count(raw.minuteRequestLimit),
    tokensUsedToday: count(raw.tokensUsedToday) ?? 0,
    requestsThisMinute: count(raw.requestsThisMinute) ?? undefined,
    isActive: raw.isActive === true,
    createdAt: text(raw.createdAt) ?? undefined,
    apiKeyLast4: text(raw.apiKeyLast4),
  };
}

export function toConduitAiModels(raw: unknown): ConduitAiModel[] {
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? raw.data
      : [];
  return list
    .map(toConduitAiModel)
    .filter((model): model is ConduitAiModel => model !== null);
}
