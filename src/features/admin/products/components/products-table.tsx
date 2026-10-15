"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Ellipsis,
  ImageOff,
  PanelRightOpen,
  Plus,
  Power,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import { OptionsMenu } from "@/src/features/admin/services/components/options-menu";
import type { AdminProduct } from "@/src/features/admin/types/products.types";

import {
  brandsOf,
  coverImage,
  formatPriceRangePesos,
  photoCoverage,
  priceRangePesos,
  isOptimizableImage,
} from "../lib/product-catalog";
import { VariantRow, type VariantHandlers } from "./variant-row";

export type ProductSortKey = "name" | "price" | "updatedAt";
export interface ProductSort {
  key: ProductSortKey;
  direction: "asc" | "desc";
}

export interface ProductRowHandlers {
  onToggleExpanded: (productId: string) => void;
  onOpen: (productId: string) => void;
  onToggleActive: (product: AdminProduct, isActive: boolean) => void;
  onAddVariant: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
  variant: VariantHandlers;
}

interface ProductsTableProps {
  products: readonly AdminProduct[];
  expandedIds: ReadonlySet<string>;
  selectedId: string | null;
  uploadingVariantIds: ReadonlySet<string>;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  handlers: ProductRowHandlers;
}

function Cover({ product, size }: { product: AdminProduct; size: number }) {
  const url = coverImage(product);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = url !== null && url !== failedUrl;
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-tertiary/25 bg-[repeating-linear-gradient(135deg,rgba(191,146,80,0.10)_0_1px,transparent_1px_10px)]"
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={url}
          onError={() => setFailedUrl(url)}
          unoptimized={!isOptimizableImage(url)}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <ImageOff
          aria-hidden="true"
          className="size-4 text-[#7A5A2C]/70"
          strokeWidth={1.6}
        />
      )}
    </span>
  );
}

function PhotoCoverage({ product }: { product: AdminProduct }) {
  const { withPhoto, total } = photoCoverage(product);
  if (total === 0)
    return <span className="font-sans text-sm text-secondary/45">—</span>;
  const complete = withPhoto === total;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans text-xs tabular-nums",
        complete
          ? "border-secondary/10 bg-secondary/5 text-secondary/70"
          : "border-dashed border-tertiary/70 bg-quaternary/25 text-secondary",
      )}
    >
      {withPhoto}/{total}
      <span className="sr-only">variantes con foto</span>
    </span>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSortChange,
  className,
}: {
  label: string;
  sortKey: ProductSortKey;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  className?: string;
}) {
  const isActive = sort.key === sortKey;
  const Icon = sort.direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={
        isActive
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      className={cn("text-xs leading-none font-normal", className)}
    >
      <button
        type="button"
        onClick={() =>
          onSortChange({
            key: sortKey,
            direction: isActive && sort.direction === "asc" ? "desc" : "asc",
          })
        }
        className={cn(
          "-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-full px-1 font-sans leading-none text-xs tracking-[0.12em] uppercase transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
          isActive ? "text-secondary" : "text-secondary/55",
        )}
      >
        {label}
        <Icon
          aria-hidden="true"
          className={cn("size-3", !isActive && "opacity-0")}
        />
      </button>
    </th>
  );
}

function ProductMenu({
  product,
  handlers,
}: {
  product: AdminProduct;
  handlers: ProductRowHandlers;
}) {
  return (
    <OptionsMenu
      label={`Opciones de ${product.name}`}
      trigger={
        <button
          type="button"
          className="grid size-9 cursor-pointer place-items-center rounded-full text-secondary/60 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          <Ellipsis className="size-4.5" />
        </button>
      }
      options={[
        {
          key: "open",
          icon: PanelRightOpen,
          label: "Abrir detalle",
          onSelect: () => handlers.onOpen(product.id),
        },
        {
          key: "variant",
          icon: Plus,
          label: "Agregar variante",
          onSelect: () => handlers.onAddVariant(product),
        },
        {
          key: "toggle",
          icon: Power,
          label: product.isActive ? "Desactivar producto" : "Activar producto",
          onSelect: () => handlers.onToggleActive(product, !product.isActive),
        },
        {
          key: "delete",
          icon: Trash2,
          label: "Eliminar producto",
          tone: "danger",
          separated: true,
          onSelect: () => handlers.onDelete(product),
        },
      ]}
    />
  );
}

