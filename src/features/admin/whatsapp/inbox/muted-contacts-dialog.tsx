"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import { useMutedContacts } from "@/src/features/admin/hooks/use-conduit";

import { formatWhatsappPhone } from "../lib/whatsapp-format";

const PHONE_DIGITS = /^\d{10,15}$/;

export function MutedContactsDialog({
  open,
  onOpenChange,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: ConduitActions;
}) {
  const muted = useMutedContacts(open);
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const digits = phone.replace(/\D/g, "");

  return (
    <ActionDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setPhone("");
          setReason("");
        }
      }}
      title="Números a los que el asistente no responde"
      description="Para bots de otras empresas u otros números que el asistente debe ignorar. Sus mensajes se guardan, pero nunca se les responde ni se gasta inteligencia artificial en ellos. Los recordatorios y campañas no cambian."
      submitLabel="Silenciar número"
      submittingLabel="Silenciando…"
      canSubmit={PHONE_DIGITS.test(digits)}
      onSubmit={async () => {
        const ok = await actions.muteContact(
          digits,
          reason.trim() || undefined,
        );
        if (ok) {
          setPhone("");
          setReason("");
        }
        return false;
      }}
    >
      <div className="flex flex-col gap-4">
        {muted.isLoading ? (
          <p className="font-sans text-sm text-secondary/75">Cargando…</p>
        ) : (muted.data ?? []).length === 0 ? (
          <p className="font-sans text-sm text-secondary/75">
            Todavía no hay números silenciados.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {(muted.data ?? []).map((contact) => (
              <li
                key={contact.address}
                className="flex items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-secondary tabular-nums">
                    {formatWhatsappPhone(contact.address)}
                  </p>
                  {contact.reason && (
                    <p className="font-sans text-xs text-secondary/70">
                      {contact.reason}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Volver a responderle a ${formatWhatsappPhone(contact.address)}`}
                  disabled={actions.busy.has(`mute:${contact.address}`)}
                  onClick={() => void actions.unmuteContact(contact.address)}
                  className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5 disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Field label="Número de WhatsApp" htmlFor="muted-phone">
          <input
            id="muted-phone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="310 852 5522"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Motivo (opcional)" htmlFor="muted-reason">
          <input
            id="muted-reason"
            type="text"
            maxLength={200}
            placeholder="Bot de otra empresa"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
    </ActionDialog>
  );
}
