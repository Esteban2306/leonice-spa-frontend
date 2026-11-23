"use client";

import { useState } from "react";

import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import Link from "@/src/features/admin/components/admin-link";
import { Store } from "lucide-react";

import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import { useBusinessSettings } from "@/src/features/admin/hooks/use-conduit";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import { useBaseSchedule } from "@/src/features/admin/hooks/use-schedule";
import { WEEK_ORDER } from "@/src/features/admin/calendar/lib/weekly-schedule";
import { formatPesosInput } from "@/src/features/admin/services/lib/catalog";
import type {
  BusinessSettings,
  UpdateBusinessSettingsRequest,
} from "@/src/features/admin/types/conduit.types";
import { formatCopFromThousands } from "@/src/lib/money/cop";

import { ErrorPanel } from "../components/error-panel";
import {
  LABEL,
  PRIMARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "../components/section-card";
import { formatDateTime } from "../lib/whatsapp-format";

type TextKey =
  | "depositInstructions"
  | "productPaymentInstructions"
  | "depositPolicy"
  | "cancellationPolicy"
  | "address"
  | "additionalInfo"
  | "assessmentOffer";

const FIELDS: ReadonlyArray<{
  key: TextKey;
  label: string;
  max: number;
  hint: string;
  rows?: number;
}> = [
  {
    key: "depositInstructions",
    label: "Cómo pagar el anticipo",
    max: 1500,
    hint: "Cuentas, Nequi, llave… El asistente lo comparte tal cual.",
    rows: 4,
  },
  {
    key: "productPaymentInstructions",
    label: "Cómo pagar un pedido de productos",
    max: 1500,
    hint: "La cuenta que el asistente da con cada pedido. Vacío: usa la del anticipo.",
    rows: 3,
  },
  {
    key: "depositPolicy",
    label: "Política del anticipo",
    max: 1500,
    hint: "Qué pasa si no se paga a tiempo o si se cancela.",
  },
  {
    key: "cancellationPolicy",
    label: "Política de cancelación",
    max: 1500,
    hint: "Hasta cuándo se puede cancelar o reagendar.",
  },
  {
    key: "address",
    label: "Dirección",
    max: 300,
    hint: "Como la quieres ver escrita en el chat.",
    rows: 2,
  },
  {
    key: "additionalInfo",
    label: "Otros datos útiles",
    max: 2000,
    hint: "Parqueadero, recomendaciones antes de la cita…",
  },
  {
    key: "assessmentOffer",
    label: "Valoración capilar",
    max: 500,
    hint: "Opcional. Si lo dejas vacío, el asistente no habla del costo de la valoración ni dice que algo es gratis. Lo que escribas lo dirá tal cual (por ejemplo: «La valoración capilar no tiene costo»).",
    rows: 2,
  },
];

const OWNER_PHONE_PATTERN = /^\+?[0-9][0-9 ]{6,28}$/;

function toPesosInput(thousands: number | null): string {
  return thousands === null ? "" : formatPesosInput(String(thousands * 1000));
}

function AutoMessageSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-sm text-secondary">{label}</span>
        <span className="font-sans text-xs text-secondary/70">
          {description}
        </span>
      </div>
      <CatalogSwitch checked={checked} label={label} onChange={onChange} />
    </div>
  );
}

