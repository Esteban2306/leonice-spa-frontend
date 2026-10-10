"use client";

import { useState, type FormEvent } from "react";
import { Check, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type { AdminNotificationRecipient } from "@/src/features/admin/types/settings.types";

import { formatPhone, initialsOf } from "../lib/phone";

interface RecipientRowProps {
  recipient: AdminNotificationRecipient;
  isBusy: boolean;
  onRename: (recipientId: string, name: string) => Promise<boolean>;
  onToggle: (recipientId: string, isActive: boolean) => Promise<boolean>;
}

const ICON_BUTTON =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/70 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-40";

export function RecipientRow({
  recipient,
  isBusy,
  onRename,
  onToggle,
}: RecipientRowProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const isEditing = draft !== null;
  const canSave =
    isEditing && draft.trim().length >= 2 && draft.trim() !== recipient.name;

  const save = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!canSave || draft === null) return;
    const ok = await onRename(recipient.id, draft.trim());
    if (ok) setDraft(null);
  };

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-[1.25rem] border p-3 transition-colors",
        recipient.isActive
          ? "border-tertiary/30 bg-white/80"
          : "border-dashed border-secondary/20 bg-primary/40",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-full font-sans text-sm font-semibold",
          recipient.isActive
            ? "bg-secondary text-quaternary"
            : "bg-secondary/10 text-secondary/60",
        )}
      >
        {initialsOf(recipient.name)}
      </span>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <form
            onSubmit={(event) => void save(event)}
            className="flex items-center gap-1.5"
          >
            <input
              autoFocus
              aria-label={`Nuevo nombre para ${recipient.name}`}
              value={draft}
              maxLength={100}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && setDraft(null)}
              className={`${INPUT_CLASS} h-10 min-w-0 flex-1`}
            />
            <button
              type="submit"
              aria-label="Guardar nombre"
              disabled={!canSave || isBusy}
              className={ICON_BUTTON}
            >
              <Check className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Cancelar edición"
              onClick={() => setDraft(null)}
              className={ICON_BUTTON}
            >
              <X className="size-4" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-1">
            <p
              className={cn(
                "truncate font-sans text-[15px] font-semibold",
                recipient.isActive ? "text-secondary" : "text-secondary/65",
              )}
            >
              {recipient.name}
            </p>
            <button
              type="button"
              aria-label={`Editar el nombre de ${recipient.name}`}
              onClick={() => setDraft(recipient.name)}
              className={`${ICON_BUTTON} size-8`}
            >
              <Pencil className="size-3.5" strokeWidth={1.8} />
            </button>
          </div>
        )}
        <p className="font-sans text-sm text-secondary/70 tabular-nums">
          {formatPhone(recipient.phone)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <CatalogSwitch
          checked={recipient.isActive}
          disabled={isBusy}
          label={
            recipient.isActive
              ? `Pausar avisos para ${recipient.name}`
              : `Activar avisos para ${recipient.name}`
          }
          onChange={(next) => void onToggle(recipient.id, next)}
        />
        <span className="font-sans text-[11px] text-secondary/70">
          {recipient.isActive ? "Recibe avisos" : "Pausado"}
        </span>
      </div>
    </li>
  );
}
