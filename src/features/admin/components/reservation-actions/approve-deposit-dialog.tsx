"use client";

import { useState, type ReactElement } from "react";

import { formatCop, thousandsToPesos } from "@/src/lib/money/cop";
import type { ApproveDepositInput } from "@/src/features/admin/hooks/use-reservation-actions";
import type { DepositCoverage } from "@/src/features/admin/types/enums";

import { ActionDialog } from "./action-dialog";
import { CheckboxField, ChoicePills, Field, INPUT_CLASS } from "./form-controls";

interface ApproveDepositDialogProps {
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reservationId: string;
  clientName: string;
  priceThousands: number;
  hasProof: boolean;
  belongsToGroup: boolean;
  onApprove: (input: ApproveDepositInput) => Promise<boolean>;
}

const COVERAGE_OPTIONS: ReadonlyArray<{ value: DepositCoverage; label: string }> = [
  { value: "ANTICIPO", label: "Anticipo" },
  { value: "PAGO_COMPLETO", label: "Pago completo" },
];

function parsePesos(raw: string): number {
  return Number(raw.replace(/\D/g, ""));
}

export function ApproveDepositDialog({
  trigger,
  open,
  onOpenChange,
  reservationId,
  clientName,
  priceThousands,
  hasProof,
  belongsToGroup,
  onApprove,
}: ApproveDepositDialogProps) {
  const pricePesos = thousandsToPesos(priceThousands);
  const [coverage, setCoverage] = useState<DepositCoverage>("ANTICIPO");
  const [amountRaw, setAmountRaw] = useState("");
  const [applyToGroup, setApplyToGroup] = useState(true);

  const amountPesos = parsePesos(amountRaw);
  const canSubmit = amountPesos > 0;

  const reset = () => {
    setCoverage("ANTICIPO");
    setAmountRaw("");
    setApplyToGroup(true);
  };

  const handleCoverage = (value: DepositCoverage) => {
    setCoverage(value);
    if (value === "PAGO_COMPLETO" && amountRaw === "") {
      setAmountRaw(String(pricePesos));
    }
  };

  return (
    <ActionDialog
      trigger={trigger}
      open={open}
      title="Aprobar depósito"
      description={
        hasProof
          ? `Confirma el pago de ${clientName} con el monto que realmente recibiste.`
          : `${clientName} no adjuntó comprobante. Aprueba solo si verificaste el pago por otro medio.`
      }
      submitLabel="Aprobar y confirmar"
      submittingLabel="Aprobando…"
      canSubmit={canSubmit}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange?.(next);
      }}
      onSubmit={() =>
        onApprove({
          reservationId,
          coverage,
          amountPesos,
          scope: applyToGroup ? "GROUP" : "SINGLE",
        })
      }
    >
      <Field label="¿Qué cubre el pago?">
        <ChoicePills
          ariaLabel="Cobertura del pago"
          value={coverage}
          options={COVERAGE_OPTIONS}
          onChange={handleCoverage}
        />
      </Field>

      <Field
        label="Monto recibido (COP)"
        htmlFor={`amount-${reservationId}`}
        hint={`Precio de la cita: ${formatCop(pricePesos)}`}
      >
        <input
          id={`amount-${reservationId}`}
          inputMode="numeric"
          autoComplete="off"
          placeholder="Ej. 50.000"
          value={amountPesos > 0 ? amountPesos.toLocaleString("es-CO") : ""}
          onChange={(event) => setAmountRaw(event.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      {belongsToGroup && (
        <CheckboxField
          id={`scope-${reservationId}`}
          checked={applyToGroup}
          onChange={setApplyToGroup}
          label="Aprobar todas las citas de ese día"
          description="Un solo depósito confirma el combo completo del cliente."
        />
      )}
    </ActionDialog>
  );
}
