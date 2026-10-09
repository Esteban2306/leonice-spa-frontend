import {
  CheckboxField,
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";

import { formatPesosInput } from "../lib/catalog";
import type {
  TreatmentDraft,
  TreatmentDraftErrors,
} from "../lib/treatment-draft";

interface TreatmentFieldsProps {
  idPrefix: string;
  draft: TreatmentDraft;
  errors: TreatmentDraftErrors;
  categories: readonly AdminCategory[];
  onChange: (draft: TreatmentDraft) => void;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="font-sans text-xs text-red-700">
      {message}
    </p>
  );
}

export function TreatmentFields({
  idPrefix,
  draft,
  errors,
  categories,
  onChange,
}: TreatmentFieldsProps) {
  const set = <K extends keyof TreatmentDraft>(
    key: K,
    value: TreatmentDraft[K],
  ) => onChange({ ...draft, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Nombre" htmlFor={`${idPrefix}-name`}>
        <input
          id={`${idPrefix}-name`}
          value={draft.name}
          maxLength={120}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={`${idPrefix}-name-error`}
          onChange={(event) => set("name", event.target.value)}
          className={INPUT_CLASS}
        />
        <FieldError id={`${idPrefix}-name-error`} message={errors.name} />
      </Field>

      <Field label="Categoría" htmlFor={`${idPrefix}-category`}>
        <select
          id={`${idPrefix}-category`}
          value={draft.categoryId}
          aria-invalid={Boolean(errors.categoryId)}
          onChange={(event) => set("categoryId", event.target.value)}
          className={`${INPUT_CLASS} cursor-pointer`}
        >
          <option value="" disabled>
            Elige una categoría
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {category.isActive ? "" : " (inactiva)"}
            </option>
          ))}
        </select>
        <FieldError
          id={`${idPrefix}-category-error`}
          message={errors.categoryId}
        />
      </Field>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
          Precio en pesos
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Precio desde"
            inputMode="numeric"
            placeholder="Desde · 35.000"
            value={draft.priceMinPesos}
            onChange={(event) =>
              set("priceMinPesos", formatPesosInput(event.target.value))
            }
            className={`${INPUT_CLASS} tabular-nums`}
          />
          <input
            aria-label="Precio hasta"
            inputMode="numeric"
            placeholder="Hasta (opcional)"
            value={draft.priceMaxPesos}
            onChange={(event) =>
              set("priceMaxPesos", formatPesosInput(event.target.value))
            }
            className={`${INPUT_CLASS} tabular-nums`}
          />
        </div>
        <p className="font-sans text-xs text-secondary/70">
          Deja &quot;hasta&quot; vacío si el precio es fijo. Se cobra el
          &quot;desde&quot;; con valoración previa, el &quot;hasta&quot;.
        </p>
        <FieldError id={`${idPrefix}-price-error`} message={errors.price} />
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
          Duración en minutos
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Duración mínima en minutos"
            inputMode="numeric"
            placeholder="Mínima · 90"
            value={draft.durationMin}
            onChange={(event) => set("durationMin", event.target.value)}
            className={`${INPUT_CLASS} tabular-nums`}
          />
          <input
            aria-label="Duración máxima en minutos"
            inputMode="numeric"
            placeholder="Máxima (opcional)"
            value={draft.durationMax}
            onChange={(event) => set("durationMax", event.target.value)}
            className={`${INPUT_CLASS} tabular-nums`}
          />
        </div>
        <p className="font-sans text-xs text-secondary/70">
          La disponibilidad se calcula con la máxima; la cita usa la mínima
          salvo con valoración previa.
        </p>
        <FieldError
          id={`${idPrefix}-duration-error`}
          message={errors.duration}
        />
      </fieldset>

      <CheckboxField
        id={`${idPrefix}-assessment`}
        checked={draft.requiresPriorAssessment}
        onChange={(checked) => set("requiresPriorAssessment", checked)}
        label="Requiere valoración previa"
        description="La clienta debe pasar por valoración antes de reservarlo."
      />
      <CheckboxField
        id={`${idPrefix}-hair`}
        checked={draft.hasHairVariablePricing}
        onChange={(checked) => set("hasHairVariablePricing", checked)}
        label="Precio según largo y color de cabello"
        description="Activa la tabla de precios por largo y los recargos por color."
      />
    </div>
  );
}
