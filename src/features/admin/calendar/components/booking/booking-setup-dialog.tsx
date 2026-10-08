"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import { formatCopFromThousands } from "@/src/lib/money/cop";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  ChoicePills,
  Field,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { Category } from "@/src/features/admin/types/categories.types";
import type { Treatment } from "@/src/features/admin/types/treatments.types";

import {
  describeServices,
  toBookingService,
  totalDuration,
  treatmentDuration,
} from "../../lib/booking";
import type { BookingClient, BookingService } from "../../types/calendar.types";

type BookingKind = "single" | "combo";

interface BookingSetupDialogProps {
  categories: readonly Category[];
  treatments: readonly Treatment[];
  isLoadingCatalog: boolean;
  client: BookingClient | null;
  onClose: () => void;
  onConfirm: (services: BookingService[]) => void;
}

const KIND_OPTIONS: ReadonlyArray<{ value: BookingKind; label: string }> = [
  { value: "single", label: "Un servicio" },
  { value: "combo", label: "Combo (varios)" },
];

function omitKey(
  record: Record<string, string>,
  key: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).filter(([entryKey]) => entryKey !== key),
  );
}

function priceRange(treatment: Treatment): string | null {
  const min = treatment.basePriceMin;
  const max = treatment.basePriceMax;
  if (!min && !max) return null;
  if (min && max && min !== max) {
    return `${formatCopFromThousands(min)} – ${formatCopFromThousands(max)}`;
  }
  return formatCopFromThousands((max ?? min)!);
}

export function BookingSetupDialog({
  categories,
  treatments,
  isLoadingCatalog,
  client,
  onClose,
  onConfirm,
}: BookingSetupDialogProps) {
  const [kind, setKind] = useState<BookingKind>("single");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const [selection, setSelection] = useState<Record<string, string>>({});

  const categoryName = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const currentCategoryId = activeCategoryId ?? categories[0]?.id ?? null;
  const visibleTreatments = treatments.filter(
    (treatment) =>
      treatment.isActive && treatment.categoryId === currentCategoryId,
  );

  const selectedServices = Object.values(selection)
    .map((treatmentId) => treatments.find((t) => t.id === treatmentId))
    .filter((treatment): treatment is Treatment => Boolean(treatment))
    .map((treatment) =>
      toBookingService(treatment, categoryName.get(treatment.categoryId) ?? ""),
    );

  const canSubmit =
    kind === "single"
      ? selectedServices.length === 1
      : selectedServices.length >= 2;

  const toggleTreatment = (treatment: Treatment) => {
    setSelection((current) => {
      if (kind === "single") return { [treatment.categoryId]: treatment.id };
      if (current[treatment.categoryId] === treatment.id) {
        return omitKey(current, treatment.categoryId);
      }
      return { ...current, [treatment.categoryId]: treatment.id };
    });
  };

  const changeKind = (next: BookingKind) => {
    setKind(next);
    if (next === "single") {
      const [first] = Object.entries(selection);
      setSelection(first ? { [first[0]]: first[1] } : {});
    }
  };

  return (
    <ActionDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Nueva reserva"
      description={
        client
          ? `Para ${client.name}. Elige qué se va a agendar y luego el día en el calendario.`
          : "Elige qué se va a agendar. Luego el calendario te mostrará solo los días disponibles."
      }
      submitLabel="Elegir día en el calendario"
      submittingLabel="Abriendo…"
      canSubmit={canSubmit}
      onSubmit={async () => {
        onConfirm(selectedServices);
        return true;
      }}
    >
      <Field label="Tipo de reserva">
        <ChoicePills
          ariaLabel="Tipo de reserva"
          value={kind}
          options={KIND_OPTIONS}
          onChange={changeKind}
        />
      </Field>

      <Field label="Categoría">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const isActive = category.id === currentCategoryId;
            const hasPick = Boolean(selection[category.id]);
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategoryId(category.id)}
                className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 font-sans text-xs transition-colors ${
                  isActive
                    ? "border-secondary bg-secondary text-primary"
                    : "border-secondary/15 bg-white text-secondary hover:bg-quaternary/25"
                }`}
              >
                {hasPick && <Check className="size-3" strokeWidth={2.4} />}
                {category.name}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label={kind === "combo" ? "Servicio de esta categoría" : "Servicio"}
        hint={
          kind === "combo"
            ? "En un combo se agenda un servicio por categoría, uno detrás de otro el mismo día."
            : undefined
        }
      >
        <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
          {isLoadingCatalog && (
            <p className="font-sans text-xs text-secondary/55">
              Cargando servicios…
            </p>
          )}
          {!isLoadingCatalog && visibleTreatments.length === 0 && (
            <p className="font-sans text-xs text-secondary/55">
              Esta categoría no tiene servicios activos.
            </p>
          )}
          {visibleTreatments.map((treatment) => {
            const isSelected = selection[treatment.categoryId] === treatment.id;
            const price = priceRange(treatment);
            return (
              <button
                key={treatment.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleTreatment(treatment)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "border-secondary bg-secondary/5"
                    : "border-secondary/10 bg-white hover:bg-quaternary/20"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-sans text-sm text-secondary">
                    {treatment.name}
                  </span>
                  <span className="block font-sans text-xs text-secondary/55">
                    {treatmentDuration(treatment)} min
                    {price ? ` · ${price}` : ""}
                  </span>
                </span>
                {isSelected && (
                  <Check
                    className="size-4 shrink-0 text-secondary"
                    strokeWidth={2.2}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Field>

      {selectedServices.length > 0 && (
        <div className="rounded-2xl border border-tertiary/30 bg-white/70 p-3">
          <p className="font-sans text-xs uppercase tracking-[0.16em] text-secondary/55">
            {kind === "combo" ? "Combo" : "Seleccionado"} ·{" "}
            {totalDuration(selectedServices)} min
          </p>
          <p className="mt-1 font-sans text-sm text-secondary">
            {describeServices(selectedServices)}
          </p>
          {kind === "combo" && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.entries(selection).map(([categoryId, treatmentId]) => (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() =>
                    setSelection((current) => omitKey(current, categoryId))
                  }
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-quaternary/40 px-2.5 py-1 font-sans text-[11px] text-secondary"
                >
                  {treatments.find((t) => t.id === treatmentId)?.name}
                  <X className="size-3" />
                </button>
              ))}
            </div>
          )}
          {kind === "combo" && selectedServices.length < 2 && (
            <p className="mt-2 font-sans text-xs text-secondary/60">
              Agrega un servicio de otra categoría para formar el combo.
            </p>
          )}
        </div>
      )}
    </ActionDialog>
  );
}
