import { httpClient } from "@/src/lib/api/client";
import type {
  AutomationRule,
  FollowUpTemplate,
  CreateAutomationRuleRequest,
  FindAutomationRulesParams,
  UpdateAutomationRuleRequest,
} from "../types/automation.types";

export const automationRulesApi = {
  templates() {
    return httpClient.request<FollowUpTemplate[]>(
      "/automation-rules/templates",
      "GET",
    );
  },

  findMany(params?: FindAutomationRulesParams) {
    return httpClient.request<AutomationRule[]>(
      "/automation-rules",
      "GET",
      undefined,
      { params },
    );
  },

  create(data: CreateAutomationRuleRequest) {
    return httpClient.request<AutomationRule>(
      "/automation-rules",
      "POST",
      data,
    );
  },

  update(ruleId: string, data: UpdateAutomationRuleRequest) {
    return httpClient.request<AutomationRule>(
      `/automation-rules/${ruleId}`,
      "PATCH",
      data,
    );
  },

  remove(ruleId: string) {
    return httpClient.request<{ ok: boolean }>(
      `/automation-rules/${ruleId}`,
      "DELETE",
    );
  },
};
