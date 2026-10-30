"use client";

import { useState, type ReactElement } from "react";

import { formatCop, thousandsToPesos } from "@/src/lib/money/cop";
import { useReservationSettlement } from "@/src/features/admin/hooks/use-reservations";
import type { CompleteReservationInput } from "@/src/features/admin/hooks/use-reservation-actions";
import {
  PAYMENT_METHOD_LABELS,
  balanceDuePesos,
  collectedMatchesBalance,
  derivePaymentMethod,
} from "@/src/features/admin/utils/payment-settlement.utils";

import { ActionDialog } from "./action-dialog";
import { Field, INPUT_CLASS } from "./form-controls";

interface CompleteReservationDialogProps {
  trigger?: ReactElement;
  reservationId: string;
  clientName: string;
  treatmentName: string;
  onComplete: (input: CompleteReservationInput) => Promise<boolean>;
}

const SHORTCUT =
  "cursor-pointer rounded-full border border-secondary/15 bg-white px-3 py-1 font-sans text-xs text-secondary transition-colors hover:bg-secondary/5";

function parsePesos(raw: string): number {
  return Number(raw.replace(/\D/g, ""));
}

function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: number;
  onChange: (raw: string) => void;
  placeholder: string;
}) {
  return (
    <input
      id={id}
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={value > 0 ? value.toLocaleString("es-CO") : ""}
      onChange={(event) => onChange(event.target.value)}
      className={INPUT_CLASS}
    />
  );
}

export function CompleteReservationDialog({
  trigger,
  reservationId,
  clientName,
  treatmentName,
  onComplete,
}: CompleteReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const [cashRaw, setCashRaw] = useState("");
  const [transferRaw, setTransferRaw] = useState("");
  const [advanceRaw, setAdvanceRaw] = useState("");

  const settlementQuery = useReservationSettlement(reservationId, open);
  const settlement = settlementQuery.data;

  const cashPesos = parsePesos(cashRaw);
  const transferPesos = parsePesos(transferRaw);
  const pricePesos = settlement ? thousandsToPesos(settlement.price) : 0;
  const advanceShared = settlement?.advanceShared ?? false;
  const advancePesos = !settlement
    ? 0
    : advanceShared
      ? parsePesos(advanceRaw)
      : thousandsToPesos(settlement.advance ?? 0);
  const balancePesos = balanceDuePesos(pricePesos, advancePesos);
  const collectedPesos = cashPesos + transferPesos;
  const difference = balancePesos - collectedPesos;

  const advanceMissing = advanceShared && advanceRaw === "";
  const matches =
    settlement !== undefined &&
    !advanceMissing &&
    collectedMatchesBalance({
      pricePesos,
      advancePesos,
      cashPesos,
      transferPesos,
    });
  const method = derivePaymentMethod({
    advancePesos,
    cashPesos,
    transferPesos,
  });

  const reset = () => {
    setCashRaw("");
    setTransferRaw("");
    setAdvanceRaw("");
  };

  const fill = (kind: "cash" | "transfer") => {
    const value = String(balancePesos);
    setCashRaw(kind === "cash" ? value : "");
    setTransferRaw(kind === "transfer" ? value : "");
  };

  const submit = () =>
    onComplete({
      reservationId,
      cashPesos,
      transferPesos,
      ...(advanceShared ? { advancePesos } : {}),
    });

  return (
    <ActionDialog
      trigger={trigger}
      open={open}
      title="Completar cita"
      description={`${treatmentName} de ${clientName}. Registra lo que se cobró hoy; así queda el ingreso listo para contabilidad.`}
      submitLabel="Completar cita"
      submittingLabel="Completando…"
      canSubmit={matches}
      onOpenChange={(next) => {
        if (!next) reset();
        setOpen(next);
      }}
      onSubmit={submit}
    >
      {settlementQuery.isPending && (
        <p className="font-sans text-sm text-secondary/70">
          Calculando el saldo…
        </p>
      )}

      {settlementQuery.isError && (
        <p role="alert" className="font-sans text-sm text-red-700">
          No se pudo calcular el saldo de la cita. Cierra el diálogo e inténtalo
          de nuevo.
        </p>
      )}

      {settlement && (
        <>
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 rounded-2xl border border-secondary/10 bg-white/60 p-4 font-sans text-sm text-secondary">
            <dt>Valor del tratamiento</dt>
            <dd className="text-right">{formatCop(pricePesos)}</dd>
            <dt>Anticipo / saldo a favor</dt>
            <dd className="text-right">
              {advanceShared && advanceMissing
                ? "Por indicar"
                : `− ${formatCop(advancePesos)}`}
            </dd>
            <dt className="font-medium">Saldo por cobrar</dt>
            <dd className="text-right font-medium">
              {formatCop(balancePesos)}
            </dd>
          </dl>

          {advanceShared && (
            <Field
              label="Anticipo que corresponde a esta cita (COP)"
              htmlFor={`advance-${reservationId}`}
              hint="El anticipo se pagó junto con otras citas. Indica cuánto cubre esta; si no cubre nada, escribe 0."
            >
              <MoneyInput
                id={`advance-${reservationId}`}
                value={advancePesos}
                onChange={setAdvanceRaw}
                placeholder="Ej. 50.000"
              />
            </Field>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={SHORTCUT}
              onClick={() => fill("cash")}
            >
              Todo en efectivo
            </button>
            <button
              type="button"
              className={SHORTCUT}
              onClick={() => fill("transfer")}
            >
              Todo por transferencia
            </button>
          </div>

          <Field
            label="Cobrado en efectivo (COP)"
            htmlFor={`cash-${reservationId}`}
          >
            <MoneyInput
              id={`cash-${reservationId}`}
              value={cashPesos}
              onChange={setCashRaw}
              placeholder="0"
            />
          </Field>

          <Field
            label="Cobrado por transferencia (COP)"
            htmlFor={`transfer-${reservationId}`}
          >
            <MoneyInput
              id={`transfer-${reservationId}`}
              value={transferPesos}
              onChange={setTransferRaw}
              placeholder="0"
            />
          </Field>

          <p
            role="status"
            className={`font-sans text-xs ${
              matches || advanceMissing
                ? "text-secondary/75"
                : "font-medium text-red-700"
            }`}
          >
            {advanceMissing
              ? "Indica el anticipo de esta cita para continuar."
              : matches
                ? `Todo cuadra. Método registrado: ${PAYMENT_METHOD_LABELS[method]}.`
                : difference > 0
                  ? `Faltan ${formatCop(difference)} para completar el saldo.`
                  : `Te pasas por ${formatCop(-difference)}: lo cobrado debe ser igual al saldo.`}
          </p>
        </>
      )}
    </ActionDialog>
  );
}
