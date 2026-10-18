"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import { OptionsMenu } from "@/src/features/admin/services/components/options-menu";
import type { ProductVariant } from "@/src/features/admin/types/products.types";

import { variantPrice } from "../lib/product-catalog";
import { InlinePrice } from "./inline-price";
import { VariantPhotoSlot } from "./variant-photo-slot";

export interface VariantHandlers {
  onUploadImage: (variant: ProductVariant, file: File) => void;
  onRemoveImage: (variant: ProductVariant) => void;
  onChangePrice: (variant: ProductVariant, pesos: number) => Promise<boolean>;
  onToggleActive: (variant: ProductVariant, isActive: boolean) => void;
  onEdit: (variant: ProductVariant) => void;
  onDelete: (variant: ProductVariant) => void;
}

interface VariantRowProps {
  variant: ProductVariant;
  isUploading: boolean;
  handlers: VariantHandlers;
}

export function variantLabel(variant: ProductVariant): string {
  return `${variant.brand} · ${variant.presentation}`;
}

export function VariantRow({
  variant,
  isUploading,
  handlers,
}: VariantRowProps) {
  const label = variantLabel(variant);

  return (
    <li
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-2xl px-2 py-2 transition-colors sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:px-3",
        variant.isActive ? "hover:bg-white/70" : "opacity-70",
      )}
    >
      <VariantPhotoSlot
        imageUrl={variant.imageUrl}
        label={label}
        isUploading={isUploading}
        onUpload={(file) => handlers.onUploadImage(variant, file)}
        onRemove={() => handlers.onRemoveImage(variant)}
      />

      <div className="min-w-0">
        <p className="truncate font-sans text-sm font-semibold text-secondary">
          {variant.brand}
        </p>
        <p className="truncate font-sans text-sm text-secondary/65">
          {variant.presentation}
          {!variant.isActive && (
            <span className="ml-2 rounded-full border border-dashed border-secondary/25 px-2 py-px text-[11px] text-secondary/70">
              Oculta
            </span>
          )}
        </p>
      </div>

      <div className="col-span-3 col-start-1 row-start-2 flex items-center justify-between gap-2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
        <InlinePrice
          value={variantPrice(variant)}
          label={label}
          onCommit={(pesos) => handlers.onChangePrice(variant, pesos)}
        />
        <div className="sm:hidden">
          <CatalogSwitch
            checked={variant.isActive}
            label={variant.isActive ? `Ocultar ${label}` : `Mostrar ${label}`}
            onChange={(next) => handlers.onToggleActive(variant, next)}
          />
        </div>
      </div>

      <div className="col-start-3 row-start-1 flex items-center gap-1.5 sm:col-start-4">
        <div className="hidden sm:block">
          <CatalogSwitch
            checked={variant.isActive}
            label={variant.isActive ? `Ocultar ${label}` : `Mostrar ${label}`}
            onChange={(next) => handlers.onToggleActive(variant, next)}
          />
        </div>
        <OptionsMenu
          label={`Opciones de ${label}`}
          trigger={
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/70 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              <Ellipsis className="size-4.5" />
            </button>
          }
          options={[
            {
              key: "edit",
              icon: Pencil,
              label: "Editar marca y presentación",
              onSelect: () => handlers.onEdit(variant),
            },
            {
              key: "delete",
              icon: Trash2,
              label: "Eliminar variante",
              tone: "danger",
              separated: true,
              onSelect: () => handlers.onDelete(variant),
            },
          ]}
        />
      </div>
    </li>
  );
}
