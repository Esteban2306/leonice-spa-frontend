import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { automationRulesApi } from "../api/automation-rules.api";
import { adminQueryKeys } from "./query-keys";

import type { FindAutomaticMessagesParams } from "../types/automatic-messages.types";
import type { FindAutomationRulesParams } from "../types/automation.types";

const AUTOMATION_RULES_STALE_TIME = 5 * 60 * 1000;

export function useAutomationRules(params?: FindAutomationRulesParams) {
  return useQuery({
    queryKey: adminQueryKeys.automationRules.list(params),
    queryFn: () => automationRulesApi.findMany(params),
    enabled: Boolean(params?.categoryId || params?.treatmentId),
    staleTime: AUTOMATION_RULES_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useFollowUpTemplates() {
  return useQuery({
    queryKey: adminQueryKeys.automationRules.templates(),
    queryFn: () => automationRulesApi.templates(),
    staleTime: Infinity,
  });
}

export function useAutomaticMessages(params: FindAutomaticMessagesParams) {
  return useQuery({
    queryKey: adminQueryKeys.automationRules.messages(params),
    queryFn: () => automationRulesApi.messages(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
