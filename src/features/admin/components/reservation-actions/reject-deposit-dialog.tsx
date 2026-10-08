"use client";

import { useState, type ReactElement } from "react";

import { ActionDialog } from "./action-dialog";
import { Field, TextArea } from "./form-controls";

interface RejectDepositDialogProps {
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reservationId: string;
  clientName: string;
  onReject: (reservationId: string, reason: string) => Promise<boolean>;
}

const MIN_REASON_LENGTH = 3;

export function RejectDepositDialog({
  trigger,
  open,
  onOpenChange,
  reservationId,
  clientName,
  onReject,
}: RejectDepositDialogProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();

  return (
    <ActionDialog
      trigger={trigger}
      open={open}
      title="Rechazar comprobante"
      description={`Se avisará a ${clientName} y, si la reserva sigue esperando depósito, tendrá un nuevo plazo para enviarlo.`}
      submitLabel="Rechazar comprobante"
      submittingLabel="Rechazando…"
      tone="danger"
      canSubmit={trimmed.length >= MIN_REASON_LENGTH}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange?.(next);
      }}
      onSubmit={() => onReject(reservationId, trimmed)}
    >
      <Field
        label="Motivo"
        htmlFor={`reject-${reservationId}`}
        hint="El cliente verá este motivo. Sé claro y amable."
      >
        <TextArea
          id={`reject-${reservationId}`}
          value={reason}
          maxLength={300}
          placeholder="Ej. La imagen no se ve completa."
          onChange={(event) => setReason(event.target.value)}
        />
      </Field>
    </ActionDialog>
  );
}
