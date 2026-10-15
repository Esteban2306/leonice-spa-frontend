"use client";

import { useState } from "react";

import { formatPesos } from "@/src/features/landing/lib/format";
import { ActionLink } from "@/src/features/landing/components/action-link";
import { whatsappHref } from "@/src/features/landing/lib/site-config";
import type { CatalogVariant } from "@/src/features/products-catalog/api/catalog.types";
import { productOrderMessage } from "@/src/features/products-catalog/lib/catalog-format";

interface VariantPickerProps {
  productName: string;
  variants: CatalogVariant[];
  size?: "md" | "lg";
}

export function VariantPicker({ productName, variants, size = "lg" }: VariantPickerProps) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? null);
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0];

  return (
    <div className="flex flex-col gap-5">
      {variants.length > 0 && (
        <div role="radiogroup" aria-label="Presentación" className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const active = variant.id === selected?.id;
            return (
              <button
                key={variant.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedId(variant.id)}
                className={`flex cursor-pointer flex-col items-start rounded-[1.25rem] border px-4 py-2.5 text-left transition-[border-color,background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250] ${
                  active
                    ? "border-[#062112] bg-[#062112] text-[#F2EBDB]"
                    : "border-[#062112]/15 bg-white/60 text-[#062112] hover:border-[#062112]/50"
                }`}
              >
                <span className="font-sans text-sm font-bold">{variant.presentation}</span>
                <span className={`font-sans text-xs tabular-nums ${active ? "text-[#E0BC87]" : "text-[#7a5a2c]"}`}>
                  {formatPesos(variant.pricePesos)}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        {selected && (
          <p className="font-heading text-[clamp(2rem,3.4vw,2.75rem)] leading-none tabular-nums text-[#062112]">
            {formatPesos(selected.pricePesos)}
          </p>
        )}
        <ActionLink
          variant="sand"
          size={size}
          href={whatsappHref(productOrderMessage(productName, selected?.presentation))}
        >
          Pedir por WhatsApp
        </ActionLink>
      </div>
      {selected && (
        <p className="font-sans text-xs text-[#062112]/55">
          {selected.brand} · {selected.presentation}. Te confirmamos disponibilidad y entrega por WhatsApp.
        </p>
      )}
    </div>
  );
}
