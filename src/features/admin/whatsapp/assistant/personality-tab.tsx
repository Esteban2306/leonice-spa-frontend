"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import {
  ChoicePills,
  CheckboxField,
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import { conduitApi } from "@/src/features/admin/api/conduit.api";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type { PromptSettings } from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SectionCard,
} from "../components/section-card";

type TextKey =
  | "agentName"
  | "tone"
  | "companyName"
  | "personality"
  | "goals"
  | "companyServices"
  | "businessHours"
  | "greeting"
  | "farewell"
  | "restrictions";

const TEXT_FIELDS: ReadonlyArray<{
  key: TextKey;
  label: string;
  max: number;
  multiline?: boolean;
  hint?: string;
}> = [
  { key: "agentName", label: "Nombre del asistente", max: 60 },
  { key: "tone", label: "Tono", max: 60, hint: "Ej. cálido y cercano" },
  { key: "companyName", label: "Nombre del negocio", max: 120 },
  { key: "personality", label: "Personalidad", max: 2000, multiline: true },
  { key: "goals", label: "Objetivos", max: 2000, multiline: true },
  {
    key: "companyServices",
    label: "Servicios que menciona",
    max: 4000,
    multiline: true,
  },
  {
    key: "businessHours",
    label: "Horario que comunica",
    max: 500,
    multiline: true,
  },
  { key: "greeting", label: "Saludo", max: 500, multiline: true },
  { key: "farewell", label: "Despedida", max: 500, multiline: true },
  {
    key: "restrictions",
    label: "Lo que nunca debe hacer",
    max: 4000,
    multiline: true,
  },
];

export function PersonalityTab({
  settings,
  configured,
  actions,
}: {
  settings: PromptSettings;
  configured: boolean;
  actions: ConduitActions;
}) {
  const [draft, setDraft] = useState<PromptSettings>(settings);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<unknown>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const set = <K extends keyof PromptSettings>(
    key: K,
    value: PromptSettings[K],
  ) => setDraft({ ...draft, [key]: value });

  const temperature = Number(draft.temperature ?? 0.7);
  const maxTokens = Number(draft.maxTokensConversation ?? 400);
  const valid =
    temperature >= 0 &&
    temperature <= 1.5 &&
    maxTokens >= 50 &&
    maxTokens <= 1500;

  const loadPreview = async () => {
    setIsPreviewing(true);
    setPreviewError(null);
    try {
      const result = await conduitApi.previewPrompt("CONVERSATION");
      setPreview(
        typeof result === "string"
          ? result
          : ((result as { content?: string; prompt?: string })?.content ??
              (result as { prompt?: string })?.prompt ??
              JSON.stringify(result, null, 2)),
      );
    } catch (error) {
      setPreviewError(error);
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <SectionCard
        title="Personalidad"
        description={
          configured
            ? "Cómo se presenta y habla el asistente."
            : "Aún no está configurada: el asistente usa valores genéricos."
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <div
              key={field.key}
              className={field.multiline ? "md:col-span-2" : undefined}
            >
              <Field
                label={field.label}
                htmlFor={`p-${field.key}`}
                hint={`${(draft[field.key] ?? "").length}/${field.max}${field.hint ? ` · ${field.hint}` : ""}`}
              >
                {field.multiline ? (
                  <TextArea
                    id={`p-${field.key}`}
                    value={draft[field.key] ?? ""}
                    maxLength={field.max}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    id={`p-${field.key}`}
                    value={draft[field.key] ?? ""}
                    maxLength={field.max}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={INPUT_CLASS}
                  />
                )}
              </Field>
            </div>
          ))}
          <Field label="Largo de respuestas">
            <ChoicePills
              ariaLabel="Largo de respuestas"
              value={draft.responseLength ?? "MEDIUM"}
              onChange={(v) => set("responseLength", v)}
              options={[
                { value: "SHORT", label: "Cortas" },
                { value: "MEDIUM", label: "Medias" },
                { value: "LONG", label: "Largas" },
              ]}
            />
          </Field>
          <Field label="Emojis">
            <ChoicePills
              ariaLabel="Uso de emojis"
              value={draft.emojiLevel ?? "LOW"}
              onChange={(v) => set("emojiLevel", v)}
              options={[
                { value: "NONE", label: "No" },
                { value: "LOW", label: "Pocos" },
                { value: "MEDIUM", label: "Algunos" },
                { value: "HIGH", label: "Muchos" },
              ]}
            />
          </Field>
          <Field
            label="Creatividad (0 a 1,5)"
            htmlFor="p-temp"
            hint="Más bajo = respuestas más predecibles. Recomendado 0,7."
          >
            <input
              id="p-temp"
              type="number"
              step="0.1"
              min={0}
              max={1.5}
              value={draft.temperature ?? 0.7}
              onChange={(e) => set("temperature", Number(e.target.value))}
              className={`${INPUT_CLASS} tabular-nums`}
            />
          </Field>
          <Field
            label="Largo máximo (tokens)"
            htmlFor="p-tokens"
            hint="Entre 50 y 1500."
          >
            <input
              id="p-tokens"
              type="number"
              min={50}
              max={1500}
              value={draft.maxTokensConversation ?? 400}
              onChange={(e) =>
                set("maxTokensConversation", Number(e.target.value))
              }
              className={`${INPUT_CLASS} tabular-nums`}
            />
          </Field>
          <div className="md:col-span-2">
            <CheckboxField
              id="p-md"
              checked={Boolean(draft.allowMarkdown)}
              onChange={(v) => set("allowMarkdown", v)}
              label="Permitir *negrita* y _cursiva_"
              description="Formato de WhatsApp en las respuestas."
            />
          </div>
        </div>
        <button
          type="button"
          className={`${PRIMARY_BUTTON} w-fit`}
          disabled={!valid || actions.busy.has("personality")}
          onClick={() => {
            const payload = Object.fromEntries(
              Object.entries(draft).filter(([key]) =>
                [
                  ...TEXT_FIELDS.map((f) => f.key),
                  "responseLength",
                  "emojiLevel",
                  "allowMarkdown",
                  "temperature",
                  "maxTokensConversation",
                ].includes(key),
              ),
            ) as PromptSettings;
            void actions.updatePromptSettings(payload);
          }}
        >
          Guardar personalidad
        </button>
      </SectionCard>

      <SectionCard
        title="Así queda el prompt"
        description="Vista de solo lectura de las instrucciones que recibe el asistente."
        aside={
          <button
            type="button"
            className={`${SECONDARY_BUTTON} h-10`}
            disabled={isPreviewing}
            onClick={() => void loadPreview()}
          >
            <Eye className="size-4" />
            {isPreviewing ? "Generando…" : "Ver vista previa"}
          </button>
        }
      >
        {Boolean(previewError) && <ErrorPanel error={previewError} compact />}
        {preview ? (
          <pre className="max-h-[32rem] overflow-auto rounded-2xl border border-secondary/10 bg-white p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-secondary">
            {preview}
          </pre>
        ) : (
          <p className="font-sans text-sm text-secondary/70">
            Guarda los cambios y pide la vista previa para revisar el resultado.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
