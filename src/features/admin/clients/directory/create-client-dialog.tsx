"use client";

import { useState, type ReactElement } from "react";

import { getBogotaDayKey } from "@/src/lib/date/bogota";

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
  const [touched, setTouched] = useState<Set<keyof typeof EMPTY>>(new Set());
  const touch = (field: keyof typeof EMPTY) =>
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));

  const hasHealthData = values.allergies.trim().length > 0 || isPregnant;
  const phoneDigits = values.phone.replace(/\D/g, "").length;
  const errors = {
    phone:
      phoneDigits < 10 || phoneDigits > 15
        ? "Escribe 10 dígitos o el número con indicativo."
        : null,
    name: values.name.trim().length < 2 ? "Escribe al menos 2 letras." : null,
    birthDate:
      values.birthDate === ""
        ? "Indica la fecha de nacimiento."
        : values.birthDate > getBogotaDayKey(new Date())
          ? "La fecha no puede estar en el futuro."
          : null,
  };
  const visibleError = (field: keyof typeof errors) =>
    touched.has(field) ? errors[field] : null;
  const canSubmit =
    !errors.phone &&
    !errors.name &&
    !errors.birthDate &&
    (!hasHealthData || healthConsent);

  const reset = () => {
    setValues(EMPTY);
    setIsPregnant(false);
    setHealthConsent(false);
    setTouched(new Set());
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
      <Field
        label="Teléfono"
        htmlFor="new-client-phone"
        hint="Con indicativo o 10 dígitos colombianos."
        error={visibleError("phone")}
      >
        <input
          id="new-client-phone"
          inputMode="tel"
          value={values.phone}
          onChange={(event) => setValues({ ...values, phone: event.target.value })}
          onBlur={() => touch("phone")}
          placeholder="300 123 4567"
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Nombre completo" htmlFor="new-client-name" error={visibleError("name")}>
        <input
          id="new-client-name"
          value={values.name}
          maxLength={100}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          onBlur={() => touch("name")}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Fecha de nacimiento" htmlFor="new-client-birth" error={visibleError("birthDate")}>
        <input
          id="new-client-birth"
          type="date"
          value={values.birthDate}
          max={getBogotaDayKey(new Date())}
          onChange={(event) => setValues({ ...values, birthDate: event.target.value })}
          onBlur={() => touch("birthDate")}
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
