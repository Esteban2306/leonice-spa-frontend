import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { campaignsApi } from "../api/campaigns.api";
import type { AdminActionKey } from "../feedback/action-messages";
import { runAdminAction } from "../feedback/run-admin-action";
import { adminQueryKeys } from "./query-keys";
import { useSingleFlight } from "./use-single-flight";

import type {
  AudienceFilter,
  Campaign,
  CampaignDraft,
  CampaignSettings,
  CreateCampaignRequest,
  FindCampaignRecipientsParams,
} from "../types/campaigns.types";

const POLL_MS = 5_000;
const STALE_MS = 30_000;

export function useCampaigns() {
  return useQuery({
    queryKey: adminQueryKeys.campaigns.list(),
    queryFn: () => campaignsApi.list(),
    refetchInterval: (query) =>
      query.state.data?.some((campaign) => campaign.status === "RUNNING")
        ? POLL_MS
        : false,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });
}

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: adminQueryKeys.campaigns.detail(campaignId),
    queryFn: () => campaignsApi.findOne(campaignId),
    refetchInterval: (query) =>
      query.state.data?.status === "RUNNING" ? POLL_MS : false,
    staleTime: 10_000,
  });
}

export function useCampaignRecipients(
  campaignId: string,
  params: FindCampaignRecipientsParams,
  live: boolean,
) {
  return useQuery({
    queryKey: adminQueryKeys.campaigns.recipients(campaignId, params),
    queryFn: () => campaignsApi.recipients(campaignId, params),
    placeholderData: keepPreviousData,
    refetchInterval: live ? POLL_MS : false,
    staleTime: 10_000,
  });
}

export function useBroadcastTemplates() {
  return useQuery({
    queryKey: adminQueryKeys.campaigns.templates(),
    queryFn: () => campaignsApi.templates(),
    staleTime: STALE_MS,
  });
}

export function useCampaignSettings() {
  return useQuery({
    queryKey: adminQueryKeys.campaigns.settings(),
    queryFn: () => campaignsApi.settings(),
    staleTime: STALE_MS,
  });
}

export function useCampaignEstimate(draft: CampaignDraft | null) {
  return useQuery({
    queryKey: adminQueryKeys.campaigns.estimate(draft),
    queryFn: () => campaignsApi.estimate(draft as CampaignDraft),
    enabled: draft !== null,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
    retry: false,
  });
}

export function useAudiencePreview(
  filter: AudienceFilter,
  marketing: boolean,
  enabled = true,
) {
  return useQuery({
    queryKey: adminQueryKeys.audiences.preview({ filter, marketing }),
    queryFn: () => campaignsApi.previewAudience(filter, marketing),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useCampaignActions() {
  const queryClient = useQueryClient();
  const singleFlight = useSingleFlight();

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.campaigns.all() });

  const create = useMutation({
    mutationFn: (data: CreateCampaignRequest) => campaignsApi.create(data),
    onSuccess: refresh,
  });
  const pause = useMutation({
    mutationFn: (id: string) => campaignsApi.pause(id),
    onSuccess: refresh,
  });
  const resume = useMutation({
    mutationFn: (id: string) => campaignsApi.resume(id),
    onSuccess: refresh,
  });
  const cancel = useMutation({
    mutationFn: (id: string) => campaignsApi.cancel(id),
    onSuccess: refresh,
  });
  const saveSettings = useMutation({
    mutationFn: (data: CampaignSettings) => campaignsApi.updateSettings(data),
    onSuccess: refresh,
  });

  const { mutateAsync: createAsync } = create;
  const { mutateAsync: pauseAsync } = pause;
  const { mutateAsync: resumeAsync } = resume;
  const { mutateAsync: cancelAsync } = cancel;
  const { mutateAsync: saveSettingsAsync } = saveSettings;

  return useMemo(() => {
    const run = <T>(
      key: string,
      action: AdminActionKey,
      execute: () => Promise<T>,
    ) =>
      singleFlight(key, async () => {
        const outcome = await runAdminAction(action, execute);
        return outcome.ok ? outcome.value : null;
      });

    return {
      create: (data: CreateCampaignRequest): Promise<Campaign | null> =>
        run("campaign:create", "createCampaign", () => createAsync(data)),
      pause: (id: string) =>
        run(`campaign:${id}`, "pauseCampaign", () => pauseAsync(id)),
      resume: (id: string) =>
        run(`campaign:${id}`, "resumeCampaign", () => resumeAsync(id)),
      cancel: (id: string) =>
        run(`campaign:${id}`, "cancelCampaign", () => cancelAsync(id)),
      saveSettings: (data: CampaignSettings) =>
        run("campaign:settings", "updateCampaignSettings", () =>
          saveSettingsAsync(data),
        ),
    };
  }, [
    singleFlight,
    createAsync,
    pauseAsync,
    resumeAsync,
    cancelAsync,
    saveSettingsAsync,
  ]);
}
