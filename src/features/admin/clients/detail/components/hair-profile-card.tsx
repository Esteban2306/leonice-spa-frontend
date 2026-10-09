"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { ChoicePills, Field } from "@/src/features/admin/components/reservation-actions/form-controls";
import type { HairProfileView, SetHairProfileRequest } from "@/src/features/admin/types/clients.types";
import type { HairColor, HairLength } from "@/src/features/admin/types/enums";

import { HAIR_COLOR_OPTIONS, HAIR_LENGTH_OPTIONS } from "@/src/features/admin/components/hair-assessment/hair-options";

import { validityProgress } from "../../lib/client-crm";
import { CardShell } from "./card-shell";

interface HairProfileCardProps {
  profile: HairProfileView;
  nowMs: number;
  isSaving: boolean;
  onSave: (data: SetHairProfileRequest) => Promise<boolean>;
  onConfirm: () => Promise<boolean>;
}

const STATUS_BADGE = {
  VALID: { label: "Vigente", className: "bg-green-100 text-green-800" },
  EXPIRED: { label: "Vencido", className: "bg-amber-100 text-amber-900" },
  MISSING: { label: "Sin registrar", className: "bg-primary/10 text-primary/70" },
} as const;

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Bogota" });

export function HairProfileCard({ profile, nowMs, isSaving, onSave, onConfirm }: HairProfileCardProps) {
  const [length, setLength] = useState<HairLength>(profile.hairLength ?? "MEDIANO");
  const [color, setColor] = useState<HairColor>(profile.hairColor ?? "OSCURO");
  const progress = validityProgress(profile.updatedAt, profile.validUntil, nowMs);
  const badge = STATUS_BADGE[profile.status];
  const hasProfile = profile.status !== "MISSING";

  return (
    <CardShell
      tone="dark"
      title="Perfil capilar"
      icon={<Scissors className="size-4 text-quaternary" />}
      aside={<span className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] ${badge.className}`}>{badge.label}</span>}
    >
      {hasProfile ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            {[profile.hairLength, profile.hairColor].map((value) => (
              <span key={value} className="rounded-full bg-primary/10 py-2 text-center font-sans text-xs tracking-wide">
                {value}
              </span>
            ))}
          </div>
          {progress && profile.validUntil && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-sans text-[11px] text-primary/65">
                <span>Vigente hasta {DATE_FORMATTER.format(new Date(profile.validUntil))}</span>
                <span>{progress.daysLeft} días</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                <div className={`h-full rounded-full ${profile.status === "VALID" ? "bg-tertiary" : "bg-amber-500"}`} style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="font-sans text-sm text-primary/65">
          Aún no tiene perfil capilar. Regístralo para cotizar y agendar servicios capilares.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <ActionDialog
          title="Actualizar perfil capilar"
          description="Al guardar, el perfil queda vigente por 4 meses."
          submitLabel="Guardar perfil"
          submittingLabel="Guardando…"
          onSubmit={() => onSave({ hairLength: length, hairColor: color })}
          trigger={
            <button type="button" disabled={isSaving} className="h-10 cursor-pointer rounded-full bg-tertiary font-sans text-sm text-secondary transition-colors hover:bg-quaternary disabled:opacity-50">
              {hasProfile ? "Actualizar perfil" : "Registrar perfil"}
            </button>
          }
        >
          <Field label="Largo">
            <ChoicePills ariaLabel="Largo del cabello" value={length} options={HAIR_LENGTH_OPTIONS} onChange={setLength} />
          </Field>
          <Field label="Color">
            <ChoicePills ariaLabel="Color del cabello" value={color} options={HAIR_COLOR_OPTIONS} onChange={setColor} />
          </Field>
        </ActionDialog>

        <button
          type="button"
          disabled={!hasProfile || isSaving}
          onClick={() => void onConfirm()}
          title={hasProfile ? "Renueva la vigencia sin cambiar los datos" : "Primero registra el perfil"}
          className="h-10 cursor-pointer rounded-full border border-primary/25 font-sans text-sm text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirmar vigencia
        </button>
      </div>
    </CardShell>
  );
}
