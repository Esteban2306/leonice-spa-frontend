import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { automationRulesApi } from "../api/automation-rules.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateAutomationRuleRequest,
  FindAutomationRulesParams,
  UpdateAutomationRuleRequest,
} from "../types/automation.types";

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

export function useCreateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "automation-rules", "create"],
    mutationFn: (data: CreateAutomationRuleRequest) =>
      automationRulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.automationRules.lists(),
      });
    },
  });
}

export function useUpdateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "automation-rules", "update"],
    mutationFn: ({
      ruleId,
      data,
    }: {
      ruleId: string;
      data: UpdateAutomationRuleRequest;
    }) => automationRulesApi.update(ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.automationRules.lists(),
      });
    },
  });
}
