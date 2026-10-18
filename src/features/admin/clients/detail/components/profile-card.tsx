"use client";

import { Copy, Lock } from "lucide-react";

import type { ClientDetail, UpdateClientRequest } from "@/src/features/admin/types/clients.types";

import { ageOn } from "../../lib/client-crm";
import { CardShell } from "./card-shell";
import { InlineEditField } from "./inline-edit-field";

interface ProfileCardProps {
  client: ClientDetail;
  todayKey: string;
  onUpdate: (data: UpdateClientRequest) => Promise<boolean>;
  onCopy: (text: string, label: string) => void;
}

const BIRTH_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function ReadonlyField({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-sans text-xs text-secondary/70">{label}</span>
      <div className="flex h-11 items-center justify-between rounded-xl border border-secondary/10 bg-white/60 px-3 font-sans text-sm text-secondary">
        <span className="truncate">{value}</span>
        {onCopy && (
          <button type="button" onClick={onCopy} aria-label={`Copiar ${label}`} className="grid size-7 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5 hover:text-secondary">
            <Copy className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ProfileCard({ client, todayKey, onUpdate, onCopy }: ProfileCardProps) {
  return (
    <CardShell
      title="Perfil"
      aside={
        <span className="inline-flex items-center gap-1 font-sans text-[11px] text-secondary/70">
          <Lock className="size-3" /> Edición en línea
        </span>
      }
    >
      <InlineEditField
        id="client-name"
        label="Nombre · 2 a 100 caracteres"
        value={client.name}
        validate={(value) => value.trim().length >= 2 && value.trim().length <= 100}
        onSave={(name) => onUpdate({ name: name.trim() })}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <ReadonlyField label="Teléfono" value={client.phone} onCopy={() => onCopy(client.phone, "Teléfono")} />
        <InlineEditField
          id="client-birth"
          label={`Nacimiento · ${ageOn(client.birthDate, todayKey)} años`}
          type="date"
          value={client.birthDate}
          displayValue={BIRTH_FORMATTER.format(new Date(`${client.birthDate}T00:00:00Z`))}
          validate={(value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= todayKey}
          onSave={(birthDate) => onUpdate({ birthDate })}
        />
      </div>
      {client.whatsappJid && (
        <ReadonlyField label="WhatsApp JID" value={client.whatsappJid} onCopy={() => onCopy(client.whatsappJid!, "WhatsApp JID")} />
      )}
    </CardShell>
  );
}
