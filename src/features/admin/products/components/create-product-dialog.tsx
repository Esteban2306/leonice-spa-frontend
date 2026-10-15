"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AdminProduct,
  AdminProductCategory,
  CreateProductRequest,
  CreateProductVariantRequest,
} from "@/src/features/admin/types/products.types";

import {
  formatPesosInput,
  parsePesos,
  takenVariantIdentities,
  validateProductDraft,
  validateVariantDraft,
  type ProductDraftErrors,
  type VariantDraft,
  type VariantDraftErrors,
} from "../lib/product-catalog";
import { SelectControl } from "./select-control";
import { VariantPhotoSlot } from "./variant-photo-slot";

interface CreateProductDialogProps {
  open: boolean;
  categories: readonly AdminProductCategory[];
  defaultCategoryId: string;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    data: CreateProductRequest,
    photos: readonly NewVariantPhoto[],
  ) => Promise<AdminProduct | null>;
}

export interface NewVariantPhoto {
  brand: string;
  presentation: string;
  file: File;
}

interface PendingPhoto {
  file: File;
  previewUrl: string;
}

let draftKey = 0;
const emptyVariant = (): VariantDraft => ({
  key: `v${++draftKey}`,
  brand: "",
  presentation: "",
  price: "",
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="font-sans text-xs text-red-700">
      {message}
    </p>
  );
}

