"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  CheckboxField,
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type { EscalationContact } from "@/src/features/admin/types/conduit.types";

import { PRIMARY_BUTTON, SectionCard } from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import { formatWhatsappPhone } from "../lib/whatsapp-format";

const NOTIFY_LABELS = {
  TECHNICAL_ERROR: "Fallas técnicas",
  BUSINESS_ERROR: "Errores del negocio",
} as const;

export function EscalationTab({
  contacts,
  actions,
}: {
  contacts: readonly EscalationContact[];
  actions: ConduitActions;
}) {
  const [label, setLabel] = useState("");
  const [phone, setPhone] = useState("");
  const [technical, setTechnical] = useState(true);
  const [business, setBusiness] = useState(false);
  const digits = phone.replace(/\D/g, "");
  const canAdd =
    label.trim().length >= 2 && digits.length >= 10 && (technical || business);

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAdd) return;
    const notifyOn = [
      technical && "TECHNICAL_ERROR",
      business && "BUSINESS_ERROR",
    ].filter(Boolean) as EscalationContact["notifyOn"];
    const normalized = digits.length === 10 ? `+57${digits}` : `+${digits}`;
    const ok = await actions.addEscalationContact({
      label: label.trim(),
      phoneNumber: normalized,
      notifyOn,
    });
    if (ok) {
      setLabel("");
      setPhone("");
    }
  };

  return (
    <SectionCard
      title="A quién avisar"
      description="Reciben un WhatsApp cuando el asistente falla, cuando la IA no está disponible o cuando una clienta escribe demasiado seguido."
    >
      <ul className="flex flex-col gap-2">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-semibold text-secondary">
                {contact.label}
              </p>
              <p className="font-sans text-sm text-secondary/75 tabular-nums">
                {formatWhatsappPhone(contact.phoneNumber)}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contact.notifyOn.map((kind) => (
                <StatusPill key={kind} tone="gray">
                  {NOTIFY_LABELS[kind]}
                </StatusPill>
              ))}
            </div>
            <button
              type="button"
              aria-label={`Quitar a ${contact.label}`}
              disabled={actions.busy.has(`escalation:${contact.id}`)}
              onClick={() => void actions.removeEscalationContact(contact.id)}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
        {contacts.length === 0 && (
          <li className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900">
            Nadie recibe los avisos de fallas del asistente. Agrega al menos un
            número del equipo.
          </li>
        )}
      </ul>
      <form
        onSubmit={(event) => void add(event)}
        className="flex flex-col gap-3 rounded-[1.5rem] border border-dashed border-tertiary/50 p-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="esc-label">
            <input
              id="esc-label"
              value={label}
              maxLength={60}
              placeholder="Ej. Recepción"
              onChange={(e) => setLabel(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="WhatsApp" htmlFor="esc-phone">
            <input
              id="esc-phone"
              inputMode="tel"
              value={phone}
              placeholder="300 123 4567"
              onChange={(e) => setPhone(e.target.value)}
              className={`${INPUT_CLASS} tabular-nums`}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CheckboxField
            id="esc-tech"
            checked={technical}
            onChange={setTechnical}
            label="Fallas técnicas"
            description="La IA no responde o el asistente falla."
          />
          <CheckboxField
            id="esc-biz"
            checked={business}
            onChange={setBusiness}
            label="Errores del negocio"
            description="El sistema del spa rechaza una acción."
          />
        </div>
        <p className="font-sans text-xs text-secondary/70">
          Esa persona debe escribirle una vez al WhatsApp del spa para poder
          recibir avisos.
        </p>
        <button
          type="submit"
          className={`${PRIMARY_BUTTON} w-fit`}
          disabled={!canAdd || actions.busy.has("escalation:add")}
        >
          <Plus className="size-4" />
          Agregar contacto
        </button>
      </form>
    </SectionCard>
  );
}
