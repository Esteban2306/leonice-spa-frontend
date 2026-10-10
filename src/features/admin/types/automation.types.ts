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

export interface AutomationRule {
  id: string;
  treatmentId: string | null;
  categoryId: string | null;
  reminderDays: number | null;
  reactivationDays: number;
  promotionId: string | null;
  isActive: boolean;
}
