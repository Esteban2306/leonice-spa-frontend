"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/src/components/brand/brand-loader";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { formatBogotaTime } from "@/src/lib/date/bogota";

import { ClientStep } from "../components/wizard/client-step";
import { DayStep } from "../components/wizard/day-step";
import { ReviewStep } from "../components/wizard/review-step";
import { ServiceStep } from "../components/wizard/service-step";
import { SuccessStep } from "../components/wizard/success-step";
import { TimeStep } from "../components/wizard/time-step";
import { WizardFrame } from "../components/wizard/wizard-frame";
import {
  ContinueFooter,
  PRIMARY_BUTTON,
} from "../components/wizard/wizard-parts";
import { describeServices, priceRangeLabel } from "../lib/booking";
import {
  WIZARD_STEPS,
  formatDayChoice,
  missingFor,
  type WizardStep,
} from "../lib/booking-wizard";
import { useBookingWizard } from "./use-booking-wizard";

const TITLES: Readonly<Record<WizardStep, string>> = {
  cliente: "¿Para quién es la cita?",
  servicio: "¿Qué servicio se va a hacer?",
  dia: "¿Qué día?",
  hora: "¿A qué hora?",
  revisar: "Revisa y confirma",
};

export function BookingWizard() {
  const router = useRouter();
  const wizard = useBookingWizard();
  const [isConfirmingExit, setIsConfirmingExit] = useState(false);
  const { draft, step, dispatch } = wizard;

  if (wizard.created) {
    const { href, summary } = wizard.created;
    return (
      <SuccessStep
        summary={summary}
        onSeeAgenda={() => router.push(href)}
        onAnother={wizard.restart}
      />
    );
  }

  if (wizard.isPresetLoading) {
    return (
      <main>
        <BrandLoader variant="screen" label="Cargando cliente…" />
      </main>
    );
  }

  const dayLabel = draft.dayKey
    ? formatDayChoice(draft.dayKey, wizard.today)
    : "";
  const missing = missingFor(step, draft);
  const needsContinue =
    step === "servicio" ||
    (step === "cliente" && (draft.picked !== null || draft.isNewClient));

  const footer =
    step === "revisar" ? (
      <button
        type="button"
        onClick={() => void wizard.submit()}
        disabled={wizard.isSubmitting || wizard.slotTaken || missing !== null}
        className={PRIMARY_BUTTON}
      >
        {wizard.isSubmitting ? "Creando la cita…" : "Crear la cita"}
      </button>
    ) : needsContinue ? (
      <ContinueFooter
        missing={missing}
        label="Continuar"
        onContinue={() => wizard.advance()}
      />
    ) : undefined;

  return (
    <>
      <WizardFrame
        title={TITLES[step]}
        stepNumber={WIZARD_STEPS.indexOf(step) + 1}
        totalSteps={WIZARD_STEPS.length}
        onBack={wizard.back}
        isBusy={wizard.isSubmitting}
        onExit={() =>
          wizard.hasData
            ? setIsConfirmingExit(true)
            : router.push(wizard.exitHref)
        }
        footer={footer}
      >
        {step === "cliente" && (
          <ClientStep
            draft={draft}
            search={wizard.clientSearch}
            onPick={(client) => wizard.advance({ type: "pickClient", client })}
            onClear={wizard.clearClient}
            onStartNew={() =>
              dispatch({
                type: "startNewClient",
                search: wizard.clientSearch.query,
              })
            }
            onField={(field, value) =>
              dispatch({ type: "setField", field, value })
            }
          />
        )}

        {step === "servicio" && (
          <ServiceStep
            categories={wizard.categories}
            treatments={wizard.treatments}
            selection={draft.selection}
            isLoading={wizard.isCatalogLoading}
            isError={wizard.isCatalogError}
            onRetry={wizard.retryCatalog}
            onSelect={(categoryId, treatmentId, keepOthers) =>
              dispatch({
                type: "selectService",
                categoryId,
                treatmentId,
                keepOthers,
              })
            }
            onRemove={(categoryId) =>
              dispatch({ type: "removeService", categoryId })
            }
          />
        )}

        {step === "dia" && (
          <DayStep
            days={wizard.days}
            today={wizard.today}
            selectedKey={draft.dayKey}
            isLoading={wizard.isAvailabilityLoading}
            isError={wizard.isAvailabilityError}
            onRetry={wizard.retryAvailability}
            onSelect={(dayKey) =>
              wizard.advance({ type: "selectDay", dayKey })
            }
            onEarlier={wizard.showEarlier}
            onLater={wizard.showLater}
          />
        )}

        {step === "hora" && (
          <TimeStep
            dayLabel={dayLabel}
            slots={wizard.selectedDay?.slots ?? []}
            selectedIso={draft.slotIso}
            isLoading={wizard.isAvailabilityLoading}
            isError={wizard.isAvailabilityError}
            onRetry={wizard.retryAvailability}
            onSelect={(iso) => wizard.advance({ type: "selectSlot", iso })}
          />
        )}

        {step === "revisar" && (
          <ReviewStep
            rows={[
              {
                step: "cliente",
                label: "Cliente",
                value: draft.picked
                  ? `${draft.picked.name} · ${draft.picked.phone}`
                  : `${draft.name} · ${draft.phone} (nuevo)`,
              },
              {
                step: "servicio",
                label: "Servicio",
                value: describeServices(wizard.services),
              },
              { step: "dia", label: "Día", value: dayLabel },
              {
                step: "hora",
                label: "Hora",
                value: draft.slotIso ? formatBogotaTime(draft.slotIso) : "",
              },
            ]}
            services={wizard.services}
            catalogPrices={Object.fromEntries(
              wizard.treatments.map((treatment) => [
                treatment.id,
                priceRangeLabel(treatment),
              ]),
            )}
            prices={draft.prices}
            slotTaken={wizard.slotTaken}
            hasFailed={wizard.hasFailed}
            isBusy={wizard.isSubmitting}
            onChange={wizard.change}
            onPrice={(treatmentId, value) =>
              dispatch({ type: "setPrice", treatmentId, value })
            }
            onRetry={() => void wizard.submit()}
          />
        )}
        {step === "revisar" && missing && (
          <p role="alert" className="font-sans text-base text-red-800">
            {missing}
          </p>
        )}
      </WizardFrame>

      <ActionDialog
        open={isConfirmingExit}
        onOpenChange={setIsConfirmingExit}
        title="¿Salir sin agendar?"
        description="La cita todavía no se ha creado y se perderá lo que escribiste."
        submitLabel="Sí, salir"
        submittingLabel="Saliendo…"
        onSubmit={async () => {
          router.push(wizard.exitHref);
          return true;
        }}
      />
    </>
  );
}
