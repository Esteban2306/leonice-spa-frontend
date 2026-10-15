"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminProduct,
  CreateProductVariantRequest,
  ProductVariant,
} from "@/src/features/admin/types/products.types";

import {
  formatPesosInput,
  takenVariantIdentities,
  validateVariantDraft,
  variantPrice,
  type VariantDraftErrors,
} from "../lib/product-catalog";

export interface VariantDialogTarget {
  product: AdminProduct;
  variant: ProductVariant | null;
}

interface VariantDialogProps {
  target: VariantDialogTarget | null;
  onClose: () => void;
  onSave: (
    target: VariantDialogTarget,
    data: CreateProductVariantRequest,
  ) => Promise<boolean>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="font-sans text-xs text-red-700">
      {message}
    </p>
  );
}

function VariantForm({
  target,
  onClose,
  onSave,
}: VariantDialogProps & { target: VariantDialogTarget }) {
  const { product, variant } = target;
  const [brand, setBrand] = useState(variant?.brand ?? "");
  const [presentation, setPresentation] = useState(variant?.presentation ?? "");
  const [price, setPrice] = useState(
    variant ? formatPesosInput(variantPrice(variant)) : "",
  );
  const [errors, setErrors] = useState<VariantDraftErrors>({});
  const lastBrand = product.variants.at(-1)?.brand ?? "";

  return (
    <ActionDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={variant ? "Editar variante" : "Nueva variante"}
      description={
        variant
          ? `${product.name}. Si cambias la marca o la presentación, la foto se conserva.`
          : `${product.name}. Después podrás subirle una foto desde la tabla.`
      }
      submitLabel={variant ? "Guardar variante" : "Agregar variante"}
      submittingLabel="Guardando…"
      canSubmit={
        brand.trim() !== "" && presentation.trim() !== "" && price.trim() !== ""
      }
      onSubmit={async () => {
        const result = validateVariantDraft(
          { brand, presentation, price },
          takenVariantIdentities(product.variants, variant?.id),
        );
        setErrors(result.errors);
        if (!result.data) return false;
        return onSave(target, result.data);
      }}
    >
      <Field label="Marca" htmlFor="variant-brand">
        <input
          id="variant-brand"
          value={brand}
          maxLength={80}
          autoFocus
          list="variant-brand-options"
          placeholder={lastBrand || "MAIS"}
          aria-invalid={Boolean(errors.brand)}
          onChange={(event) => setBrand(event.target.value)}
          className={INPUT_CLASS}
        />
        <datalist id="variant-brand-options">
          {[...new Set(product.variants.map((item) => item.brand))].map(
            (option) => (
              <option key={option} value={option} />
            ),
          )}
        </datalist>
        <FieldError message={errors.brand} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Presentación" htmlFor="variant-presentation">
          <input
            id="variant-presentation"
            value={presentation}
            maxLength={80}
            placeholder="250 ml"
            aria-invalid={Boolean(errors.presentation)}
            onChange={(event) => setPresentation(event.target.value)}
            className={INPUT_CLASS}
          />
          <FieldError message={errors.presentation} />
        </Field>
        <Field label="Precio en pesos" htmlFor="variant-price">
          <input
            id="variant-price"
            value={price}
            inputMode="numeric"
            placeholder="45.000"
            aria-invalid={Boolean(errors.price)}
            onChange={(event) => setPrice(event.target.value)}
            className={`${INPUT_CLASS} text-right tabular-nums`}
          />
          <FieldError message={errors.price} />
        </Field>
      </div>
    </ActionDialog>
  );
}

export function VariantDialog(props: VariantDialogProps) {
  if (!props.target) return null;
  return (
    <VariantForm
      key={props.target.variant?.id ?? `new-${props.target.product.id}`}
      {...props}
      target={props.target}
    />
  );
}
