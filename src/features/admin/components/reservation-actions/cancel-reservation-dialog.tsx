"use client";

import { useState, type ReactElement } from "react";

import type { CancelReservationInput } from "@/src/features/admin/hooks/use-reservation-actions";

import { ActionDialog } from "./action-dialog";
import { CheckboxField, Field, TextArea } from "./form-controls";

interface CancelReservationDialogProps {
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reservationId: string;
  clientName: string;
  treatmentName: string;
  onCancel: (input: CancelReservationInput) => Promise<boolean>;
}

export function CancelReservationDialog({
  trigger,
  open,
  onOpenChange,
  reservationId,
  clientName,
  treatmentName,
  onCancel,
}: CancelReservationDialogProps) {
  const [reason, setReason] = useState("");
  const [notifyClient, setNotifyClient] = useState(true);

  const reset = () => {
    setReason("");
    setNotifyClient(true);
  };

  return (
    <ActionDialog
      trigger={trigger}
      open={open}
      title="Cancelar reserva"
      description={`${treatmentName} de ${clientName}. El horario quedará libre. Si hay un depósito confirmado, pasará a ser saldo a favor cuando no quede ninguna cita de ese grupo.`}
      submitLabel="Cancelar reserva"
      submittingLabel="Cancelando…"
      tone="danger"
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange?.(next);
      }}
      onSubmit={() =>
        onCancel({
          reservationId,
          reason: reason.trim() || undefined,
          notifyClient,
        })
      }
    >
      <Field label="Motivo (opcional)" htmlFor={`cancel-${reservationId}`}>
        <TextArea
          id={`cancel-${reservationId}`}
          value={reason}
          maxLength={300}
          placeholder="Ej. El cliente pidió cancelar por teléfono."
          onChange={(event) => setReason(event.target.value)}
        />
      </Field>

      <CheckboxField
        id={`notify-${reservationId}`}
        checked={notifyClient}
        onChange={setNotifyClient}
        label="Avisar al cliente por WhatsApp"
        description="Desmárcalo si ya hablaste con el cliente."
      />
    </ActionDialog>
  );
}
