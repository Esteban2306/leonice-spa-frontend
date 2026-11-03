"use client";

import { useState } from "react";

import {
  useCampaignActions,
  useCampaigns,
  useCampaignSettings,
} from "@/src/features/admin/hooks/use-campaigns";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "@/src/features/admin/services/components/confirm-toggle-dialog";
import type { Campaign } from "@/src/features/admin/types/campaigns.types";

import { SendSettingsDialog } from "../components/send-settings-dialog";
import { CampaignsView } from "./campaigns-view";

export function CampaignsContainer() {
  const query = useCampaigns();
  const settings = useCampaignSettings();
  const actions = useCampaignActions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsVersion, setSettingsVersion] = useState(0);
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(new Set());
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );

  const withBusy = async (id: string, run: () => Promise<unknown>) => {
    setBusyIds((prev) => new Set(prev).add(id));
    try {
      return await run();
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <>
      <CampaignsView
        campaigns={query.data ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        busyIds={busyIds}
        onRetry={() => void query.refetch()}
        onOpenSettings={() => {
          setSettingsVersion((version) => version + 1);
          setSettingsOpen(true);
        }}
        onPause={(campaign: Campaign) =>
          void withBusy(campaign.id, () => actions.pause(campaign.id))
        }
        onResume={(campaign: Campaign) =>
          void withBusy(campaign.id, () => actions.resume(campaign.id))
        }
        onCancel={(campaign: Campaign) =>
          setConfirmation({
            title: `Cancelar ${campaign.name}`,
            description:
              "Los mensajes que todavía no salieron no se enviarán. Los ya enviados no se pueden deshacer.",
            submitLabel: "Cancelar campaña",
            onConfirm: async () =>
              (await withBusy(campaign.id, () =>
                actions.cancel(campaign.id),
              )) !== null,
          })
        }
      />

      {settings.data && (
        <SendSettingsDialog
          key={`settings-${settingsVersion}`}
          open={settingsOpen}
          settings={settings.data}
          onOpenChange={setSettingsOpen}
          onSave={async (next) => (await actions.saveSettings(next)) !== null}
        />
      )}

      <ConfirmToggleDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}
