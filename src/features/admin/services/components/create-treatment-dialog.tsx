"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";
import type { CreateTreatmentRequest } from "@/src/features/admin/types/treatments.types";

import {
  emptyTreatmentDraft,
  validateTreatmentDraft,
  type TreatmentDraftErrors,
} from "../lib/treatment-draft";
import { TreatmentFields } from "./treatment-fields";

interface CreateTreatmentDialogProps {
  open: boolean;
  defaultCategoryId: string;
  categories: readonly AdminCategory[];
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateTreatmentRequest) => Promise<boolean>;
}

export function CreateTreatmentDialog({
  open,
  defaultCategoryId,
  categories,
  onOpenChange,
  onCreate,
}: CreateTreatmentDialogProps) {
  const [draft, setDraft] = useState(() =>
    emptyTreatmentDraft(defaultCategoryId),
  );
  const [errors, setErrors] = useState<TreatmentDraftErrors>({});

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo servicio"
      description="Queda activo y disponible para reservas en cuanto lo crees."
      submitLabel="Crear servicio"
      submittingLabel="Creando…"
      canSubmit={draft.name.trim().length >= 2}
      onSubmit={async () => {
        const result = validateTreatmentDraft(draft);
        setErrors(result.errors);
        if (!result.data) return false;
        return onCreate(result.data);
      }}
    >
      <TreatmentFields
        idPrefix="new-treatment"
        draft={draft}
        errors={errors}
        categories={categories}
        onChange={setDraft}
      />
    </ActionDialog>
  );
}
