"use client";

import { useId, useState } from "react";
import { AlertTriangle, Minus, Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { formatCop } from "@/src/lib/money/cop";

import {
  RITUAL_MAX_ITEMS,
  RITUAL_MAX_QUANTITY,
  ritualTotals,
  searchVariantOptions,
  type RitualDraftItem,
  type RitualVariantOption,
} from "../lib/ritual-catalog";

interface RitualItemsEditorProps {
  items: readonly RitualDraftItem[];
  options: readonly RitualVariantOption[];
  pricePesos: number | null;
  unavailableIds?: ReadonlySet<string>;
  error?: string;
  onChange: (items: RitualDraftItem[]) => void;
}

const STEP_BUTTON =
  "grid size-8 cursor-pointer place-items-center rounded-full text-secondary/75 transition-colors hover:bg-secondary/5 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-40";

export function RitualSavings({
  items,
  pricePesos,
}: {
  items: readonly RitualDraftItem[];
  pricePesos: number | null;
}) {
  const totals = ritualTotals(items, pricePesos);
  const losing = totals.savingsPesos !== null && totals.savingsPesos <= 0;
  return (
    <dl
      aria-live="polite"
      className="grid grid-cols-3 gap-2 rounded-2xl border border-tertiary/30 bg-white/60 p-3"
    >
      <div>
        <dt className="font-sans text-xs text-secondary/65">Por separado</dt>
        <dd className="font-sans text-sm text-secondary tabular-nums">
          {totals.separatePricePesos > 0
            ? formatCop(totals.separatePricePesos)
            : "—"}
        </dd>
      </div>
      <div>
        <dt className="font-sans text-xs text-secondary/65">Precio Ritual</dt>
        <dd className="font-sans text-sm font-semibold text-secondary tabular-nums">
          {pricePesos !== null ? formatCop(pricePesos) : "—"}
        </dd>
      </div>
      <div>
        <dt className="font-sans text-xs text-secondary/65">Ahorro</dt>
        <dd
          className={cn(
            "font-sans text-sm font-semibold tabular-nums",
            losing ? "text-red-700" : "text-emerald-800",
          )}
        >
          {totals.savingsPesos === null
            ? "—"
            : `${formatCop(totals.savingsPesos)} (${totals.savingsPercent} %)`}
        </dd>
      </div>
      {losing && (
        <p className="col-span-3 flex items-center gap-1.5 font-sans text-xs text-red-700">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
          El Ritual cuesta igual o más que comprar los productos por separado.
        </p>
      )}
    </dl>
  );
}

export function RitualItemsEditor({
  items,
  options,
  pricePesos,
  unavailableIds,
  error,
  onChange,
}: RitualItemsEditorProps) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const taken = new Set(items.map((item) => item.variantId));
  const matches = query.trim()
    ? searchVariantOptions(options, query, taken)
    : [];
  const full = items.length >= RITUAL_MAX_ITEMS;

  const update = (variantId: string, quantity: number) =>
    onChange(
      items.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tertiary/60 px-4 py-3 font-sans text-sm text-secondary/65">
          Busca abajo los productos que incluye el Ritual, con su presentación
          exacta.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5" aria-label="Productos del Ritual">
          {items.map((item) => {
            const unavailable = unavailableIds?.has(item.variantId) ?? false;
            return (
              <li
                key={item.variantId}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl border bg-white/70 py-1.5 pr-1.5 pl-4",
                  unavailable ? "border-red-200" : "border-secondary/10",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-sm font-semibold text-secondary">
                    {item.productName}
                  </p>
                  <p className="truncate font-sans text-xs text-secondary/65 tabular-nums">
                    {item.presentation} · {formatCop(item.unitPricePesos)} c/u
                    {unavailable && (
                      <span className="ml-1.5 text-red-700">
                        · inactivo, quítalo o actívalo
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Una unidad menos de ${item.productName}`}
                    disabled={item.quantity <= 1}
                    onClick={() => update(item.variantId, item.quantity - 1)}
                    className={STEP_BUTTON}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span
                    aria-label={`Cantidad de ${item.productName}`}
                    className="w-6 text-center font-sans text-sm text-secondary tabular-nums"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Una unidad más de ${item.productName}`}
                    disabled={item.quantity >= RITUAL_MAX_QUANTITY}
                    onClick={() => update(item.variantId, item.quantity + 1)}
                    className={STEP_BUTTON}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Quitar ${item.productName} del Ritual`}
                  onClick={() =>
                    onChange(
                      items.filter(
                        (other) => other.variantId !== item.variantId,
                      ),
                    )
                  }
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Buscar producto para agregar al Ritual
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-secondary/60"
        />
        <input
          id={searchId}
          type="search"
          value={query}
          disabled={full}
          placeholder={
            full
              ? "Máximo 10 productos"
              : "Buscar producto o marca para agregar"
          }
          onChange={(event) => setQuery(event.target.value)}
          className={`${INPUT_CLASS} h-10 pl-10`}
        />
      </div>
      {query.trim() !== "" && (
        <ul
          className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-2xl border border-tertiary/30 bg-white p-1.5"
          aria-label="Resultados"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 font-sans text-sm text-secondary/65">
              Ningún producto activo coincide.
            </li>
          ) : (
            matches.map((option) => (
              <li key={option.variantId}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...items, { ...option, quantity: 1 }]);
                    setQuery("");
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-sans text-sm text-secondary">
                      {option.productName}
                    </span>
                    <span className="block truncate font-sans text-xs text-secondary/65">
                      {option.brand} · {option.presentation}
                    </span>
                  </span>
                  <span className="shrink-0 font-sans text-sm text-secondary tabular-nums">
                    {formatCop(option.unitPricePesos)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {error && (
        <p role="alert" className="font-sans text-xs text-red-700">
          {error}
        </p>
      )}

      <RitualSavings items={items} pricePesos={pricePesos} />
    </div>
  );
}
