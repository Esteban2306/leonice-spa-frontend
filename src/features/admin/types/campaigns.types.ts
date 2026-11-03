import type { ClientTagKey } from "./clients.types";

export type PaceProfile = "SEGURO" | "EQUILIBRADO" | "RAPIDO";

export type CampaignStatus = "RUNNING" | "PAUSED" | "COMPLETED" | "CANCELLED";

export type CampaignRecipientStatus = "PENDING" | "SENT" | "FAILED" | "SKIPPED";

export interface AudienceFilter {
  tags?: ClientTagKey[];
  excludeTags?: ClientTagKey[];
  categoryId?: string;
  treatmentId?: string;
  visitedWithinDays?: number;
  notVisitedForDays?: number;
}

export interface AudiencePreview {
  total: number;
  excluded: { withoutWhatsapp: number; withoutConsent: number };
  sample: Array<{ id: string; name: string; phone: string }>;
}

export interface SendWindow {
  startMinute: number;
  endMinute: number;
}

export interface CampaignSettings {
  sendWindows: SendWindow[];
  maxPerDay: number;
}

export interface BroadcastTemplate {
  code: string;
  name: string;
  description: string;
  configured: boolean;
  needsPromotion: boolean;
  needsVisit: boolean;
  body: string;
}

export interface CampaignDraft {
  templateCode: string;
  promotionId?: string;
  filter: AudienceFilter;
  pace: PaceProfile;
  startAt?: string;
}

export interface CreateCampaignRequest extends CampaignDraft {
  name: string;
}

export interface CampaignEstimate {
  audience: AudiencePreview;
  schedule: {
    count: number;
    firstAt: string | null;
    lastAt: string | null;
    days: number;
  };
  settings: CampaignSettings;
}

export interface Campaign {
  id: string;
  name: string;
  templateCode: string;
  templateName: string;
  promotionId: string | null;
  audience: AudienceFilter;
  pace: PaceProfile;
  status: CampaignStatus;
  pausedReason: string | null;
  total: number;
  sent: number;
  failed: number;
  skipped: number;
  pending: number;
  startsAt: string;
  nextSendAt: string | null;
  estimatedEndAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface CampaignRecipient {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  status: CampaignRecipientStatus;
  scheduledAt: string;
  sentAt: string | null;
  errorMessage: string | null;
}

export interface PaginatedCampaignRecipients {
  data: CampaignRecipient[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface FindCampaignRecipientsParams {
  status?: CampaignRecipientStatus;
  page?: number;
  pageSize?: number;
}
