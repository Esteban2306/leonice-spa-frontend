"use client";

import { useState } from "react";

import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminTreatment,
  TreatmentContent,
} from "@/src/features/admin/types/treatments.types";

import {
  CONTENT_LIST_MAX_ITEMS,
  contentDraftFrom,
  contentFromDraft,
  contentListTooLong,
  type TreatmentContentDraft,
} from "../lib/treatment-content";

const LIST_HINT = `Uno por renglón (máximo ${CONTENT_LIST_MAX_ITEMS}).`;

const TEXT_FIELDS: ReadonlyArray<{
  key: "summary" | "results";
  label: string;
  hint: string;
  placeholder?: string;
}> = [
  {
    key: "summary",
    label: "Qué es",
    hint: "Una o dos frases sobre el servicio.",
  },
  {
    key: "results",
    label: "Resultado y cuánto dura",
    hint: "El asistente lo usa cuando preguntan cuánto dura el efecto.",
    placeholder: "Queda 90 % liso y dura de 5 a 6 meses con los cuidados.",
  },
];

const LIST_FIELDS: ReadonlyArray<{
  key: "idealFor" | "benefits" | "aftercare" | "considerations";
  label: string;
}> = [
  { key: "idealFor", label: "Ideal para" },
  { key: "benefits", label: "Beneficios" },
  { key: "aftercare", label: "Cuidados después" },
  { key: "considerations", label: "Ten en cuenta" },
];

export function TreatmentContentEditor({
  treatment,
  isSaving,
  onSave,
}: {
  treatment: AdminTreatment;
  isSaving: boolean;
  onSave: (content: TreatmentContent) => Promise<boolean>;
}) {
  const original = contentDraftFrom(treatment);
  const [draft, setDraft] = useState(original);
  const dirty = (Object.keys(original) as (keyof TreatmentContentDraft)[]).some(
    (key) => draft[key] !== original[key],
  );
  const tooLong = contentListTooLong(draft);
  const id = (key: string) => `treatment-${treatment.id}-${key}`;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm text-secondary/65">
        Lo ven las clientas en la web y el asistente lo usa para responder
        preguntas del servicio.
      </p>
      <Field
        label="Subtítulo"
        htmlFor={id("tagline")}
        hint="Una línea con el beneficio principal."
      >
        <input
          id={id("tagline")}
          value={draft.tagline}
          maxLength={160}
          onChange={(event) =>
            setDraft({ ...draft, tagline: event.target.value })
          }
          className={INPUT_CLASS}
        />
      </Field>
      {TEXT_FIELDS.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          htmlFor={id(field.key)}
          hint={field.hint}
        >
          <TextArea
            id={id(field.key)}
            value={draft[field.key]}
            maxLength={600}
            rows={2}
            placeholder={field.placeholder}
            onChange={(event) =>
              setDraft({ ...draft, [field.key]: event.target.value })
            }
          />
        </Field>
      ))}
      {LIST_FIELDS.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          htmlFor={id(field.key)}
          hint={LIST_HINT}
        >
          <TextArea
            id={id(field.key)}
            value={draft[field.key]}
            rows={3}
            onChange={(event) =>
              setDraft({ ...draft, [field.key]: event.target.value })
            }
          />
        </Field>
      ))}
      <Field label="Cada cuánto repetirlo" htmlFor={id("frequency")}>
        <input
          id={id("frequency")}
          value={draft.recommendedFrequency}
          maxLength={300}
          placeholder="Cada 5 a 6 meses"
          onChange={(event) =>
            setDraft({ ...draft, recommendedFrequency: event.target.value })
          }
          className={INPUT_CLASS}
        />
      </Field>
      {tooLong && (
        <p role="alert" className="font-sans text-sm text-red-700">
          Cada lista puede tener máximo {CONTENT_LIST_MAX_ITEMS} renglones.
        </p>
      )}
      {dirty && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDraft(original)}
            className="h-10 cursor-pointer rounded-full px-4 font-sans text-sm text-secondary/70 hover:bg-secondary/5"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={isSaving || tooLong}
            onClick={() => void onSave(contentFromDraft(draft))}
            className="h-10 cursor-pointer rounded-full bg-secondary px-5 font-sans text-sm text-primary hover:bg-secondary/90 disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Guardar ficha"}
          </button>
        </div>
      )}
    </div>
  );
}
