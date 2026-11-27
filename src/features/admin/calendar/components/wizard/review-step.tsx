"use client";

import { useState } from "react";

import { formatPesosInput } from "@/src/features/admin/services/lib/catalog";

import type { WizardStep } from "../../lib/booking-wizard";
import type { BookingService } from "../../types/calendar.types";
import {
  ErrorBox,
  SECONDARY_BUTTON,
  WIZARD_INPUT,
  WizardField,
} from "./wizard-parts";

interface ReviewRow {
  step: WizardStep;
  label: string;
  value: string;
}

interface ReviewStepProps {
  rows: readonly ReviewRow[];
  services: readonly BookingService[];
  catalogPrices: Readonly<Record<string, string | null>>;
  prices: Readonly<Record<string, string>>;
  slotTaken: boolean;
  hasFailed: boolean;
  isBusy: boolean;
  onChange: (step: WizardStep) => void;
  onPrice: (treatmentId: string, value: string) => void;
  onRetry: () => void;
}

export function ReviewStep({
  rows,
  services,
  catalogPrices,
  prices,
  slotTaken,
  hasFailed,
  isBusy,
  onChange,
  onPrice,
  onRetry,
}: ReviewStepProps) {
  const [editsPrice, setEditsPrice] = useState(
    Object.values(prices).some(Boolean),
  );

  return (
    <>
      {slotTaken && (
        <ErrorBox
          message="Esa hora ya no está libre. Lo demás sigue guardado."
          actionLabel="Elegir otra hora"
          onAction={() => onChange("hora")}
        />
      )}
      {hasFailed && !slotTaken && (
        <ErrorBox
          message="La cita no se creó. Revisa el aviso que apareció; tus datos siguen aquí."
          actionLabel="Intentar otra vez"
          onAction={onRetry}
        />
      )}

      <dl className="flex flex-col divide-y divide-secondary/10 rounded-2xl border border-secondary/15 bg-white px-4">
        {rows.map((row) => (
          <div key={row.step} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <dt className="font-sans text-sm text-secondary/75">
                {row.label}
              </dt>
              <dd className="break-words font-sans text-base font-bold text-secondary">
                {row.value}
              </dd>
            </div>
            <button
              type="button"
              onClick={() => onChange(row.step)}
              disabled={isBusy}
              aria-label={`Cambiar ${row.label.toLowerCase()}`}
              className="min-h-11 shrink-0 cursor-pointer rounded-full px-3 font-sans text-base text-secondary underline underline-offset-4 hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              Cambiar
            </button>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-lg font-bold text-secondary">Precio</h2>
        {services.map((service) => (
          <p
            key={service.treatmentId}
            className="font-sans text-base text-secondary"
          >
            {service.name}:{" "}
            {prices[service.treatmentId]
              ? `$ ${prices[service.treatmentId]} (acordado)`
              : (catalogPrices[service.treatmentId] ?? "según el catálogo")}
          </p>
        ))}

        {editsPrice ? (
          services.map((service) => (
            <WizardField
              key={service.treatmentId}
              id={`wizard-price-${service.treatmentId}`}
              label={`Precio acordado para ${service.name}, en pesos`}
            >
              <input
                id={`wizard-price-${service.treatmentId}`}
                inputMode="numeric"
                autoComplete="off"
                placeholder="Vacío: precio del catálogo"
                value={prices[service.treatmentId] ?? ""}
                onChange={(event) =>
                  onPrice(
                    service.treatmentId,
                    formatPesosInput(event.target.value),
                  )
                }
                className={WIZARD_INPUT}
              />
            </WizardField>
          ))
        ) : (
          <button
            type="button"
            onClick={() => setEditsPrice(true)}
            className={SECONDARY_BUTTON}
          >
            Acordamos otro precio
          </button>
        )}
      </section>
    </>
  );
}
