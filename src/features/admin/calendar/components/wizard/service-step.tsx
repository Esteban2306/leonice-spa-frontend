"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { BrandLoader } from "@/src/components/brand/brand-loader";
import type { Category } from "@/src/features/admin/types/categories.types";
import type { Treatment } from "@/src/features/admin/types/treatments.types";

import { priceRangeLabel, treatmentDuration } from "../../lib/booking";
import { ErrorBox, OptionButton, SECONDARY_BUTTON } from "./wizard-parts";

interface ServiceStepProps {
  categories: readonly Category[];
  treatments: readonly Treatment[];
  selection: Readonly<Record<string, string>>;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelect: (
    categoryId: string,
    treatmentId: string,
    keepOthers: boolean,
  ) => void;
  onRemove: (categoryId: string) => void;
}

export function ServiceStep({
  categories,
  treatments,
  selection,
  isLoading,
  isError,
  onRetry,
  onSelect,
  onRemove,
}: ServiceStepProps) {
  const selectedIds = Object.values(selection);
  const [categoryId, setCategoryId] = useState<string | null>(
    Object.keys(selection)[0] ?? null,
  );
  const [isAdding, setIsAdding] = useState(selectedIds.length > 1);

  if (isError) {
    return (
      <ErrorBox
        message="No pudimos cargar los servicios."
        actionLabel="Intentar otra vez"
        onAction={onRetry}
      />
    );
  }
  if (isLoading) {
    return <BrandLoader variant="compact" label="Cargando servicios…" />;
  }

  const currentId = categoryId ?? categories[0]?.id ?? null;
  const visible = treatments.filter(
    (treatment) => treatment.isActive && treatment.categoryId === currentId,
  );
  const canAddAnother =
    !isAdding && selectedIds.length > 0 && categories.length > 1;

  return (
    <>
      {selectedIds.length > 1 && (
        <ul className="flex flex-col gap-2" aria-label="Servicios elegidos">
          {Object.entries(selection).map(([selectedCategory, treatmentId]) => {
            const name = treatments.find((t) => t.id === treatmentId)?.name;
            return (
              <li
                key={selectedCategory}
                className="flex items-center justify-between gap-2 rounded-2xl bg-quaternary/40 py-1 pl-4 pr-1 font-sans text-base text-secondary"
              >
                {name}
                <button
                  type="button"
                  onClick={() => onRemove(selectedCategory)}
                  aria-label={`Quitar ${name ?? "servicio"}`}
                  className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-secondary/10"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div role="group" aria-label="Categoría" className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={category.id === currentId}
            onClick={() => setCategoryId(category.id)}
            className={`min-h-11 cursor-pointer rounded-full border px-4 font-sans text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
              category.id === currentId
                ? "border-secondary bg-secondary text-primary"
                : "border-secondary/25 bg-white text-secondary hover:bg-quaternary/25"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {visible.length === 0 && (
          <p className="font-sans text-base text-secondary/80">
            Esta categoría no tiene servicios activos.
          </p>
        )}
        {visible.map((treatment) => {
          const price = priceRangeLabel(treatment);
          return (
            <OptionButton
              key={treatment.id}
              title={treatment.name}
              detail={`${treatmentDuration(treatment)} min${price ? ` · ${price}` : ""}`}
              selected={selection[treatment.categoryId] === treatment.id}
              onClick={() =>
                selection[treatment.categoryId] === treatment.id
                  ? onRemove(treatment.categoryId)
                  : onSelect(treatment.categoryId, treatment.id, isAdding)
              }
            />
          );
        })}
      </div>

      {canAddAnother && (
        <button
          type="button"
          onClick={() => {
            setIsAdding(true);
            setCategoryId(
              categories.find((category) => !selection[category.id])?.id ??
                currentId,
            );
          }}
          className={SECONDARY_BUTTON}
        >
          Agregar otro servicio a la misma hora
        </button>
      )}
      {isAdding && (
        <p className="font-sans text-sm text-secondary/80">
          Se hacen al mismo tiempo, uno por categoría.
        </p>
      )}
    </>
  );
}
