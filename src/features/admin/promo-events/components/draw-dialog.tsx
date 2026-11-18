"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { PromoEvent } from "@/src/features/admin/types/promo-events.types";

interface DrawDialogProps {
  event: PromoEvent | null;
  onOpenChange: (open: boolean) => void;
  onDraw: (prize: string) => Promise<boolean>;
}

export function DrawDialog({ event, onOpenChange, onDraw }: DrawDialogProps) {
  const [prize, setPrize] = useState("");
  const remaining = event ? event.ticketCount - event.winnerCount : 0;

  return (
    <ActionDialog
      open={event !== null}
      onOpenChange={onOpenChange}
      title={event ? `Sortear en ${event.name}` : "Sortear"}
      description={`El sistema elige al azar una boleta entre ${remaining} sin premio; cada clienta gana una sola vez. El resultado es definitivo y se le avisa a la ganadora por WhatsApp.`}
      submitLabel="Hacer el sorteo"
      submittingLabel="Sorteando…"
      canSubmit={prize.trim().length >= 2}
      onSubmit={() => onDraw(prize.trim())}
    >
      <Field label="Premio que se sortea" htmlFor="draw-prize">
        <input
          id="draw-prize"
          value={prize}
          maxLength={140}
          placeholder="Ej. Kit de productos"
          onChange={(e) => setPrize(e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
    </ActionDialog>
  );
}
