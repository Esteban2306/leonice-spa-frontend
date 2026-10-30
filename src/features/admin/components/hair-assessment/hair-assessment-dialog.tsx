"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  ChoicePills,
  Field,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { SetHairProfileRequest } from "@/src/features/admin/types/clients.types";
import type {
  HairColor,
  HairDensity,
  HairLength,
} from "@/src/features/admin/types/enums";

import {
  HAIR_COLOR_OPTIONS,
  HAIR_DENSITY_HINT,
  HAIR_DENSITY_OPTIONS,
  HAIR_LENGTH_OPTIONS,
} from "./hair-options";

interface HairAssessmentDialogProps {
  open: boolean;
  clientName: string;
  context?: string;
  initialLength?: HairLength | null;
  initialColor?: HairColor | null;
  initialDensity?: HairDensity | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: SetHairProfileRequest) => Promise<boolean>;
}

export function HairAssessmentDialog({
  open,
  clientName,
  context,
  initialLength,
  initialColor,
  initialDensity,
  onOpenChange,
  onSave,
}: HairAssessmentDialogProps) {
  const [length, setLength] = useState<HairLength | null>(
    initialLength ?? null,
  );
  const [color, setColor] = useState<HairColor | null>(initialColor ?? null);
  const [density, setDensity] = useState<HairDensity | null>(
    initialDensity ?? null,
  );

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Valoración de ${clientName}`}
      description={`${context ? `${context}. ` : ""}Registra el largo, el color y la densidad del cabello: el perfil queda vigente por 4 meses y se usa para cotizar sus servicios capilares.`}
      submitLabel="Guardar valoración"
      submittingLabel="Guardando…"
      canSubmit={length !== null && color !== null && density !== null}
      onSubmit={() =>
        length && color && density
          ? onSave({
              hairLength: length,
              hairColor: color,
              hairDensity: density,
            })
          : Promise.resolve(false)
      }
    >
      <Field label="Largo">
        <ChoicePills<HairLength>
          ariaLabel="Largo del cabello"
          value={length ?? ("" as HairLength)}
          options={HAIR_LENGTH_OPTIONS}
          onChange={setLength}
        />
      </Field>
      <Field label="Color">
        <ChoicePills<HairColor>
          ariaLabel="Color del cabello"
          value={color ?? ("" as HairColor)}
          options={HAIR_COLOR_OPTIONS}
          onChange={setColor}
        />
      </Field>
      <Field label="Densidad" hint={HAIR_DENSITY_HINT}>
        <ChoicePills<HairDensity>
          ariaLabel="Densidad del cabello"
          value={density ?? ("" as HairDensity)}
          options={HAIR_DENSITY_OPTIONS}
          onChange={setDensity}
        />
      </Field>
    </ActionDialog>
  );
}
