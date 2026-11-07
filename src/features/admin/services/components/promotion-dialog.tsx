"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  ChoicePills,
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  CreatePromotionRequest,
  Promotion,
} from "@/src/features/admin/types/promotions.types";

import {
  endOfBogotaDay,
  startOfBogotaDay,
  toBogotaDateKey,
} from "../lib/catalog";

export interface PromotionTargetOptions {
  treatment: { id: string; name: string } | null;
  category: { id: string; name: string };
}

export interface PromotionTargetChoices {
  categories: ReadonlyArray<{ id: string; name: string }>;
  treatments: ReadonlyArray<{ id: string; name: string; categoryId: string }>;
}

interface PromotionDialogProps {
  open: boolean;
  target: PromotionTargetOptions | null;
  choices?: PromotionTargetChoices;
  promotion: Promotion | null;
  todayKey: string;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreatePromotionRequest) => Promise<boolean>;
}

type Scope = "TREATMENT" | "CATEGORY";

export function PromotionDialog({
  open,
  target: fixedTarget,
  choices,
  promotion,
  todayKey,
  onOpenChange,
  onSave,
}: PromotionDialogProps) {
  const [name, setName] = useState(promotion?.name ?? "");
  const [discount, setDiscount] = useState(
    promotion ? String(Number(promotion.discountPercentage)) : "",
  );
  const [from, setFrom] = useState(
    promotion ? toBogotaDateKey(promotion.startsAt) : todayKey,
  );
  const [to, setTo] = useState(
    promotion ? toBogotaDateKey(promotion.endsAt) : "",
  );
  const [scope, setScope] = useState<Scope>(
    promotion
      ? promotion.treatmentId
        ? "TREATMENT"
        : "CATEGORY"
      : fixedTarget?.treatment
        ? "TREATMENT"
        : "CATEGORY",
  );

  const [pickedCategoryId, setPickedCategoryId] = useState("");
  const [pickedTreatmentId, setPickedTreatmentId] = useState("");
  const picksTarget = fixedTarget === null && choices !== undefined;
  const pickedCategory = choices?.categories.find(
    (item) => item.id === pickedCategoryId,
  );
  const pickedTreatment = choices?.treatments.find(
    (item) => item.id === pickedTreatmentId,
  );
  const target: PromotionTargetOptions | null = picksTarget
    ? pickedCategory
      ? {
          category: pickedCategory,
          treatment: pickedTreatment
            ? { id: pickedTreatment.id, name: pickedTreatment.name }
            : null,
        }
      : null
    : fixedTarget;
  const categoryTreatments =
    choices?.treatments.filter(
      (item) => item.categoryId === pickedCategoryId,
    ) ?? [];

  const percentage = Number(discount.replace(",", "."));
  const isValidDiscount = percentage > 0 && percentage <= 100;
  const isValidRange = from !== "" && to !== "" && from <= to;
  const canSubmit =
    target !== null &&
    name.trim().length >= 2 &&
    isValidDiscount &&
    isValidRange;

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={promotion ? "Editar promoción" : "Nueva promoción"}
      description="El descuento se aplica al precio publicado mientras la promoción esté vigente."
      submitLabel={promotion ? "Guardar promoción" : "Crear promoción"}
      submittingLabel="Guardando…"
      canSubmit={canSubmit}
      onSubmit={() => {
        if (!target) return Promise.resolve(false);
        const useTreatment =
          (picksTarget || scope === "TREATMENT") && target.treatment;
        return onSave({
          name: name.trim(),
          discountPercentage: percentage,
          startsAt: startOfBogotaDay(from),
          endsAt: endOfBogotaDay(to),
          ...(useTreatment
            ? { treatmentId: target.treatment?.id }
            : { categoryId: target.category.id }),
        });
      }}
    >
      {picksTarget && (
        <>
          <Field label="Categoría" htmlFor="promotion-category">
            <select
              id="promotion-category"
              value={pickedCategoryId}
              onChange={(event) => {
                setPickedCategoryId(event.target.value);
                setPickedTreatmentId("");
              }}
              className={INPUT_CLASS}
            >
              <option value="">Elige una categoría</option>
              {choices?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Aplica a" htmlFor="promotion-treatment">
            <select
              id="promotion-treatment"
              value={pickedTreatmentId}
              disabled={pickedCategoryId === ""}
              onChange={(event) => setPickedTreatmentId(event.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">
                {pickedCategory
                  ? `Toda ${pickedCategory.name}`
                  : "Primero elige la categoría"}
              </option>
              {categoryTreatments.map((treatment) => (
                <option key={treatment.id} value={treatment.id}>
                  {treatment.name}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}
      {!picksTarget && target?.treatment && (
        <Field label="Aplica a">
          <ChoicePills<Scope>
            ariaLabel="Alcance de la promoción"
            value={scope}
            onChange={setScope}
            options={[
              { value: "TREATMENT", label: target.treatment.name },
              { value: "CATEGORY", label: `Toda ${target.category.name}` },
            ]}
          />
        </Field>
      )}
      <Field label="Nombre" htmlFor="promotion-name">
        <input
          id="promotion-name"
          value={name}
          maxLength={80}
          placeholder="Ej. Mes del cabello"
          onChange={(event) => setName(event.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Descuento (%)" htmlFor="promotion-discount">
        <input
          id="promotion-discount"
          inputMode="decimal"
          value={discount}
          placeholder="15"
          onChange={(event) => setDiscount(event.target.value)}
          className={`${INPUT_CLASS} tabular-nums`}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desde" htmlFor="promotion-from">
          <input
            id="promotion-from"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Hasta" htmlFor="promotion-to">
          <input
            id="promotion-to"
            type="date"
            value={to}
            min={from}
            onChange={(event) => setTo(event.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
      {from !== "" && to !== "" && !isValidRange && (
        <p role="alert" className="font-sans text-xs text-red-700">
          La fecha final debe ser igual o posterior a la inicial.
        </p>
      )}
    </ActionDialog>
  );
}
