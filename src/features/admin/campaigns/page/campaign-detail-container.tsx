"use client";

import { useState } from "react";

import {
  useCampaign,
  useCampaignActions,
  useCampaignRecipients,
} from "@/src/features/admin/hooks/use-campaigns";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "@/src/features/admin/services/components/confirm-toggle-dialog";

import {
  CampaignDetailView,
  type RecipientFilter,
} from "./campaign-detail-view";

const PAGE_SIZE = 25;

export function CampaignDetailContainer({
  campaignId,
}: {
  campaignId: string;
}) {
  const campaignQuery = useCampaign(campaignId);
  const actions = useCampaignActions();
  const [filter, setFilter] = useState<RecipientFilter>("ALL");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );

  const campaign = campaignQuery.data;
  const recipients = useCampaignRecipients(
    campaignId,
    {
      status: filter === "ALL" ? undefined : filter,
      page,
      pageSize: PAGE_SIZE,
    },
    campaign?.status === "RUNNING",
  );

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      return await action();
    } finally {
      setBusy(false);
    }
  };

  if (campaignQuery.isError) {
    return (
      <p role="alert" className="p-8 font-sans text-sm text-red-800">
        No se pudo cargar la campaña.
      </p>
    );
  }
  if (!campaign) {
    return (
      <div
        role="status"
        aria-label="Cargando campaña"
        className="m-8 h-48 animate-pulse rounded-[2rem] bg-secondary/8"
      />
    );
  }

  return (
    <>
      <CampaignDetailView
        campaign={campaign}
        recipients={recipients.data}
        recipientsLoading={recipients.isFetching}
        filter={filter}
        busy={busy}
        onFilterChange={(next) => {
          setFilter(next);
          setPage(1);
        }}
        onPageChange={setPage}
        onPause={() => void run(() => actions.pause(campaignId))}
        onResume={() => void run(() => actions.resume(campaignId))}
        onCancel={() =>
          setConfirmation({
            title: `Cancelar ${campaign.name}`,
            description:
              "Los mensajes que todavía no salieron no se enviarán. Los ya enviados no se pueden deshacer.",
            submitLabel: "Cancelar campaña",
            onConfirm: async () =>
              (await run(() => actions.cancel(campaignId))) !== null,
          })
        }
      />
      <ConfirmToggleDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}
