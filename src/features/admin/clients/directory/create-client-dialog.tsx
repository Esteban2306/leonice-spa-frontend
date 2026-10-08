"use client";

import { useState, type ReactElement } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  CheckboxField,
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import {
  HEALTH_DATA_POLICY_VERSION,
  type CreateClientRequest,
} from "@/src/features/admin/types/clients.types";

interface CreateClientDialogProps {
  trigger: ReactElement;
  onCreate: (data: CreateClientRequest) => Promise<boolean>;
}

const EMPTY = { phone: "", name: "", birthDate: "", allergies: "" };

export function CreateClientDialog({ trigger, onCreate }: CreateClientDialogProps) {
  const [values, setValues] = useState(EMPTY);
  const [isPregnant, setIsPregnant] = useState(false);
  const [healthConsent, setHealthConsent] = useState(false);

  const hasHealthData = values.allergies.trim().length > 0 || isPregnant;
  const canSubmit =
    values.phone.replace(/\D/g, "").length >= 10 &&
    values.name.trim().length >= 2 &&
    values.birthDate !== "" &&
    (!hasHealthData || healthConsent);

  const reset = () => {
    setValues(EMPTY);
    setIsPregnant(false);
    setHealthConsent(false);
  };

  return (
    <ActionDialog
      trigger={trigger}
      title="Nuevo cliente"
      description="Registra los datos básicos. El perfil capilar y las citas se gestionan desde su ficha."
      submitLabel="Crear cliente"
      submittingLabel="Creando…"
      canSubmit={canSubmit}
      onOpenChange={(open) => !open && reset()}
      onSubmit={() =>
        onCreate({
          phone: values.phone,
          name: values.name.trim(),
          birthDate: values.birthDate,
          ...(hasHealthData
            ? {
                allergies: values.allergies.trim() || undefined,
                isPregnant,
                healthDataPolicyVersion: HEALTH_DATA_POLICY_VERSION,
              }
            : {}),
        })
      }
    >
      <Field label="Teléfono" htmlFor="new-client-phone" hint="Con indicativo o 10 dígitos colombianos.">
        <input
          id="new-client-phone"
          inputMode="tel"
          value={values.phone}
          onChange={(event) => setValues({ ...values, phone: event.target.value })}
          placeholder="300 123 4567"
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Nombre completo" htmlFor="new-client-name">
        <input
          id="new-client-name"
          value={values.name}
          maxLength={100}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Fecha de nacimiento" htmlFor="new-client-birth">
        <input
          id="new-client-birth"
          type="date"
          value={values.birthDate}
          onChange={(event) => setValues({ ...values, birthDate: event.target.value })}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Alergias (opcional)" htmlFor="new-client-allergies">
        <TextArea
          id="new-client-allergies"
          value={values.allergies}
          maxLength={500}
          onChange={(event) => setValues({ ...values, allergies: event.target.value })}
        />
      </Field>
      <CheckboxField
        id="new-client-pregnant"
        checked={isPregnant}
        onChange={setIsPregnant}
        label="Está embarazada"
      />
      {hasHealthData && (
        <CheckboxField
          id="new-client-consent"
          checked={healthConsent}
          onChange={setHealthConsent}
          label="El cliente autorizó el tratamiento de sus datos de salud"
          description={`Se registra el consentimiento con la política ${HEALTH_DATA_POLICY_VERSION}.`}
        />
      )}
    </ActionDialog>
  );
}
