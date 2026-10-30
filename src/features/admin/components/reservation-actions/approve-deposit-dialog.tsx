"use client";

import { useState, type ReactElement } from "react";

import { formatCop, thousandsToPesos } from "@/src/lib/money/cop";
import { useBusinessSettings } from "@/src/features/admin/hooks/use-conduit";
import type { ApproveDepositInput } from "@/src/features/admin/hooks/use-reservation-actions";
import type { DepositCoverage } from "@/src/features/admin/types/enums";

import { ActionDialog } from "./action-dialog";
import {
  CheckboxField,
  ChoicePills,
  Field,
  INPUT_CLASS,
} from "./form-controls";

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

type AmountMode = "none" | "advance" | "other";

const COVERAGE_OPTIONS: ReadonlyArray<{
  value: DepositCoverage;
  label: string;
}> = [
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
  const settings = useBusinessSettings();
  const advancePesos =
    settings.data?.depositAmount != null
      ? thousandsToPesos(settings.data.depositAmount)
      : null;

  const defaultMode: AmountMode = hasProof
    ? advancePesos !== null
      ? "advance"
      : "other"
    : "none";

  const [chosenMode, setChosenMode] = useState<AmountMode | null>(null);
  const [coverage, setCoverage] = useState<DepositCoverage>("ANTICIPO");
  const [amountRaw, setAmountRaw] = useState("");
  const [applyToGroup, setApplyToGroup] = useState(true);

  const mode = chosenMode ?? defaultMode;
  const typedPesos = parsePesos(amountRaw);
  const amountPesos =
    mode === "none"
      ? undefined
      : mode === "advance"
        ? (advancePesos ?? undefined)
        : typedPesos;

  const exceedsPrice =
    !belongsToGroup && mode === "other" && typedPesos > pricePesos;
  const canSubmit =
    mode === "none" ||
    (amountPesos !== undefined && amountPesos > 0 && !exceedsPrice);

  const reset = () => {
    setChosenMode(null);
    setCoverage("ANTICIPO");
    setAmountRaw("");
    setApplyToGroup(true);
  };

  const handleAmount = (raw: string) => {
    setAmountRaw(raw);
    const pesos = parsePesos(raw);
    if (!belongsToGroup && pesos > 0) {
      setCoverage(pesos >= pricePesos ? "PAGO_COMPLETO" : "ANTICIPO");
    }
  };

  const options: ReadonlyArray<{ value: AmountMode; label: string }> = [
    ...(hasProof ? [] : [{ value: "none" as const, label: "Sin adelanto" }]),
    ...(advancePesos !== null
      ? [
          {
            value: "advance" as const,
            label: `Solo el anticipo (${formatCop(advancePesos)})`,
          },
        ]
      : []),
    {
      value: "other" as const,
      label: hasProof ? "Otro monto" : "Anticipo + extra / otro monto",
    },
  ];

  return (
    <ActionDialog
      trigger={trigger}
      open={open}
      title={hasProof ? "Aceptar comprobante" : "Confirmar cita"}
      description={
        hasProof
          ? `${clientName} envió un comprobante. Indica cuánto recibiste realmente; la cita queda confirmada y se le avisa por WhatsApp.`
          : `${clientName} no tiene comprobante. Elige con cuánto adelanto se confirma; la cita queda confirmada y se le avisa por WhatsApp.`
      }
      submitLabel={hasProof ? "Aceptar y confirmar" : "Confirmar cita"}
      submittingLabel="Confirmando…"
      canSubmit={canSubmit}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange?.(next);
      }}
      onSubmit={() =>
        onApprove({
          reservationId,
          coverage: mode === "advance" ? "ANTICIPO" : coverage,
          amountPesos,
          scope: applyToGroup ? "GROUP" : "SINGLE",
        })
      }
    >
      {advancePesos === null && hasProof && (
        <p className="font-sans text-xs text-secondary/75">
          No hay un valor de anticipo configurado en el negocio; indica el monto
          recibido.
        </p>
      )}

      <Field label="¿Cuánto pagó la clienta?">
        <ChoicePills
          ariaLabel="Monto recibido"
          value={mode}
          options={options}
          onChange={setChosenMode}
        />
      </Field>

      {mode === "other" && (
        <>
          <Field
            label="Monto recibido (COP)"
            htmlFor={`amount-${reservationId}`}
            hint={`Precio de la cita: ${formatCop(pricePesos)}. Lo que supere el anticipo se descuenta del saldo al completar la cita.`}
            error={
              exceedsPrice
                ? "El monto no puede superar el precio de la cita."
                : undefined
            }
          >
            <input
              id={`amount-${reservationId}`}
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 150.000"
              value={typedPesos > 0 ? typedPesos.toLocaleString("es-CO") : ""}
              onChange={(event) => handleAmount(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>

          <Field label="¿Qué cubre el pago?">
            <ChoicePills
              ariaLabel="Cobertura del pago"
              value={coverage}
              options={COVERAGE_OPTIONS}
              onChange={setCoverage}
            />
          </Field>
        </>
      )}

      {mode === "none" && (
        <p className="font-sans text-xs text-secondary/75">
          No se registra dinero. Al completar la cita se cobrará el valor total.
        </p>
      )}

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
