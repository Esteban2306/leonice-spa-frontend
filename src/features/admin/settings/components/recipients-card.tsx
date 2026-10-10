"use client";

import { useState, type FormEvent } from "react";
import {
  BellRing,
  CalendarClock,
  CircleX,
  Hourglass,
  Plus,
} from "lucide-react";

import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminNotificationRecipient,
  CreateNotificationRecipientRequest,
} from "@/src/features/admin/types/settings.types";

import { isPlausiblePhone } from "../lib/phone";
import { RecipientRow } from "./recipient-row";

interface RecipientsCardProps {
  recipients: readonly AdminNotificationRecipient[];
  isLoading: boolean;
  isError: boolean;
  isSaving: boolean;
  onRetry: () => void;
  onCreate: (data: CreateNotificationRecipientRequest) => Promise<boolean>;
  onRename: (recipientId: string, name: string) => Promise<boolean>;
  onToggle: (recipientId: string, isActive: boolean) => Promise<boolean>;
}

const NOTICES = [
  { icon: Hourglass, label: "Depósito vencido" },
  { icon: CalendarClock, label: "Reprogramación" },
  { icon: CircleX, label: "Cancelación de la clienta" },
] as const;

export function RecipientsCard({
  recipients,
  isLoading,
  isError,
  isSaving,
  onRetry,
  onCreate,
  onRename,
  onToggle,
}: RecipientsCardProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const activeCount = recipients.filter((r) => r.isActive).length;
  const canAdd = name.trim().length >= 2 && isPlausiblePhone(phone);
  const showPhoneHint = phone.trim().length > 0 && !isPlausiblePhone(phone);

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAdd || isSaving) return;
    const ok = await onCreate({ name: name.trim(), phone: phone.trim() });
    if (ok) {
      setName("");
      setPhone("");
    }
  };

  return (
    <section
      aria-labelledby="recipients-title"
      className="flex flex-col gap-5 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-5 sm:p-6"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-secondary text-quaternary">
              <BellRing className="size-5" strokeWidth={1.7} />
            </span>
            <div>
              <h2
                id="recipients-title"
                className="font-heading text-2xl leading-tight text-secondary"
              >
                Avisos por WhatsApp
              </h2>
              <p className="font-sans text-sm text-secondary/70">
                {activeCount === 1
                  ? "1 número activo"
                  : `${activeCount} números activos`}
              </p>
            </div>
          </div>
        </div>
        <p className="font-sans text-sm text-secondary/75">
          Estos números reciben un WhatsApp del sistema cuando pasa algo que el
          equipo debe saber:
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
          {NOTICES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 font-sans text-sm text-secondary"
            >
              <Icon className="size-4 text-tertiary" strokeWidth={1.8} />
              {label}
            </li>
          ))}
        </ul>
      </header>

      {isError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
        >
          No se pudieron cargar los destinatarios.
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="h-[70px] animate-pulse rounded-[1.25rem] bg-secondary/5"
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && activeCount === 0 && (
        <p
          role="status"
          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900"
        >
          Nadie está recibiendo avisos ahora. Agrega o activa al menos un número
          para no perderte cancelaciones ni depósitos vencidos.
        </p>
      )}

      {recipients.length > 0 && (
        <ul className="flex flex-col gap-2">
          {recipients.map((recipient) => (
            <RecipientRow
              key={`${recipient.id}-${recipient.name}`}
              recipient={recipient}
              isBusy={isSaving}
              onRename={onRename}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}

      <form
        onSubmit={(event) => void add(event)}
        className="flex flex-col gap-3 rounded-[1.5rem] border border-dashed border-tertiary/50 p-4"
      >
        <p className="font-sans text-sm font-semibold text-secondary">
          Agregar un número
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="recipient-name">
            <input
              id="recipient-name"
              value={name}
              maxLength={100}
              placeholder="Ej. Recepción"
              onChange={(event) => setName(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field
            label="WhatsApp"
            htmlFor="recipient-phone"
            hint={
              showPhoneHint
                ? "Revisa el número: incluye 10 dígitos o el indicativo."
                : undefined
            }
          >
            <input
              id="recipient-phone"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              maxLength={32}
              placeholder="300 123 4567"
              onChange={(event) => setPhone(event.target.value)}
              className={`${INPUT_CLASS} tabular-nums`}
            />
          </Field>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-xs text-secondary/70">
            El número no se puede editar después: si cambia, agrega el nuevo y
            pausa el anterior.
          </p>
          <button
            type="submit"
            disabled={!canAdd || isSaving}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4" strokeWidth={2} />
            Agregar
          </button>
        </div>
      </form>
    </section>
  );
}
