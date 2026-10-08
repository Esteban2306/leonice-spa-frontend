"use client";

import { useState } from "react";
import { EyeOff, HeartPulse, ShieldCheck } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { CheckboxField, Field, TextArea } from "@/src/features/admin/components/reservation-actions/form-controls";
import {
  HEALTH_DATA_POLICY_VERSION,
  type ClientDetail,
  type UpdateClientRequest,
} from "@/src/features/admin/types/clients.types";

import { CardShell } from "./card-shell";

interface HealthCardProps {
  client: ClientDetail;
  hasConsent: boolean;
  isSaving: boolean;
  onUpdate: (data: UpdateClientRequest) => Promise<boolean>;
  onRecordConsent: () => Promise<boolean>;
}

export function HealthCard({ client, hasConsent, isSaving, onUpdate, onRecordConsent }: HealthCardProps) {
  const [allergies, setAllergies] = useState(client.allergies ?? "");
  const [isPregnant, setIsPregnant] = useState(client.isPregnant);

  return (
    <CardShell
      title="Salud"
      icon={<HeartPulse className="size-4 text-red-700" />}
      aside={<span className="rounded-full bg-red-50 px-2.5 py-0.5 font-sans text-[11px] text-red-700">Sensible · cifrado</span>}
    >
      {hasConsent ? (
        <>
          <dl className="grid grid-cols-1 gap-3 font-sans text-sm">
            <div className="rounded-xl border border-secondary/10 bg-white p-3">
              <dt className="text-xs text-secondary/55">Alergias</dt>
              <dd className="mt-1 whitespace-pre-line text-secondary">{client.allergies || "Sin alergias registradas"}</dd>
            </div>
            <div className="rounded-xl border border-secondary/10 bg-white p-3">
              <dt className="text-xs text-secondary/55">Embarazo</dt>
              <dd className="mt-1 text-secondary">{client.isPregnant ? "Sí" : "No"}</dd>
            </div>
          </dl>
          <ActionDialog
            title="Datos de salud"
            description="Esta información se guarda cifrada y solo la ve el equipo del spa."
            submitLabel="Guardar"
            submittingLabel="Guardando…"
            onOpenChange={(open) => {
              if (open) {
                setAllergies(client.allergies ?? "");
                setIsPregnant(client.isPregnant);
              }
            }}
            onSubmit={() => onUpdate({ allergies: allergies.trim(), isPregnant })}
            trigger={
              <button type="button" disabled={isSaving} className="h-10 cursor-pointer rounded-full border border-secondary/15 bg-white font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25 disabled:opacity-50">
                Editar datos de salud
              </button>
            }
          >
            <Field label="Alergias (hasta 500 caracteres)" htmlFor="health-allergies">
              <TextArea id="health-allergies" value={allergies} maxLength={500} onChange={(event) => setAllergies(event.target.value)} />
            </Field>
            <CheckboxField id="health-pregnant" checked={isPregnant} onChange={setIsPregnant} label="Está embarazada" />
          </ActionDialog>
        </>
      ) : (
        <>
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 font-sans text-xs leading-5 text-amber-900">
            <EyeOff className="mt-0.5 size-4 shrink-0" />
            Sin consentimiento de datos de salud no se pueden registrar ni editar alergias o embarazo.
          </p>
          <ActionDialog
            title="Registrar consentimiento"
            description={`Confirma que ${client.name} autorizó el tratamiento de sus datos de salud según la política ${HEALTH_DATA_POLICY_VERSION}.`}
            submitLabel="Registrar consentimiento"
            submittingLabel="Registrando…"
            onSubmit={onRecordConsent}
            trigger={
              <button type="button" disabled={isSaving} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary font-sans text-sm text-primary transition-colors hover:bg-secondary/90 disabled:opacity-50">
                <ShieldCheck className="size-4" />
                Registrar consentimiento
              </button>
            }
          />
        </>
      )}
    </CardShell>
  );
}
