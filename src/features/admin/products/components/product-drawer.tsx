"use client";

import { useState, type ReactNode } from "react";
import { Eye, Plus, Sparkles, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type {
  AdminProduct,
  AdminProductCategory,
  AdminProductDetail,
  AdminProductTag,
  UpdateProductRequest,
} from "@/src/features/admin/types/products.types";

import {
  formatPriceRangePesos,
  hasHistory,
  photoCoverage,
  priceRangePesos,
  validateProductDraft,
  type ProductDraftErrors,
} from "../lib/product-catalog";
import { SelectControl } from "./select-control";
import { VariantRow, type VariantHandlers } from "./variant-row";

export interface TreatmentOption {
  id: string;
  name: string;
  categoryName: string;
  isActive: boolean;
}

interface ProductDrawerProps {
  product: AdminProduct | null;
  detail: AdminProductDetail | null;
  categories: readonly AdminProductCategory[];
  tags: readonly AdminProductTag[];
  treatments: readonly TreatmentOption[];
  uploadingVariantIds: ReadonlySet<string>;
  isSaving: boolean;
  variantHandlers: VariantHandlers;
  onClose: () => void;
  onSave: (productId: string, data: UpdateProductRequest) => Promise<boolean>;
  onToggleActive: (product: AdminProduct, isActive: boolean) => void;
  onAddVariant: (product: AdminProduct) => void;
  onSaveTags: (productId: string, tagIds: string[]) => Promise<boolean>;
  onCreateTag: (name: string) => Promise<{ id: string } | null>;
  onAddRecommendation: (
    productId: string,
    treatmentId: string,
  ) => Promise<boolean>;
  onRemoveRecommendation: (recommendationId: string) => void;
  onDelete: (product: AdminProduct) => void;
}

function Section({
  id,
  title,
  aside,
  children,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-4 border-t border-tertiary/25 px-6 py-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={id} className="font-heading text-xl text-secondary">
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function sameIds(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

const DATE_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function TagsEditor({
  product,
  tags,
  onSave,
  onCreateTag,
}: {
  product: AdminProduct;
  tags: readonly AdminProductTag[];
  onSave: (tagIds: string[]) => Promise<boolean>;
  onCreateTag: (name: string) => Promise<{ id: string } | null>;
}) {
  const original = product.tagAssignments.map((assignment) => assignment.tagId);
  const [selected, setSelected] = useState<string[]>(original);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const dirty = !sameIds(original, selected);
  const visibleTags = tags.filter(
    (tag) => tag.isActive || selected.includes(tag.id),
  );

  const toggle = (tagId: string) =>
    setSelected((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );

  const create = async () => {
    const name = newTag.trim().replace(/\s+/g, " ");
    if (name.length < 2) return;
    const created = await onCreateTag(name);
    if (created) {
      setSelected((current) => [...current, created.id]);
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {visibleTags.length === 0 ? (
        <p className="font-sans text-sm text-secondary/60">
          Aún no hay etiquetas. Crea la primera aquí abajo.
        </p>
      ) : (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Etiquetas"
        >
          {visibleTags.map((tag) => {
            const isOn = selected.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggle(tag.id)}
                className={cn(
                  "h-9 cursor-pointer rounded-full border px-3.5 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
                  isOn
                    ? "border-secondary bg-secondary text-primary"
                    : "border-secondary/15 bg-white text-secondary/75 hover:border-tertiary/60",
                  !tag.isActive && "border-dashed",
                )}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={newTag}
          maxLength={40}
          placeholder="Nueva etiqueta"
          aria-label="Nombre de la nueva etiqueta"
          onChange={(event) => setNewTag(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void create();
            }
          }}
          className={`${INPUT_CLASS} h-10`}
        />
        <button
          type="button"
          onClick={() => void create()}
          disabled={newTag.trim().length < 2}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" strokeWidth={2} />
          Crear
        </button>
      </div>
      {dirty && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelected(original)}
            className="h-10 cursor-pointer rounded-full px-4 font-sans text-sm text-secondary/70 hover:bg-secondary/5"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={async () => {
              setIsSaving(true);
              await onSave(selected);
              setIsSaving(false);
            }}
            className="h-10 cursor-pointer rounded-full bg-secondary px-5 font-sans text-sm text-primary hover:bg-secondary/90 disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Guardar etiquetas"}
          </button>
        </div>
      )}
    </div>
  );
}

function RecommendationsEditor({
  detail,
  treatments,
  onAdd,
  onRemove,
}: {
  detail: AdminProductDetail | null;
  treatments: readonly TreatmentOption[];
  onAdd: (treatmentId: string) => Promise<boolean>;
  onRemove: (recommendationId: string) => void;
}) {
  const [treatmentId, setTreatmentId] = useState("");
  if (!detail)
    return <div className="h-20 animate-pulse rounded-2xl bg-secondary/5" />;

  const taken = new Set(detail.recommendations.map((r) => r.treatment.id));
  const available = treatments.filter((t) => t.isActive && !taken.has(t.id));

  return (
    <div className="flex flex-col gap-3">
      {detail.recommendations.length === 0 ? (
        <p className="font-sans text-sm text-secondary/60">
          Todavía no está asociado a ningún servicio. Elige los servicios para
          los que recomiendas este producto.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {detail.recommendations.map((recommendation) => (
            <li
              key={recommendation.id}
              className="flex items-center justify-between gap-2 rounded-2xl border border-secondary/10 bg-white/70 py-1.5 pr-1.5 pl-4"
            >
              <span
                className={cn(
                  "font-sans text-sm",
                  recommendation.treatment.isActive
                    ? "text-secondary"
                    : "text-secondary/55",
                )}
              >
                {recommendation.treatment.name}
                {!recommendation.treatment.isActive && " (servicio inactivo)"}
              </span>
              <button
                type="button"
                aria-label={`Quitar recomendación en ${recommendation.treatment.name}`}
                onClick={() => onRemove(recommendation.id)}
                className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/55 hover:bg-red-50 hover:text-red-700"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="recommend-treatment">
          Servicio
        </label>
        <SelectControl
          id="recommend-treatment"
          value={treatmentId}
          onChange={(event) => setTreatmentId(event.target.value)}
          className="h-10"
        >
          <option value="">Elige un servicio…</option>
          {available.map((treatment) => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.name} · {treatment.categoryName}
            </option>
          ))}
        </SelectControl>
        <button
          type="button"
          disabled={!treatmentId}
          onClick={async () => {
            if (await onAdd(treatmentId)) setTreatmentId("");
          }}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="size-4" strokeWidth={1.8} />
          Recomendar
        </button>
      </div>
    </div>
  );
}

function DrawerBody(props: ProductDrawerProps & { product: AdminProduct }) {
  const { product, detail, categories } = props;
  const original = {
    name: product.name,
    productCategoryId: product.productCategoryId,
    description: product.description ?? "",
  };
  const [draft, setDraft] = useState(original);
  const [errors, setErrors] = useState<ProductDraftErrors>({});
  const isDirty =
    draft.name !== original.name ||
    draft.productCategoryId !== original.productCategoryId ||
    draft.description !== original.description;
  const price = formatPriceRangePesos(priceRangePesos(product));
  const coverage = photoCoverage(product);
  const withHistory = hasHistory(product);

  const save = async () => {
    const result = validateProductDraft(draft);
    setErrors(result.errors);
    if (!result.data) return;
    const { name, productCategoryId, description } = result.data;
    await props.onSave(product.id, { name, productCategoryId, description });
  };

  return (
    <>
      <header className="flex flex-col gap-4 bg-secondary px-6 pt-6 pb-5 text-primary">
        <div className="pr-10">
          <SheetTitle className="font-heading text-3xl leading-tight text-primary">
            {product.name}
          </SheetTitle>
          <SheetDescription className="mt-1 font-sans text-sm text-primary/70">
            {product.category.name} · {product.variants.length}{" "}
            {product.variants.length === 1 ? "variante" : "variantes"}
          </SheetDescription>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.06] p-3">
            <dt className="font-sans text-xs text-primary/70">
              Precio en la web
            </dt>
            <dd className="mt-1 font-sans text-xl leading-tight font-light text-quaternary tabular-nums">
              {price ?? "Sin variantes"}
            </dd>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.06] p-3">
            <dt className="font-sans text-xs text-primary/70">Fotos</dt>
            <dd className="mt-1 font-sans text-xl leading-tight font-light text-quaternary tabular-nums">
              {coverage.total === 0
                ? "—"
                : `${coverage.withPhoto} de ${coverage.total}`}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 font-sans text-xs text-primary/70 tabular-nums">
            <Eye className="size-3.5" aria-hidden="true" />
            {product._count.viewLogs}{" "}
            {product._count.viewLogs === 1
              ? "vista de clienta"
              : "vistas de clientas"}
            {" · "}
            {product._count.recommendations}{" "}
            {product._count.recommendations === 1
              ? "recomendación"
              : "recomendaciones"}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <label className="flex items-center gap-2 font-sans text-sm text-primary/85">
              {product.isFeatured ? "Destacado en la landing" : "No destacado"}
              <CatalogSwitch
                tone="dark"
                checked={product.isFeatured}
                label={
                  product.isFeatured
                    ? "Quitar de destacados"
                    : "Destacar en la landing"
                }
                onChange={(next) =>
                  void props.onSave(product.id, { isFeatured: next })
                }
              />
            </label>
            <label className="flex items-center gap-2 font-sans text-sm text-primary/85">
              {product.isActive ? "A la venta" : "Desactivado"}
              <CatalogSwitch
                tone="dark"
                checked={product.isActive}
                label={
                  product.isActive ? "Desactivar producto" : "Activar producto"
                }
                onChange={(next) => props.onToggleActive(product, next)}
              />
            </label>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Section id="product-details" title="Datos del producto">
          <Field label="Nombre" htmlFor={`product-${product.id}-name`}>
            <input
              id={`product-${product.id}-name`}
              value={draft.name}
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
              className={INPUT_CLASS}
            />
            {errors.name && (
              <p role="alert" className="font-sans text-xs text-red-700">
                {errors.name}
              </p>
            )}
          </Field>
          <Field label="Categoría" htmlFor={`product-${product.id}-category`}>
            <SelectControl
              id={`product-${product.id}-category`}
              value={draft.productCategoryId}
              onChange={(event) =>
                setDraft({ ...draft, productCategoryId: event.target.value })
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  {category.isActive ? "" : " (inactiva)"}
                </option>
              ))}
            </SelectControl>
          </Field>
          <Field
            label="Descripción"
            htmlFor={`product-${product.id}-description`}
            hint="Se muestra en la web debajo del nombre."
          >
            <TextArea
              id={`product-${product.id}-description`}
              value={draft.description}
              maxLength={2000}
              rows={3}
              onChange={(event) =>
                setDraft({ ...draft, description: event.target.value })
              }
            />
          </Field>
        </Section>

        <Section
          id="product-variants"
          title="Variantes y fotos"
          aside={
            <button
              type="button"
              onClick={() => props.onAddVariant(product)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 px-3.5 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/30"
            >
              <Plus className="size-4" strokeWidth={2} />
              Agregar
            </button>
          }
        >
          {product.variants.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-tertiary/60 px-4 py-3 font-sans text-sm text-secondary/65">
              Sin variantes el producto no muestra precio en la web.
            </p>
          ) : (
            <ul className="-mx-2 flex flex-col gap-1">
              {product.variants.map((variant) => (
                <VariantRow
                  key={variant.id}
                  variant={variant}
                  isUploading={props.uploadingVariantIds.has(variant.id)}
                  handlers={props.variantHandlers}
                />
              ))}
            </ul>
          )}
          <p className="font-sans text-xs text-secondary/55">
            Toca o arrastra una imagen sobre la casilla para subir la foto (JPG,
            PNG o WebP, hasta 5 MB). La primera foto activa es la portada.
          </p>
        </Section>

        <Section id="product-tags" title="Etiquetas">
          <TagsEditor
            key={product.tagAssignments.map((a) => a.tagId).join(",")}
            product={product}
            tags={props.tags}
            onSave={(tagIds) => props.onSaveTags(product.id, tagIds)}
            onCreateTag={props.onCreateTag}
          />
        </Section>

        <Section id="product-recommendations" title="Recomendado en servicios">
          <RecommendationsEditor
            detail={detail}
            treatments={props.treatments}
            onAdd={(treatmentId) =>
              props.onAddRecommendation(product.id, treatmentId)
            }
            onRemove={props.onRemoveRecommendation}
          />
        </Section>

        <section
          aria-labelledby="product-danger"
          className="flex flex-col gap-3 border-t border-tertiary/25 px-6 py-6"
        >
          <h3
            id="product-danger"
            className="font-heading text-xl text-secondary"
          >
            Eliminar producto
          </h3>
          <p className="font-sans text-sm text-secondary/65">
            {withHistory
              ? "Este producto ya tiene historial (vistas de clientas o recomendaciones), así que no se puede borrar. Desactívalo para ocultarlo de la web sin perder ese historial."
              : "Se borra el producto con sus variantes, etiquetas y fotos. No se puede deshacer."}
          </p>
          <button
            type="button"
            onClick={() =>
              withHistory
                ? props.onToggleActive(product, false)
                : props.onDelete(product)
            }
            disabled={withHistory && !product.isActive}
            className={cn(
              "inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              withHistory
                ? "border-secondary/20 text-secondary hover:bg-secondary/5"
                : "border-red-300 text-red-700 hover:bg-red-50",
            )}
          >
            <Trash2 className="size-4" />
            {withHistory
              ? product.isActive
                ? "Desactivar en su lugar"
                : "Ya está desactivado"
              : "Eliminar producto"}
          </button>
        </section>

        <p className="border-t border-tertiary/25 px-6 py-5 font-sans text-xs text-secondary/70">
          Creado el {DATE_FORMAT.format(new Date(product.createdAt))} · Última
          edición el {DATE_FORMAT.format(new Date(product.updatedAt))}
        </p>
      </div>

      {isDirty && (
        <footer className="flex items-center justify-end gap-2 border-t border-tertiary/30 bg-primary px-6 py-4">
          <button
            type="button"
            onClick={() => {
              setDraft(original);
              setErrors({});
            }}
            className="h-11 cursor-pointer rounded-full px-5 font-sans text-sm text-secondary/70 transition-colors hover:bg-secondary/5"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={props.isSaving}
            onClick={() => void save()}
            className="h-11 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {props.isSaving ? "Guardando…" : "Guardar cambios"}
          </button>
        </footer>
      )}
    </>
  );
}

export function ProductDrawer(props: ProductDrawerProps) {
  const { product, onClose } = props;

  return (
    <Sheet open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden border-l border-tertiary/30 bg-[#FCF6EB] p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        {product && (
          <DrawerBody
            key={`${product.id}-${product.updatedAt}`}
            {...props}
            product={product}
          />
        )}
        <SheetClose
          render={
            <button
              type="button"
              aria-label="Cerrar detalle"
              className="absolute top-5 right-5 grid size-9 cursor-pointer place-items-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            />
          }
        >
          <X className="size-4.5" />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
