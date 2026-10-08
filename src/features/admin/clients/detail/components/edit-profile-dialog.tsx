"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { Field, INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ClientDetail, UpdateClientRequest } from "@/src/features/admin/types/clients.types";

interface EditProfileDialogProps {
  open: boolean;
  client: ClientDetail;
  todayKey: string;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UpdateClientRequest) => Promise<boolean>;
}

export function EditProfileDialog({ open, client, todayKey, onOpenChange, onSave }: EditProfileDialogProps) {
  const [name, setName] = useState(client.name);
  const [birthDate, setBirthDate] = useState(client.birthDate);

  const trimmed = name.trim();
  const canSubmit = trimmed.length >= 2 && trimmed.length <= 100 && birthDate !== "" && birthDate <= todayKey;

  return (
    <ActionDialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setName(client.name);
          setBirthDate(client.birthDate);
        }
        onOpenChange(next);
      }}
      title="Editar perfil"
      description="El teléfono identifica al cliente y no se puede cambiar desde aquí."
      submitLabel="Guardar cambios"
      submittingLabel="Guardando…"
      canSubmit={canSubmit}
      onSubmit={() => onSave({ name: trimmed, birthDate })}
    >
      <Field label="Nombre completo" htmlFor="edit-name">
        <input id="edit-name" value={name} maxLength={100} onChange={(event) => setName(event.target.value)} className={INPUT_CLASS} />
      </Field>
      <Field label="Fecha de nacimiento" htmlFor="edit-birth">
        <input id="edit-birth" type="date" max={todayKey} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className={INPUT_CLASS} />
      </Field>
    </ActionDialog>
  );
}
