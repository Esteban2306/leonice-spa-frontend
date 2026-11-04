"use client";

import { useEscalationContacts } from "@/src/features/admin/hooks/use-conduit";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import { EscalationTab } from "@/src/features/admin/whatsapp/assistant/escalation-tab";
import { ErrorPanel } from "@/src/features/admin/whatsapp/components/error-panel";
import { SkeletonRows } from "@/src/features/admin/whatsapp/components/section-card";

export function AssistantAlertsCard() {
  const contacts = useEscalationContacts();
  const actions = useConduitActions();

  if (contacts.isLoading) return <SkeletonRows rows={2} height="h-24" />;
  if (contacts.isError || contacts.data === undefined) {
    return (
      <ErrorPanel
        error={contacts.error}
        onRetry={() => void contacts.refetch()}
      />
    );
  }
  return <EscalationTab contacts={contacts.data} actions={actions} />;
}
