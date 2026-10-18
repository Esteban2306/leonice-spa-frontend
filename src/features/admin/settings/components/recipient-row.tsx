"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type { AdminNotificationRecipient } from "@/src/features/admin/types/settings.types";

import { isPlausibleEmail, normalizeEmail } from "../lib/email";
import { formatPhone, initialsOf } from "../lib/phone";

interface RecipientRowProps {
  recipient: AdminNotificationRecipient;
  isBusy: boolean;
  onRename: (recipientId: string, name: string) => Promise<boolean>;
  onChangeEmail: (recipientId: string, email: string | null) => Promise<boolean>;
  onToggle: (recipientId: string, isActive: boolean) => Promise<boolean>;
}

type Draft = { field: "name" | "email"; value: string };

const ICON_BUTTON =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/75 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-40";

function draftError(draft: Draft): string | null {
  const value = draft.value.trim();
  if (draft.field === "name") return value.length < 2 ? "Escribe al menos 2 letras." : null;
  return value.length > 0 && !isPlausibleEmail(value)
    ? "Revisa el correo, por ejemplo recepcion@gmail.com."
    : null;
}

export function RecipientRow({
  recipient,
  isBusy,
  onRename,
  onChangeEmail,
  onToggle,
}: RecipientRowProps) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const error = draft ? draftError(draft) : null;
  const current = draft?.field === "name" ? recipient.name : (recipient.email ?? "");
  const unchanged = draft !== null && draft.value.trim() === current;
  const errorId = `recipient-${recipient.id}-error`;

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || error || isBusy) return;
    if (unchanged) {
      setDraft(null);
      return;
    }
    const value = draft.value.trim();
    const ok =
      draft.field === "name"
        ? await onRename(recipient.id, value)
        : await onChangeEmail(recipient.id, value ? normalizeEmail(value) : null);
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
            : "bg-secondary/10 text-secondary/75",
        )}
      >
        {initialsOf(recipient.name)}
      </span>

      <div className="min-w-0 flex-1">
        {draft ? (
          <form noValidate onSubmit={(event) => void save(event)} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                type={draft.field === "email" ? "email" : "text"}
                aria-label={
                  draft.field === "name"
                    ? `Nuevo nombre para ${recipient.name}`
                    : `Correo de ${recipient.name}`
                }
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                placeholder={draft.field === "email" ? "recepcion@gmail.com" : undefined}
                value={draft.value}
                maxLength={draft.field === "email" ? 254 : 100}
                onChange={(event) => setDraft({ ...draft, value: event.target.value })}
                onKeyDown={(event) => event.key === "Escape" && setDraft(null)}
                className={`${INPUT_CLASS} h-10 min-w-0 flex-1`}
              />
              <button
                type="submit"
                aria-label={draft.field === "name" ? "Guardar nombre" : "Guardar correo"}
                disabled={Boolean(error) || isBusy}
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
            </div>
            {error ? (
              <p id={errorId} className="font-sans text-xs font-medium text-red-700">
                {error}
              </p>
            ) : (
              draft.field === "email" && (
                <p className="font-sans text-xs text-secondary/75">
                  Déjalo vacío para que solo reciba WhatsApp.
                </p>
              )
            )}
          </form>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <p
                className={cn(
                  "truncate font-sans text-[15px] font-semibold",
                  recipient.isActive ? "text-secondary" : "text-secondary/75",
                )}
              >
                {recipient.name}
              </p>
              <button
                type="button"
                aria-label={`Editar el nombre de ${recipient.name}`}
                onClick={() => setDraft({ field: "name", value: recipient.name })}
                className={`${ICON_BUTTON} size-8`}
              >
                <Pencil className="size-3.5" strokeWidth={1.8} />
              </button>
            </div>
            <p className="font-sans text-sm text-secondary/75 tabular-nums">
              {formatPhone(recipient.phone)}
            </p>
            <button
              type="button"
              onClick={() => setDraft({ field: "email", value: recipient.email ?? "" })}
              aria-label={
                recipient.email
                  ? `Cambiar el correo de ${recipient.name}`
                  : `Agregar un correo para ${recipient.name}`
              }
              className="mt-0.5 inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full font-sans text-sm text-secondary/75 underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              <Mail aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{recipient.email ?? "Agregar correo"}</span>
            </button>
          </>
        )}
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
        <span className="font-sans text-[11px] text-secondary/75">
          {recipient.isActive ? "Recibe avisos" : "Pausado"}
        </span>
      </div>
    </li>
  );
}
