"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  CheckboxField,
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminCategory,
  CreateCategoryRequest,
} from "@/src/features/admin/types/categories.types";

interface CategoryDialogProps {
  open: boolean;
  category: AdminCategory | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateCategoryRequest) => Promise<boolean>;
}

export function CategoryDialog({
  open,
  category,
  onOpenChange,
  onSave,
}: CategoryDialogProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [isPrincipal, setIsPrincipal] = useState(
    category?.isPrincipal ?? false,
  );
  const [tracksHairProfile, setTracksHairProfile] = useState(
    category?.tracksHairProfile ?? false,
  );

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? "Editar categoría" : "Nueva categoría"}
      description={
        category
          ? "Los cambios aplican de inmediato al bot y al calendario."
          : "Después agrégale capacidad para que se pueda reservar."
      }
      submitLabel={category ? "Guardar cambios" : "Crear categoría"}
      submittingLabel="Guardando…"
      canSubmit={name.trim().length >= 2}
      onSubmit={() =>
        onSave({ name: name.trim(), isPrincipal, tracksHairProfile })
      }
    >
      <Field label="Nombre" htmlFor="category-name">
        <input
          id="category-name"
          value={name}
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <CheckboxField
        id="category-principal"
        checked={isPrincipal}
        onChange={setIsPrincipal}
        label="Principal en combos"
        description="En un combo del mismo día, esta categoría se agenda primero."
      />
      <CheckboxField
        id="category-hair"
        checked={tracksHairProfile}
        onChange={setTracksHairProfile}
        label="Registra perfil capilar"
        description="Sus servicios usan y renuevan el perfil capilar de la clienta."
      />
    </ActionDialog>
  );
}
