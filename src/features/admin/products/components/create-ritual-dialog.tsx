"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminProduct,
  CreateRitualRequest,
} from "@/src/features/admin/types/products.types";

import { formatPesosInput, parsePesos } from "../lib/product-catalog";
import {
  validateRitualDraft,
  type RitualDraftErrors,
  type RitualDraftItem,
  type RitualVariantOption,
} from "../lib/ritual-catalog";
import { RitualItemsEditor } from "./ritual-items-editor";

interface CreateRitualDialogProps {
  open: boolean;
  options: readonly RitualVariantOption[];
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateRitualRequest) => Promise<AdminProduct | null>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="font-sans text-xs text-red-700">
      {message}
    </p>
  );
}

export function CreateRitualDialog({
  open,
  options,
  onOpenChange,
  onCreate,
}: CreateRitualDialogProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState<RitualDraftItem[]>([]);
  const [errors, setErrors] = useState<RitualDraftErrors>({});

  const submit = async () => {
    const result = validateRitualDraft({ name, price, items });
    setErrors(result.errors);
    if (!result.data) return false;
    const created = await onCreate({
      ...result.data,
      tagline: tagline.trim() || null,
    });
    return created !== null;
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo Ritual"
      description="Un combo de productos con precio especial. Se guarda en la categoría Combos; la foto, los beneficios y el modo de uso se completan en su detalle."
      submitLabel="Crear Ritual"
      submittingLabel="Creando…"
      contentClassName="sm:max-w-2xl"
      canSubmit={name.trim().length >= 2 && items.length >= 2 && price !== ""}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <Field label="Nombre" htmlFor="new-ritual-name">
          <input
            id="new-ritual-name"
            value={name}
            maxLength={120}
            autoFocus
            placeholder="Ritual Hair Therapy Amazônica"
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => setName(event.target.value)}
            className={INPUT_CLASS}
          />
          <FieldError message={errors.name} />
        </Field>
        <Field label="Precio del Ritual" htmlFor="new-ritual-price">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-sans text-sm text-secondary/70"
            >
              $
            </span>
            <input
              id="new-ritual-price"
              inputMode="numeric"
              placeholder="215.000"
              value={price}
              aria-invalid={Boolean(errors.price)}
              onChange={(event) => setPrice(event.target.value)}
              onBlur={() => {
                const pesos = parsePesos(price);
                if (pesos !== null) setPrice(formatPesosInput(pesos));
              }}
              className={`${INPUT_CLASS} pl-7 text-right tabular-nums`}
            />
          </div>
          <FieldError message={errors.price} />
        </Field>
      </div>
      <Field
        label="Subtítulo"
        htmlFor="new-ritual-tagline"
        hint="Una línea con el beneficio principal, se muestra bajo el nombre."
      >
        <input
          id="new-ritual-tagline"
          value={tagline}
          maxLength={160}
          placeholder="Anticaída y control de grasa para tu rutina en casa"
          onChange={(event) => setTagline(event.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-sans text-sm font-semibold text-secondary">
          Qué incluye
        </legend>
        <RitualItemsEditor
          items={items}
          options={options}
          pricePesos={parsePesos(price)}
          error={errors.items}
          onChange={setItems}
        />
      </fieldset>
    </ActionDialog>
  );
}
