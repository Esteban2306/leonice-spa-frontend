"use client";

import { useState } from "react";
import { Layers } from "lucide-react";

import type { AdminProduct } from "@/src/features/admin/types/products.types";

import {
  draftFromRitual,
  itemsError,
  sameItems,
  toItemRequests,
  type RitualDraftItem,
  type RitualVariantOption,
} from "../lib/ritual-catalog";
import { RitualItemsEditor } from "./ritual-items-editor";

export function RitualItemsSection({
  product,
  options,
  isSaving,
  onSave,
}: {
  product: AdminProduct;
  options: readonly RitualVariantOption[];
  isSaving: boolean;
  onSave: (items: ReturnType<typeof toItemRequests>) => Promise<boolean>;
}) {
  const original = draftFromRitual(product);
  const [items, setItems] = useState<RitualDraftItem[]>(original);
  const [error, setError] = useState<string | undefined>();
  const dirty = !sameItems(original, items);
  const unavailableIds = new Set(
    (product.ritual?.items ?? [])
      .filter((item) => !item.isAvailable)
      .map((item) => item.variantId),
  );

  return (
    <div className="flex flex-col gap-3">
      {product.ritual && !product.ritual.isComplete && (
        <p
          role="status"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
        >
          Incompleto: no se muestra en la web ni lo ofrece el bot hasta que
          todos sus productos estén activos.
        </p>
      )}
      <RitualItemsEditor
        items={items}
        options={options}
        pricePesos={product.ritual?.pricePesos ?? null}
        unavailableIds={unavailableIds}
        error={error}
        onChange={(next) => {
          setItems(next);
          setError(undefined);
        }}
      />
      {dirty && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setItems(original);
              setError(undefined);
            }}
            className="h-10 cursor-pointer rounded-full px-4 font-sans text-sm text-secondary/70 hover:bg-secondary/5"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              const message = itemsError(items);
              setError(message ?? undefined);
              if (!message) void onSave(toItemRequests(items));
            }}
            className="h-10 cursor-pointer rounded-full bg-secondary px-5 font-sans text-sm text-primary hover:bg-secondary/90 disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Guardar productos"}
          </button>
        </div>
      )}
    </div>
  );
}

export function IncludedInRituals({
  product,
  onOpenProduct,
}: {
  product: AdminProduct;
  onOpenProduct: (productId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans text-sm text-secondary/70">
        Si lo desactivas, estos Rituales quedan incompletos y se ocultan de la
        web. No se puede borrar mientras esté incluido.
      </p>
      <ul className="flex flex-wrap gap-2">
        {product.includedInRituals.map((ritual) => (
          <li key={ritual.id}>
            <button
              type="button"
              onClick={() => onOpenProduct(ritual.id)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 bg-white/70 px-3.5 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              <Layers className="size-4" strokeWidth={1.8} />
              {ritual.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
