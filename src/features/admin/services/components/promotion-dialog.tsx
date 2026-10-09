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

interface PromotionDialogProps {
  open: boolean;
  target: PromotionTargetOptions | null;
  promotion: Promotion | null;
  todayKey: string;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreatePromotionRequest) => Promise<boolean>;
}

type Scope = "TREATMENT" | "CATEGORY";

export function PromotionDialog({
  open,
  target,
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
      : target?.treatment
        ? "TREATMENT"
        : "CATEGORY",
  );

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
        const useTreatment = scope === "TREATMENT" && target.treatment;
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
      {target?.treatment && (
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
          placeholder="Ej. Octubre de uñas"
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
