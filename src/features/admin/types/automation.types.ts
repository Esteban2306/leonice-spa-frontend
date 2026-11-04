export interface FindAutomationRulesParams {
  treatmentId?: string;
  categoryId?: string;
}

export interface CreateAutomationRuleRequest {
  treatmentId?: string;
  categoryId?: string;
  reminderDays?: number;
  reactivationDays?: number;
  templateCode?: string;
  promotionId?: string;
}

export interface UpdateAutomationRuleRequest {
  isActive?: boolean;
}

export interface AutomationRule {
  id: string;
  treatmentId: string | null;
  categoryId: string | null;
  reminderDays: number | null;
  reactivationDays: number | null;
  templateCode: string | null;
  promotionId: string | null;
  isActive: boolean;
}

export interface FollowUpTemplate {
  code: string;
  label: string;
  description: string;
  body: string;
  needsPromotion: boolean;
}
