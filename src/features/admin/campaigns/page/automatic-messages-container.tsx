"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import {
  useCampaignActions,
  useCampaignSettings,
} from "@/src/features/admin/hooks/use-campaigns";

import { AutomaticMessagesCard } from "../components/automatic-messages-card";
import { FollowUpRulesCard } from "../components/follow-up-rules-card";
import { MessagingTabs } from "../components/messaging-tabs";
import { SendSettingsDialog } from "../components/send-settings-dialog";

export function AutomaticMessagesContainer() {
  const conduitActions = useConduitActions();
  const settings = useCampaignSettings();
  const campaignActions = useCampaignActions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsVersion, setSettingsVersion] = useState(0);

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">
              Mensajes automáticos
            </h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
              Mensajes que el sistema envía solo después de una cita, por
              ejemplo un recordatorio de mantenimiento a los 30 días de un
              alisado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSettingsVersion((version) => version + 1);
              setSettingsOpen(true);
            }}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-primary/25 px-5 font-sans text-sm text-primary transition-colors hover:bg-primary/10"
          >
            <Clock className="size-4" strokeWidth={1.8} />
            Ajustes de envío
          </button>
        </header>

        <MessagingTabs active="automatic" />

        <FollowUpRulesCard actions={conduitActions} />
        <AutomaticMessagesCard />
      </div>

      {settings.data && (
        <SendSettingsDialog
          key={`settings-${settingsVersion}`}
          open={settingsOpen}
          settings={settings.data}
          onOpenChange={setSettingsOpen}
          onSave={async (next) =>
            (await campaignActions.saveSettings(next)) !== null
          }
        />
      )}
    </main>
  );
}
