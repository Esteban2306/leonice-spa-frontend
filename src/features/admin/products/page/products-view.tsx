import type { ReactNode } from "react";
import { Plus, Tags } from "lucide-react";

import type {
  AdminProduct,
  AdminProductCategory,
} from "@/src/features/admin/types/products.types";

import type { ProductFilters, ProductTotals } from "../lib/product-catalog";
import { ProductsKpis, ProductsToolbar } from "../components/products-filters";
import {
  ProductsTable,
  type ProductRowHandlers,
  type ProductSort,
} from "../components/products-table";

export interface ProductsViewProps {
  products: readonly AdminProduct[];
  categories: readonly AdminProductCategory[];
  totals: ProductTotals;
  filters: ProductFilters;
  hasFilters: boolean;
  isLoading: boolean;
  isError: boolean;
  expandedIds: ReadonlySet<string>;
  selectedId: string | null;
  uploadingVariantIds: ReadonlySet<string>;
  sort: ProductSort;
  handlers: ProductRowHandlers;
  onSortChange: (sort: ProductSort) => void;
  onFiltersChange: (patch: Partial<ProductFilters>) => void;
  onResetFilters: () => void;
  onCreateProduct: () => void;
  onManageTaxonomy: () => void;
  onRetry: () => void;
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-tertiary/50 px-6 py-12 text-center">
      <p className="font-heading text-2xl text-secondary">{title}</p>
      <p className="max-w-md font-sans text-sm text-secondary/65">{body}</p>
      {action}
    </div>
  );
}

const PRIMARY_BUTTON =
  "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-secondary px-6 font-sans text-sm text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function ProductsView(props: ProductsViewProps) {
  const hasCategories = props.categories.length > 0;

  let content: ReactNode;
  if (props.isLoading && props.products.length === 0) {
    content = (
      <div
        className="flex flex-col gap-2 rounded-[2rem] border border-tertiary/25 bg-[#FCF6EB] p-4"
        aria-busy="true"
        aria-label="Cargando productos"
      >
        {[0, 1, 2, 3, 4].map((key) => (
          <div key={key} className="flex items-center gap-3 py-2">
            <div className="size-11 animate-pulse rounded-xl bg-secondary/8" />
            <div className="h-4 flex-1 animate-pulse rounded-full bg-secondary/8" />
            <div className="hidden h-4 w-28 animate-pulse rounded-full bg-secondary/8 sm:block" />
          </div>
        ))}
      </div>
    );
  } else if (!hasCategories && !props.isLoading) {
    content = (
      <EmptyState
        title="Primero, una categoría"
        body="Los productos se agrupan por categoría en la web (por ejemplo Cuidado capilar). Crea la primera y luego agrega tus productos."
        action={
          <button
            type="button"
            onClick={props.onManageTaxonomy}
            className={PRIMARY_BUTTON}
          >
            <Tags className="size-4" strokeWidth={1.8} />
            Crear categoría
          </button>
        }
      />
    );
  } else if (props.products.length === 0 && props.hasFilters) {
    content = (
      <EmptyState
        title="Nada coincide"
        body="Ningún producto cumple estos filtros. Prueba con otra búsqueda o quítalos."
        action={
          <button
            type="button"
            onClick={props.onResetFilters}
            className="h-11 cursor-pointer rounded-full border border-secondary/20 px-6 font-sans text-sm text-secondary hover:bg-secondary/5"
          >
            Quitar filtros
          </button>
        }
      />
    );
  } else if (props.products.length === 0) {
    content = (
      <EmptyState
        title="Aún no hay productos"
        body="Crea el primero con su marca, presentación y precio. Después súbele una foto a cada variante desde esta tabla."
        action={
          <button
            type="button"
            onClick={props.onCreateProduct}
            className={PRIMARY_BUTTON}
          >
            <Plus className="size-4" strokeWidth={2} />
            Nuevo producto
          </button>
        }
      />
    );
  } else {
    content = (
      <ProductsTable
        products={props.products}
        expandedIds={props.expandedIds}
        selectedId={props.selectedId}
        uploadingVariantIds={props.uploadingVariantIds}
        sort={props.sort}
        onSortChange={props.onSortChange}
        handlers={props.handlers}
      />
    );
  }

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">Productos</h1>
            <p className="mt-2 hidden max-w-xl font-sans text-sm text-primary/70 sm:block">
              Lo que vendes en el spa, con sus marcas, presentaciones, precios y
              fotos. Solo los productos activos se muestran en la web.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={props.onManageTaxonomy}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-primary/25 px-5 font-sans text-sm text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            >
              <Tags className="size-4" strokeWidth={1.8} />
              Categorías y etiquetas
            </button>
            <button
              type="button"
              onClick={props.onCreateProduct}
              disabled={!hasCategories}
              title={hasCategories ? undefined : "Crea primero una categoría"}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" strokeWidth={2} />
              Nuevo producto
            </button>
          </div>
        </header>

        <ProductsKpis
          totals={props.totals}
          filters={props.filters}
          onApply={props.onFiltersChange}
        />

        <ProductsToolbar
          filters={props.filters}
          categories={props.categories}
          resultCount={props.isLoading ? null : props.products.length}
          hasFilters={props.hasFilters}
          onChange={props.onFiltersChange}
          onReset={props.onResetFilters}
        />

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudieron cargar los productos.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {content}
      </div>
    </main>
  );
}