export function CreateProductDialog({
  open,
  categories,
  defaultCategoryId,
  onOpenChange,
  onCreate,
}: CreateProductDialogProps) {
  const [name, setName] = useState("");
  const [productCategoryId, setProductCategoryId] = useState(defaultCategoryId);
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariant()]);
  const [photos, setPhotos] = useState<Record<string, PendingPhoto>>({});
  const photosRef = useRef(photos);
  const [errors, setErrors] = useState<ProductDraftErrors>({});
  const [variantErrors, setVariantErrors] = useState<
    Record<string, VariantDraftErrors>
  >({});

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      Object.values(photosRef.current).forEach((photo) =>
        URL.revokeObjectURL(photo.previewUrl),
      );
    },
    [],
  );

  const setPhoto = (key: string, file: File | null) =>
    setPhotos((current) => {
      const { [key]: previous, ...rest } = current;
      if (previous) URL.revokeObjectURL(previous.previewUrl);
      return file
        ? { ...rest, [key]: { file, previewUrl: URL.createObjectURL(file) } }
        : rest;
    });

  const activeCategories = categories.filter((category) => category.isActive);

  const updateVariant = (key: string, patch: Partial<VariantDraft>) =>
    setVariants((current) =>
      current.map((variant) =>
        variant.key === key ? { ...variant, ...patch } : variant,
      ),
    );

  const submit = async () => {
    const product = validateProductDraft({
      name,
      productCategoryId,
      description,
    });
    setErrors(product.errors);

    const filled = variants.filter(
      (variant) => variant.brand || variant.presentation || variant.price,
    );
    const nextVariantErrors: Record<string, VariantDraftErrors> = {};
    const payload: CreateProductVariantRequest[] = [];
    const newPhotos: NewVariantPhoto[] = [];
    for (const variant of filled) {
      const taken = takenVariantIdentities(
        payload.map((item, index) => ({ id: String(index), ...item })),
      );
      const result = validateVariantDraft(variant, taken);
      if (result.data) {
        payload.push(result.data);
        const photo = photos[variant.key];
        if (photo)
          newPhotos.push({
            brand: result.data.brand,
            presentation: result.data.presentation,
            file: photo.file,
          });
      } else nextVariantErrors[variant.key] = result.errors;
    }
    setVariantErrors(nextVariantErrors);

    if (!product.data || Object.keys(nextVariantErrors).length > 0)
      return false;

    const created = await onCreate(
      { ...product.data, variants: payload },
      newPhotos,
    );
    return created !== null;
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo producto"
      description="Cada variante puede llevar su foto; se sube al crear el producto."
      submitLabel="Crear producto"
      submittingLabel="Creando…"
      contentClassName="sm:max-w-2xl"
      canSubmit={name.trim().length >= 2 && productCategoryId !== ""}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <Field label="Nombre" htmlFor="new-product-name">
          <input
            id="new-product-name"
            value={name}
            maxLength={120}
            autoFocus
            placeholder="Shampoo reparador intensivo"
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => setName(event.target.value)}
            className={INPUT_CLASS}
          />
          <FieldError message={errors.name} />
        </Field>
        <Field label="Categoría" htmlFor="new-product-category">
          <SelectControl
            id="new-product-category"
            value={productCategoryId}
            aria-invalid={Boolean(errors.productCategoryId)}
            onChange={(event) => setProductCategoryId(event.target.value)}
          >
            <option value="" disabled>
              Elige una categoría
            </option>
            {activeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectControl>
          <FieldError message={errors.productCategoryId} />
        </Field>
      </div>

      <Field
        label="Descripción"
        htmlFor="new-product-description"
        hint="Opcional. Se muestra en la web debajo del nombre."
      >
        <TextArea
          id="new-product-description"
          value={description}
          maxLength={2000}
          rows={2}
          placeholder="Limpieza suave que repara la fibra dañada por procesos químicos."
          onChange={(event) => setDescription(event.target.value)}
        />
        <FieldError message={errors.description} />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 font-sans text-xs tracking-[0.16em] text-secondary/55 uppercase">
          Variantes
        </legend>
        <div
          aria-hidden="true"
          className="hidden grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_9rem_2.5rem] gap-2 px-2 font-sans text-xs text-secondary/60 sm:grid"
        >
          <span>Foto</span>
          <span>Marca</span>
          <span>Presentación</span>
          <span className="text-right">Precio en pesos</span>
        </div>
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
          {variants.map((variant, index) => {
            const rowErrors = variantErrors[variant.key] ?? {};
            return (
              <div
                key={variant.key}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)] items-start gap-2 rounded-2xl border border-secondary/10 bg-white/60 p-2 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_9rem_2.5rem]"
              >
                <VariantPhotoSlot
                  imageUrl={photos[variant.key]?.previewUrl ?? null}
                  label={`la variante ${index + 1}`}
                  isUploading={false}
                  onUpload={(file) => setPhoto(variant.key, file)}
                  onRemove={() => setPhoto(variant.key, null)}
                />
                <div className="flex flex-col gap-1">
                  <input
                    aria-label={`Marca de la variante ${index + 1}`}
                    placeholder="Marca"
                    value={variant.brand}
                    maxLength={80}
                    aria-invalid={Boolean(rowErrors.brand)}
                    onChange={(event) =>
                      updateVariant(variant.key, { brand: event.target.value })
                    }
                    className={`${INPUT_CLASS} h-10`}
                  />
                  <FieldError message={rowErrors.brand} />
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    aria-label={`Presentación de la variante ${index + 1}`}
                    placeholder="250 ml"
                    value={variant.presentation}
                    maxLength={80}
                    aria-invalid={Boolean(rowErrors.presentation)}
                    onChange={(event) =>
                      updateVariant(variant.key, {
                        presentation: event.target.value,
                      })
                    }
                    className={`${INPUT_CLASS} h-10`}
                  />
                  <FieldError message={rowErrors.presentation} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-sans text-sm text-secondary/50"
                    >
                      $
                    </span>
                    <input
                      aria-label={`Precio en pesos de la variante ${index + 1}`}
                      placeholder="45.000"
                      onBlur={() => {
                        const pesos = parsePesos(variant.price);
                        if (pesos !== null)
                          updateVariant(variant.key, {
                            price: formatPesosInput(pesos),
                          });
                      }}
                      inputMode="numeric"
                      value={variant.price}
                      aria-invalid={Boolean(rowErrors.price)}
                      onChange={(event) =>
                        updateVariant(variant.key, {
                          price: event.target.value,
                        })
                      }
                      className={`${INPUT_CLASS} h-10 pl-7 text-right tabular-nums`}
                    />
                  </div>
                  <FieldError message={rowErrors.price} />
                </div>
                <button
                  type="button"
                  aria-label={`Quitar la variante ${index + 1}`}
                  disabled={variants.length === 1}
                  onClick={() => {
                    setPhoto(variant.key, null);
                    setVariants((current) =>
                      current.filter((item) => item.key !== variant.key),
                    );
                  }}
                  className="grid size-10 cursor-pointer place-items-center justify-self-end rounded-full text-secondary/50 transition-colors hover:bg-secondary/5 hover:text-secondary disabled:invisible"
                >
                  <X className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setVariants((current) => [...current, emptyVariant()])}
          disabled={variants.length >= 30}
          className="inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/30 disabled:opacity-50"
        >
          <Plus className="size-4" strokeWidth={2} />
          Otra variante
        </button>
        <p className="font-sans text-xs text-secondary/55">
          Cada variante es una marca y presentación con su precio en pesos y una
          foto opcional (JPG, PNG o WebP, hasta 5 MB). Deja la fila vacía si
          prefieres agregarlas después.
        </p>
      </fieldset>
    </ActionDialog>
  );
}
