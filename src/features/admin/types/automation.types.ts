export interface FindAutomationRulesParams {
  treatmentId?: string;
  categoryId?: string;
}

export interface CreateAutomationRuleRequest {
  treatmentId?: string;
  categoryId?: string;
  reminderDays?: number;
  reactivationDays: number;
}

export interface UpdateAutomationRuleRequest {
  treatmentId?: string;
  categoryId?: string;
  reminderDays?: number;
  reactivationDays?: number;
  isActive?: boolean;
}