function VariantShelf({
  product,
  uploadingVariantIds,
  handlers,
}: {
  product: AdminProduct;
  uploadingVariantIds: ReadonlySet<string>;
  handlers: ProductRowHandlers;
}) {
  return (
    <div
      id={`variants-${product.id}`}
      className="flex flex-col gap-2 rounded-[1.5rem] border border-tertiary/30 bg-white/40 p-2 sm:p-3"
    >
      {product.variants.length === 0 ? (
        <p className="px-2 py-3 font-sans text-sm text-secondary/65">
          Aún no tiene variantes. Agrega al menos una con marca, presentación y
          precio para que aparezca en la web.
        </p>
      ) : (
        <ul
          className="flex flex-col gap-1"
          aria-label={`Variantes de ${product.name}`}
        >
          {product.variants.map((variant) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              isUploading={uploadingVariantIds.has(variant.id)}
              handlers={handlers.variant}
            />
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-tertiary/20 px-1 pt-2">
        <button
          type="button"
          onClick={() => handlers.onAddVariant(product)}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          <Plus className="size-4" strokeWidth={2} />
          Agregar variante
        </button>
        <button
          type="button"
          onClick={() => handlers.onOpen(product.id)}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 font-sans text-sm text-secondary/70 transition-colors hover:bg-secondary/5 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          <PanelRightOpen className="size-4" strokeWidth={1.8} />
          Descripción, etiquetas y más
        </button>
      </div>
    </div>
  );
}

function ExpandButton({
  product,
  isExpanded,
  onToggle,
}: {
  product: AdminProduct;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-controls={`variants-${product.id}`}
      aria-label={
        isExpanded
          ? `Cerrar variantes de ${product.name}`
          : `Ver variantes de ${product.name}`
      }
      onClick={onToggle}
      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/60 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
    >
      <ChevronDown
        className={cn(
          "size-4.5 transition-transform duration-200 ease-out",
          isExpanded && "rotate-180",
        )}
      />
    </button>
  );
}

export function ProductsTable({
  products,
  expandedIds,
  selectedId,
  uploadingVariantIds,
  sort,
  onSortChange,
  handlers,
}: ProductsTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[2rem] border border-tertiary/25 bg-[#FCF6EB] md:block">
        <table className="w-full border-collapse">
          <caption className="sr-only">Productos</caption>
          <thead>
            <tr className="border-b border-tertiary/25 text-left">
              <th scope="col" className="w-12 py-3 pl-4">
                <span className="sr-only">Variantes</span>
              </th>
              <SortHeader
                label="Producto"
                sortKey="name"
                sort={sort}
                onSortChange={onSortChange}
                className="py-3 pr-3"
              />
              <th
                scope="col"
                className="hidden py-3 pr-3 font-sans text-xs leading-none font-normal tracking-[0.12em] text-secondary/55 uppercase lg:table-cell"
              >
                Categoría
              </th>
              <SortHeader
                label="Precio"
                sortKey="price"
                sort={sort}
                onSortChange={onSortChange}
                className="py-3 pr-3"
              />
              <th
                scope="col"
                className="py-3 pr-3 font-sans text-xs leading-none font-normal tracking-[0.12em] text-secondary/55 uppercase"
              >
                Fotos
              </th>
              <SortHeader
                label="Editado"
                sortKey="updatedAt"
                sort={sort}
                onSortChange={onSortChange}
                className="hidden py-3 pr-3 xl:table-cell"
              />
              <th
                scope="col"
                className="py-3 pr-4 text-right font-sans text-xs leading-none font-normal tracking-[0.12em] text-secondary/55 uppercase"
              >
                A la venta
              </th>
            </tr>
          </thead>
          {products.map((product) => {
            const isExpanded = expandedIds.has(product.id);
            const price = formatPriceRangePesos(priceRangePesos(product));
            const brands = brandsOf(product);
            return (
              <tbody
                key={product.id}
                className={cn(
                  "border-b border-tertiary/15 last:border-b-0",
                  isExpanded && "bg-quaternary/[0.12]",
                  selectedId === product.id && "bg-quaternary/20",
                )}
              >
                <tr className="group">
                  <td className="py-3 pl-4 align-middle">
                    <ExpandButton
                      product={product}
                      isExpanded={isExpanded}
                      onToggle={() => handlers.onToggleExpanded(product.id)}
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Cover product={product} size={44} />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => handlers.onOpen(product.id)}
                          className={cn(
                            "block max-w-full cursor-pointer truncate text-left font-sans text-[15px] font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
                            product.isActive
                              ? "text-secondary"
                              : "text-secondary/55",
                          )}
                        >
                          {product.name}
                        </button>
                        <p className="truncate font-sans text-xs text-secondary/60">
                          {brands.length > 0 ? brands.join(" · ") : "Sin marca"}
                          {" · "}
                          {product.variants.length}{" "}
                          {product.variants.length === 1
                            ? "variante"
                            : "variantes"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-3 font-sans text-sm text-secondary/75 lg:table-cell">
                    {product.category.name}
                  </td>
                  <td className="py-3 pr-3 font-sans text-sm whitespace-nowrap text-secondary tabular-nums">
                    {price ?? (
                      <span className="rounded-full border border-dashed border-tertiary/70 px-2.5 py-0.5 text-xs text-secondary/75">
                        Sin variantes
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    <PhotoCoverage product={product} />
                  </td>
                  <td className="hidden py-3 pr-3 font-sans text-sm text-secondary/60 tabular-nums xl:table-cell">
                    {UPDATED_FORMAT.format(new Date(product.updatedAt))}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <CatalogSwitch
                        checked={product.isActive}
                        label={
                          product.isActive
                            ? `Desactivar ${product.name}`
                            : `Activar ${product.name}`
                        }
                        onChange={(next) =>
                          handlers.onToggleActive(product, next)
                        }
                      />
                      <ProductMenu product={product} handlers={handlers} />
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={7} className="px-4 pb-4">
                      <VariantShelf
                        product={product}
                        uploadingVariantIds={uploadingVariantIds}
                        handlers={handlers}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden" aria-label="Productos">
        {products.map((product) => {
          const isExpanded = expandedIds.has(product.id);
          const price = formatPriceRangePesos(priceRangePesos(product));
          return (
            <li
              key={product.id}
              className={cn(
                "flex flex-col gap-3 rounded-[1.5rem] border p-3",
                product.isActive
                  ? "border-tertiary/30 bg-[#FCF6EB]"
                  : "border-dashed border-secondary/20 bg-primary/60",
              )}
            >
              <div className="flex items-start gap-3">
                <Cover product={product} size={56} />
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handlers.onOpen(product.id)}
                    className={cn(
                      "block max-w-full cursor-pointer text-left font-sans text-[15px] leading-snug font-semibold",
                      product.isActive ? "text-secondary" : "text-secondary/55",
                    )}
                  >
                    {product.name}
                  </button>
                  <p className="font-sans text-xs text-secondary/60">
                    {product.category.name}
                  </p>
                  <p className="mt-1 font-sans text-sm text-secondary tabular-nums">
                    {price ?? "Sin variantes"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <CatalogSwitch
                    checked={product.isActive}
                    label={
                      product.isActive
                        ? `Desactivar ${product.name}`
                        : `Activar ${product.name}`
                    }
                    onChange={(next) => handlers.onToggleActive(product, next)}
                  />
                  <ProductMenu product={product} handlers={handlers} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <PhotoCoverage product={product} />
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`variants-${product.id}`}
                  onClick={() => handlers.onToggleExpanded(product.id)}
                  className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 font-sans text-sm text-secondary/75 transition-colors hover:bg-secondary/5"
                >
                  {isExpanded ? "Ocultar variantes" : "Variantes y fotos"}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>
              </div>
              {isExpanded && (
                <VariantShelf
                  product={product}
                  uploadingVariantIds={uploadingVariantIds}
                  handlers={handlers}
                />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

const UPDATED_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "numeric",
  month: "short",
});
