"use client";

import { useState } from "react";

import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminProduct,
  ProductContent,
} from "@/src/features/admin/types/products.types";

import { linesToList, listToLines } from "../lib/ritual-catalog";

interface ContentDraft {
  tagline: string;
  purpose: string;
  benefits: string;
  howToUse: string;
  idealFor: string;
  usageFrequency: string;
  precautions: string;
}

function toDraft(product: AdminProduct): ContentDraft {
  return {
    tagline: product.tagline ?? "",
    purpose: product.purpose ?? "",
    benefits: listToLines(product.benefits),
    howToUse: listToLines(product.howToUse),
    idealFor: listToLines(product.idealFor),
    usageFrequency: product.usageFrequency ?? "",
    precautions: listToLines(product.precautions),
  };
}

function toContent(draft: ContentDraft): ProductContent {
  return {
    tagline: draft.tagline.trim() || null,
    purpose: draft.purpose.trim() || null,
    benefits: linesToList(draft.benefits),
    howToUse: linesToList(draft.howToUse),
    idealFor: linesToList(draft.idealFor),
    usageFrequency: draft.usageFrequency.trim() || null,
    precautions: linesToList(draft.precautions),
  };
}

const LIST_HINT = "Uno por renglón (máximo 12).";

const LIST_FIELDS: ReadonlyArray<{
  key: "benefits" | "howToUse" | "idealFor" | "precautions";
  label: string;
  ritualHint?: string;
}> = [
  { key: "benefits", label: "Beneficios" },
  {
    key: "howToUse",
    label: "Modo de uso",
    ritualHint: "En orden: qué producto va primero y cuánto tiempo.",
  },
  { key: "idealFor", label: "Ideal para" },
  { key: "precautions", label: "Precauciones" },
];

export function ProductContentEditor({
  product,
  isSaving,
  onSave,
}: {
  product: AdminProduct;
  isSaving: boolean;
  onSave: (content: ProductContent) => Promise<boolean>;
}) {
  const original = toDraft(product);
  const [draft, setDraft] = useState(original);
  const dirty = (Object.keys(original) as (keyof ContentDraft)[]).some(
    (key) => draft[key] !== original[key],
  );
  const id = (key: string) => `product-${product.id}-${key}`;
  const isRitual = product.kind === "COMBO";

  return (
    <div className="flex flex-col gap-4">
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
      <Field label="Para qué sirve" htmlFor={id("purpose")}>
        <TextArea
          id={id("purpose")}
          value={draft.purpose}
          maxLength={600}
          rows={2}
          onChange={(event) =>
            setDraft({ ...draft, purpose: event.target.value })
          }
        />
      </Field>
      {LIST_FIELDS.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          htmlFor={id(field.key)}
          hint={
            isRitual && field.ritualHint
              ? `${field.ritualHint} ${LIST_HINT}`
              : LIST_HINT
          }
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
      <Field label="Frecuencia de uso" htmlFor={id("frequency")}>
        <input
          id={id("frequency")}
          value={draft.usageFrequency}
          maxLength={160}
          placeholder="2 a 3 veces por semana"
          onChange={(event) =>
            setDraft({ ...draft, usageFrequency: event.target.value })
          }
          className={INPUT_CLASS}
        />
      </Field>
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
            disabled={isSaving}
            onClick={() => void onSave(toContent(draft))}
            className="h-10 cursor-pointer rounded-full bg-secondary px-5 font-sans text-sm text-primary hover:bg-secondary/90 disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Guardar contenido"}
          </button>
        </div>
      )}
    </div>
  );
}
