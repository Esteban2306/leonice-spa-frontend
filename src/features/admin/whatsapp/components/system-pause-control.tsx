"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { useConduitOverview } from "@/src/features/admin/hooks/use-conduit";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";

import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./section-card";

function formatPausedSince(pausedAt: string | null): string {
  if (!pausedAt) return "";
  return new Date(pausedAt).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SystemPauseButton() {
  const overview = useConduitOverview();
  const actions = useConduitActions();
  const [confirming, setConfirming] = useState(false);
  const pause = overview.data?.systemPause;
  if (!pause) return null;

  if (pause.paused) {
    return (
      <button
        type="button"
        className={PRIMARY_BUTTON}
        disabled={actions.busy.has("systemPause")}
        onClick={() => void actions.setSystemPause(false)}
      >
        <Play className="size-4" />
        Reanudar sistema
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className={SECONDARY_BUTTON}
        disabled={actions.busy.has("systemPause")}
        onClick={() => setConfirming(true)}
      >
        <Pause className="size-4" />
        Pausar sistema
      </button>
      <ActionDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="¿Pausar el sistema?"
        description="El asistente, los avisos automáticos, los recordatorios, las confirmaciones y las campañas dejan de enviarse. Los mensajes siguen llegando a Conversaciones y puedes responder a mano. WhatsApp sigue conectado."
        submitLabel="Pausar sistema"
        submittingLabel="Pausando…"
        onSubmit={() => actions.setSystemPause(true)}
      />
    </>
  );
}

export function SystemPauseBanner() {
  const overview = useConduitOverview();
  const pause = overview.data?.systemPause;
  if (!pause?.paused) return null;

  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-3xl border border-amber-300 bg-amber-50 p-4 font-sans text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <p>
        <strong className="font-semibold">Sistema en pausa</strong>
        {pause.pausedAt ? ` desde ${formatPausedSince(pause.pausedAt)}` : ""}.
        El asistente, los avisos y los envíos automáticos están detenidos. Los
        mensajes siguen llegando a Conversaciones y puedes responder a mano.
      </p>
      <SystemPauseButton />
    </div>
  );
}
