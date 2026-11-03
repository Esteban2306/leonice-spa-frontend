import { Plus } from "lucide-react";

import { PromotionsSection } from "@/src/features/admin/services/components/promotions-section";
import type { Promotion } from "@/src/features/admin/types/promotions.types";

import {
  PROMOTION_FILTERS,
  type PromotionFilter,
} from "../lib/promotions-page";

interface PromotionsViewProps {
  promotions: readonly Promotion[];
  counts: Record<PromotionFilter, number>;
  filter: PromotionFilter;
  isLoading: boolean;
  isError: boolean;
  nowMs: number;
  onFilterChange: (filter: PromotionFilter) => void;
  onCreate: () => void;
  onEdit: (promotion: Promotion) => void;
  onDeactivate: (promotion: Promotion) => void;
  onRetry: () => void;
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[1.25rem] border border-tertiary/30 bg-[#FCF6EB] px-4 py-3">
      <p className="font-sans text-3xl font-bold text-secondary tabular-nums">
        {value}
      </p>
      <p className="font-sans text-xs text-secondary/75">{label}</p>
    </div>
  );
}

export function PromotionsView(props: PromotionsViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">Promociones</h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
              Descuentos por servicio o por categoría. El asistente de WhatsApp
              y las reservas nuevas aplican la promoción vigente al instante; la
              web puede tardar unos minutos en mostrarla.
            </p>
          </div>
          <button
            type="button"
            onClick={props.onCreate}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
          >
            <Plus className="size-4" strokeWidth={2} />
            Nueva promoción
          </button>
        </header>

        {!props.isLoading && !props.isError && (
          <div className="grid grid-cols-3 gap-3">
            <Stat value={props.counts.CURRENT} label="Vigentes" />
            <Stat value={props.counts.UPCOMING} label="Programadas" />
            <Stat value={props.counts.EXPIRED} label="Vencidas" />
          </div>
        )}

        <div
          role="tablist"
          aria-label="Estado de la promoción"
          className="flex flex-wrap gap-2"
        >
          {PROMOTION_FILTERS.map((option) => {
            const selected = props.filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => props.onFilterChange(option.value)}
                className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                  selected
                    ? "border-secondary bg-secondary text-primary"
                    : "border-tertiary/40 text-secondary hover:bg-quaternary/25"
                }`}
              >
                {option.label}
                <span className="tabular-nums opacity-70">
                  {props.counts[option.value]}
                </span>
              </button>
            );
          })}
        </div>

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudieron cargar las promociones.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        <PromotionsSection
          promotions={props.promotions}
          isLoading={props.isLoading}
          nowMs={props.nowMs}
          showCreate={false}
          emptyLabel={
            props.filter === "ALL"
              ? "Aún no hay promociones. Crea la primera con “Nueva promoción”."
              : "No hay promociones en este estado."
          }
          onCreate={props.onCreate}
          onEdit={props.onEdit}
          onDeactivate={props.onDeactivate}
        />
      </div>
    </main>
  );
}
