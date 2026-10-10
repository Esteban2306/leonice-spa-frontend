"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  ConduitTemplate,
  SaveTemplateRequest,
  TemplateUsage,
} from "@/src/features/admin/types/conduit.types";

import {
  REQUIRED_TEMPLATE_VARIABLES,
  missingVariables,
  templateVariables,
} from "../lib/whatsapp-format";

const SAMPLE: Record<string, string> = {
  nombre: "Daniela",
  cliente: "Daniela Rojas",
  telefono: "+57 300 123 4567",
  fecha: "vie 15 oct, 8:00 a. m.",
  fecha_anterior: "jue 14 oct, 9:00 a. m.",
  fecha_nueva: "vie 15 oct, 8:00 a. m.",
  tratamiento: "Alisado",
  tratamientos: "Alisado, Tradicional",
  dias: "60",
  promocion: "Octubre de uñas",
  descuento: "15",
  plazo: "2 horas",
  enlace: "https://leonice.co/cancelar/…",
  motivo: "Quiere hablar con una persona",
  resumen: "Pregunta por precios de uñas acrílicas",
  origen: "WhatsApp",
  canal: "Enlace",
};

function renderPreview(body: string): string {
  return body.replace(
    /\{\{\s*([\w.]+)\s*\}\}/g,
    (_, name: string) => SAMPLE[name] ?? `[${name}]`,
  );
}

export function TemplateEditorDialog({
  open,
  template,
  usage,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  template: ConduitTemplate | null;
  usage: TemplateUsage | null;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string | null, data: SaveTemplateRequest) => Promise<boolean>;
}) {
  const [name, setName] = useState(template?.name ?? usage?.catalogName ?? "");
  const [description, setDescription] = useState(
    template?.description ?? usage?.description ?? "",
  );
  const [body, setBody] = useState(
    template?.bodyHandlebars ?? usage?.suggestedBody ?? "",
  );
  const [purpose, setPurpose] = useState(usage?.name ?? "");
  const required = purpose
    ? (REQUIRED_TEMPLATE_VARIABLES[purpose]?.variables ?? [])
    : [];
  const missing = missingVariables(body, required);
  const used = templateVariables(body);
  const canSave = name.trim().length >= 2 && body.trim().length > 0;

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={template ? "Editar plantilla" : "Nueva plantilla"}
      description="Texto plano de WhatsApp. Usa *negrita*, _cursiva_ y variables como {{nombre}}."
      submitLabel="Guardar plantilla"
      submittingLabel="Guardando…"
      canSubmit={canSave}
      onSubmit={() =>
        onSave(template?.id ?? null, {
          name: name.trim(),
          ...(description.trim() ? { description: description.trim() } : {}),
          channel: "WHATSAPP",
          bodyHandlebars: body,
        })
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="tpl-name">
          <input
            id="tpl-name"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field
          label="Validar para"
          htmlFor="tpl-purpose"
          hint="Revisa que estén las variables obligatorias."
        >
          <select
            id="tpl-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">Sin validar</option>
            {Object.keys(REQUIRED_TEMPLATE_VARIABLES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Descripción (opcional)" htmlFor="tpl-desc">
        <input
          id="tpl-desc"
          value={description}
          maxLength={200}
          onChange={(e) => setDescription(e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Mensaje" htmlFor="tpl-body">
        <TextArea
          id="tpl-body"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="font-mono text-xs leading-relaxed"
        />
      </Field>
      {used.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Variables usadas">
          {used.map((variable) => (
            <span
              key={variable}
              className="rounded-full bg-quaternary/35 px-2.5 py-0.5 font-mono text-[11px] text-secondary"
            >{`{{${variable}}}`}</span>
          ))}
        </div>
      )}
      {missing.length > 0 && (
        <p
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-xs text-amber-900"
        >
          Faltan variables obligatorias:{" "}
          {missing.map((m) => `{{${m}}}`).join(", ")}
        </p>
      )}
      {purpose.startsWith("RESERVATION_REMINDER") &&
        body.trim() &&
        !body.trim().endsWith("?") && (
          <p className="font-sans text-xs text-secondary/70">
            Sugerencia: termina con una pregunta (“¿Nos confirmas tu
            asistencia?”) para que el asistente entienda el “sí”.
          </p>
        )}
      <div>
        <p className="mb-1.5 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
          Vista previa
        </p>
        <div className="rounded-[1.25rem] bg-primary p-3">
          <p className="ml-auto max-w-[90%] rounded-[1.1rem] rounded-br-md bg-white px-3.5 py-2 font-sans text-sm whitespace-pre-wrap text-secondary shadow-[0_6px_16px_-14px_rgba(6,33,18,0.5)]">
            {body.trim()
              ? renderPreview(body)
              : "Escribe el mensaje para verlo aquí."}
          </p>
        </div>
      </div>
    </ActionDialog>
  );
}