function BusinessForm({ settings }: { settings: BusinessSettings }) {
  const actions = useConduitActions();
  const schedule = useBaseSchedule();
  const [deposit, setDeposit] = useState(toPesosInput(settings.depositAmount));
  const [ownerPhone, setOwnerPhone] = useState(
    settings.ownerContactPhone ?? "",
  );
  const [depositReminder, setDepositReminder] = useState(
    settings.depositReminderEnabled ?? true,
  );
  const [leadFollowUp, setLeadFollowUp] = useState(
    settings.leadFollowUpEnabled ?? false,
  );
  const ownerPhoneValue = ownerPhone.trim() || null;
  const ownerPhoneInvalid =
    ownerPhoneValue !== null && !OWNER_PHONE_PATTERN.test(ownerPhoneValue);
  const [texts, setTexts] = useState<Record<TextKey, string>>({
    depositInstructions: settings.depositInstructions ?? "",
    productPaymentInstructions: settings.productPaymentInstructions ?? "",
    depositPolicy: settings.depositPolicy ?? "",
    cancellationPolicy: settings.cancellationPolicy ?? "",
    address: settings.address ?? "",
    additionalInfo: settings.additionalInfo ?? "",
    assessmentOffer: settings.assessmentOffer ?? "",
  });

  const depositDigits = deposit.replace(/\D/g, "");
  const depositPesos = depositDigits === "" ? null : Number(depositDigits);
  const depositThousands =
    depositPesos === null ? null : Math.round(depositPesos / 1000);
  const depositInvalid =
    depositPesos !== null &&
    (depositPesos % 1000 !== 0 || depositThousands! > 10000);

  const payload: UpdateBusinessSettingsRequest = {
    depositAmount: depositThousands,
    ownerContactPhone: ownerPhoneValue,
    depositReminderEnabled: depositReminder,
    leadFollowUpEnabled: leadFollowUp,
    ...Object.fromEntries(
      FIELDS.map(({ key }) => [key, texts[key].trim() || null]),
    ),
  };
  const dirty =
    payload.depositAmount !== settings.depositAmount ||
    ownerPhoneValue !== (settings.ownerContactPhone ?? null) ||
    depositReminder !== (settings.depositReminderEnabled ?? true) ||
    leadFollowUp !== (settings.leadFollowUpEnabled ?? false) ||
    FIELDS.some(
      ({ key }) => (payload[key] ?? null) !== (settings[key] ?? null),
    );

  const windows = schedule.data ?? [];

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <SectionCard
        title="Información del negocio"
        icon={<Store className="size-5" strokeWidth={1.7} />}
        description={
          settings.updatedAt
            ? `Última actualización: ${formatDateTime(settings.updatedAt)}`
            : "Aún no se ha guardado."
        }
      >
        {!texts.depositInstructions.trim() && (
          <p
            role="status"
            className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900"
          >
            El asistente no podrá decir cómo pagar el anticipo hasta que
            completes ese campo.
          </p>
        )}
        <Field
          label="Valor del anticipo (pesos)"
          htmlFor="b-deposit"
          hint={
            depositInvalid
              ? "Usa miles exactos, hasta $10.000.000."
              : "Déjalo vacío si no cobras anticipo."
          }
        >
          <input
            id="b-deposit"
            inputMode="numeric"
            value={deposit}
            aria-invalid={depositInvalid}
            placeholder="35.000"
            onChange={(e) => setDeposit(formatPesosInput(e.target.value))}
            className={`${INPUT_CLASS} max-w-xs tabular-nums`}
          />
        </Field>
        {FIELDS.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            htmlFor={`b-${field.key}`}
            hint={`${field.hint} ${texts[field.key].length}/${field.max}`}
          >
            <TextArea
              id={`b-${field.key}`}
              rows={field.rows ?? 3}
              maxLength={field.max}
              value={texts[field.key]}
              onChange={(e) =>
                setTexts({ ...texts, [field.key]: e.target.value })
              }
            />
          </Field>
        ))}
        <Field
          label="WhatsApp de Leo"
          htmlFor="b-owner-phone"
          hint={
            ownerPhoneInvalid
              ? "Solo dígitos, espacios y un + inicial (entre 7 y 30 caracteres)."
              : "El asistente lo comparte cuando una clienta pregunta por Leo para algo que no es una cita. Vacío: ofrece avisarle."
          }
        >
          <input
            id="b-owner-phone"
            inputMode="tel"
            value={ownerPhone}
            maxLength={30}
            aria-invalid={ownerPhoneInvalid}
            placeholder="+57 300 123 4567"
            onChange={(e) => setOwnerPhone(e.target.value)}
            className={`${INPUT_CLASS} max-w-xs tabular-nums`}
          />
        </Field>
        <fieldset className="flex flex-col gap-3 rounded-2xl border border-secondary/10 bg-white/50 p-4">
          <legend className="px-1 font-sans text-sm font-medium text-secondary">
            Mensajes automáticos a clientas
          </legend>
          <AutoMessageSwitch
            label="Recordar el anticipo"
            description="30 minutos antes de que venza el plazo, si todavía no envió el comprobante. Una sola vez por cita."
            checked={depositReminder}
            onChange={setDepositReminder}
          />
          <AutoMessageSwitch
            label="Escribirle a quien dejó sus datos y no agendó"
            description="Un solo mensaje al día siguiente, a las 10:30 a. m. Nunca a números silenciados."
            checked={leadFollowUp}
            onChange={setLeadFollowUp}
          />
        </fieldset>
        <button
          type="button"
          className={`${PRIMARY_BUTTON} w-fit`}
          disabled={
            !dirty ||
            depositInvalid ||
            ownerPhoneInvalid ||
            actions.busy.has("business")
          }
          onClick={() => void actions.saveBusinessSettings(payload)}
        >
          Guardar información
        </button>
      </SectionCard>

      <SectionCard
        title="Así lo comunicará el asistente"
        description="Vista previa con lo que tienes escrito ahora."
      >
        <div className="flex flex-col gap-4 rounded-[1.5rem] bg-primary/50 p-4">
          <PreviewBlock title="Anticipo">
            {depositPesos !== null
              ? `${formatCopFromThousands(depositThousands ?? 0)} para confirmar la cita.`
              : "No se cobra anticipo."}
            {texts.depositInstructions.trim() &&
              `\n${texts.depositInstructions.trim()}`}
          </PreviewBlock>
          {texts.depositPolicy.trim() && (
            <PreviewBlock title="Política del anticipo">
              {texts.depositPolicy.trim()}
            </PreviewBlock>
          )}
          {texts.cancellationPolicy.trim() && (
            <PreviewBlock title="Cancelaciones">
              {texts.cancellationPolicy.trim()}
            </PreviewBlock>
          )}
          {ownerPhoneValue && !ownerPhoneInvalid && (
            <PreviewBlock title="Si preguntan por Leo">
              {`Ahora las citas se atienden por aquí. Para otro tema puedes escribirle a Leo al ${ownerPhoneValue}.`}
            </PreviewBlock>
          )}
          {texts.address.trim() && (
            <PreviewBlock title="Dirección">
              {texts.address.trim()}
            </PreviewBlock>
          )}
          <PreviewBlock title="Horario">
            {windows.length === 0
              ? "Sin horario cargado."
              : WEEK_ORDER.map(({ dayOfWeek, label }) => {
                  const day = windows.filter((w) => w.dayOfWeek === dayOfWeek);
                  return `${label}: ${day.length ? day.map((w) => `${w.startTime}–${w.endTime}`).join(", ") : "cerrado"}`;
                }).join("\n")}
          </PreviewBlock>
          {texts.additionalInfo.trim() && (
            <PreviewBlock title="Otros datos">
              {texts.additionalInfo.trim()}
            </PreviewBlock>
          )}
          {texts.assessmentOffer.trim() && (
            <PreviewBlock title="Valoración capilar">
              {texts.assessmentOffer.trim()}
            </PreviewBlock>
          )}
        </div>
        <Link
          href="/admin/calendar"
          className="w-fit font-sans text-sm text-secondary underline decoration-tertiary underline-offset-4"
        >
          El horario se edita en Calendario → Horario semanal
        </Link>
      </SectionCard>
    </div>
  );
}

function PreviewBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[90%] self-end rounded-[1.25rem] rounded-br-md border border-tertiary/40 bg-quaternary/35 px-4 py-2.5">
      <p className={LABEL}>{title}</p>
      <p className="mt-1 font-sans text-sm whitespace-pre-wrap text-secondary">
        {children}
      </p>
    </div>
  );
}

export function BusinessSection() {
  const settings = useBusinessSettings();
  if (settings.isLoading) return <SkeletonRows rows={3} height="h-40" />;
  if (settings.isError || !settings.data)
    return (
      <ErrorPanel
        error={settings.error}
        onRetry={() => void settings.refetch()}
      />
    );
  return (
    <BusinessForm
      key={settings.data.updatedAt ?? "new"}
      settings={settings.data}
    />
  );
}
