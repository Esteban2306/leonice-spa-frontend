import { httpClient } from "@/src/lib/api/client";
import type {
  CreateAutomationRuleRequest,
  FindAutomationRulesParams,
  UpdateAutomationRuleRequest,
} from "../types/automation.types";

export const automationRulesApi = {
  findMany(params?: FindAutomationRulesParams) {
    return httpClient.request("/automation-rules", "GET", {
      params,
    });
  },

  create(data: CreateAutomationRuleRequest) {
    return httpClient.request("/automation-rules", "POST", data);
  },

  update(ruleId: string, data: UpdateAutomationRuleRequest) {
    return httpClient.request(`/automation-rules/${ruleId}`, "PATCH", data);
  },
};
