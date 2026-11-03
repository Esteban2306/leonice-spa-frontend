import { httpClient } from "@/src/lib/api/client";
import type {
  AudienceFilter,
  AudiencePreview,
  BroadcastTemplate,
  Campaign,
  CampaignDraft,
  CampaignEstimate,
  CampaignSettings,
  CreateCampaignRequest,
  FindCampaignRecipientsParams,
  PaginatedCampaignRecipients,
} from "../types/campaigns.types";

export const campaignsApi = {
  list() {
    return httpClient.request<Campaign[]>("/campaigns", "GET");
  },

  findOne(campaignId: string) {
    return httpClient.request<Campaign>(`/campaigns/${campaignId}`, "GET");
  },

  recipients(campaignId: string, params: FindCampaignRecipientsParams) {
    return httpClient.request<PaginatedCampaignRecipients>(
      `/campaigns/${campaignId}/recipients`,
      "GET",
      undefined,
      { params },
    );
  },

  templates() {
    return httpClient.request<BroadcastTemplate[]>(
      "/campaigns/templates",
      "GET",
    );
  },

  settings() {
    return httpClient.request<CampaignSettings>("/campaigns/settings", "GET");
  },

  updateSettings(data: CampaignSettings) {
    return httpClient.request<CampaignSettings>(
      "/campaigns/settings",
      "PUT",
      data,
    );
  },

  estimate(data: CampaignDraft) {
    return httpClient.request<CampaignEstimate>(
      "/campaigns/estimate",
      "POST",
      data,
    );
  },

  create(data: CreateCampaignRequest) {
    return httpClient.request<Campaign>("/campaigns", "POST", data);
  },

  pause(campaignId: string) {
    return httpClient.request<Campaign>(
      `/campaigns/${campaignId}/pause`,
      "POST",
    );
  },

  resume(campaignId: string) {
    return httpClient.request<Campaign>(
      `/campaigns/${campaignId}/resume`,
      "POST",
    );
  },

  cancel(campaignId: string) {
    return httpClient.request<Campaign>(
      `/campaigns/${campaignId}/cancel`,
      "POST",
    );
  },

  previewAudience(filter: AudienceFilter, marketing: boolean) {
    return httpClient.request<AudiencePreview>("/audiences/preview", "POST", {
      filter,
      marketing,
    });
  },
};
