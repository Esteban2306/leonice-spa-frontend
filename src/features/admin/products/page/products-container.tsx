"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebouncedValue } from "@/src/features/admin/hooks/use-debounced-value";
import { useProductActions } from "@/src/features/admin/hooks/use-product-actions";
import {
  useAdminProduct,
  useAdminProductCategories,
  useAdminProductTags,
  useAdminProducts,
} from "@/src/features/admin/hooks/use-products";
import { useAdminTreatments } from "@/src/features/admin/hooks/use-treatments";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "@/src/features/admin/services/components/confirm-toggle-dialog";
import type {
  AdminProduct,
  FindAdminProductsParams,
  ProductVariant,
} from "@/src/features/admin/types/products.types";

import { CreateProductDialog } from "../components/create-product-dialog";
import {
  ProductDrawer,
  type TreatmentOption,
} from "../components/product-drawer";
import type {
  ProductRowHandlers,
  ProductSort,
} from "../components/products-table";
import { TaxonomySheet } from "../components/taxonomy-sheet";
import {
  VariantDialog,
  type VariantDialogTarget,
} from "../components/variant-dialog";
import type { VariantHandlers } from "../components/variant-row";
import { variantLabel } from "../components/variant-row";
import {
  DEFAULT_PRODUCT_FILTERS,
  matchesQuickFilter,
  priceRangePesos,
  productTotals,
  type ProductFilters,
} from "../lib/product-catalog";
import { ProductsView } from "./products-view";

const TEXT_DEBOUNCE_MS = 350;
const ALL_PRODUCTS: FindAdminProductsParams = { status: "ALL" };
const ALL_TREATMENTS = { status: "ALL" } as const;
const SELECTED_PARAM = "producto";

function sortProducts(
  products: readonly AdminProduct[],
  sort: ProductSort,
): AdminProduct[] {
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...products].sort((a, b) => {
    if (sort.key === "price") {
      const pa = priceRangePesos(a)?.min ?? Number.POSITIVE_INFINITY;
      const pb = priceRangePesos(b)?.min ?? Number.POSITIVE_INFINITY;
      if (pa !== pb) return (pa - pb) * factor;
    }
    if (sort.key === "updatedAt") {
      const diff = Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
      if (diff !== 0) return diff * factor;
    }
    return (
      a.name.localeCompare(b.name, "es") * (sort.key === "name" ? factor : 1)
    );
  });
}

export function ProductsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get(SELECTED_PARAM);

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    ...DEFAULT_PRODUCT_FILTERS,
    q: searchParams.get("q") ?? "",
  }));
  const [sort, setSort] = useState<ProductSort>({
    key: "name",
    direction: "asc",
  });
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [createVersion, setCreateVersion] = useState<number | null>(null);
  const [variantTarget, setVariantTarget] =
    useState<VariantDialogTarget | null>(null);
  const [taxonomyOpen, setTaxonomyOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );

  const debouncedQ = useDebouncedValue(filters.q, TEXT_DEBOUNCE_MS, filters.q);
  const listParams = useMemo<FindAdminProductsParams>(
    () => ({
      status: filters.status,
      ...(debouncedQ.trim() ? { q: debouncedQ.trim() } : {}),
      ...(filters.productCategoryId
        ? { productCategoryId: filters.productCategoryId }
        : {}),
    }),
    [filters.status, filters.productCategoryId, debouncedQ],
  );

  const productsQuery = useAdminProducts(listParams);
  const allProductsQuery = useAdminProducts(ALL_PRODUCTS);
  const categoriesQuery = useAdminProductCategories();
  const tagsQuery = useAdminProductTags();
  const detailQuery = useAdminProduct(selectedId);
  const treatmentsQuery = useAdminTreatments(ALL_TREATMENTS);
  const actions = useProductActions();

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const tags = useMemo(() => tagsQuery.data ?? [], [tagsQuery.data]);
  const allProducts = useMemo(
    () => allProductsQuery.data ?? [],
    [allProductsQuery.data],
  );
  const products = useMemo(
    () =>
      sortProducts(
        (productsQuery.data ?? []).filter((product) =>
          matchesQuickFilter(product, filters.quick),
        ),
        sort,
      ),
    [productsQuery.data, filters.quick, sort],
  );
  const totals = useMemo(() => productTotals(allProducts), [allProducts]);
  const treatments = useMemo<TreatmentOption[]>(
    () =>
      (treatmentsQuery.data ?? []).map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
        categoryName: treatment.category.name,
        isActive: treatment.isActive,
      })),
    [treatmentsQuery.data],
  );

  const selectedProduct =
    (selectedId &&
      (allProducts.find((product) => product.id === selectedId) ??
        products.find((product) => product.id === selectedId) ??
        detailQuery.data)) ||
    null;
  const selectedDetail =
    detailQuery.data && detailQuery.data.id === selectedId
      ? detailQuery.data
      : null;

  const hasFilters =
    filters.q.trim() !== "" ||
    filters.status !== DEFAULT_PRODUCT_FILTERS.status ||
    filters.productCategoryId !== "" ||
    filters.quick !== "all";

  const setSelected = (productId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (productId) params.set(SELECTED_PARAM, productId);
    else params.delete(SELECTED_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const findProduct = (productId: string) =>
    allProducts.find((product) => product.id === productId) ??
    products.find((product) => product.id === productId);

  const confirmDeleteProduct = (product: AdminProduct) => {
    const blocked =
      product._count.viewLogs > 0 || product._count.recommendations > 0;
    if (blocked) {
      setConfirmation({
        title: `No se puede borrar ${product.name}`,
        description:
          "Ya tiene historial (vistas de clientas o recomendaciones). Puedes desactivarlo para ocultarlo de la web sin perder ese historial.",
        submitLabel: product.isActive ? "Desactivar" : "Entendido",
        onConfirm: () =>
          product.isActive
            ? actions.setProductActive(product, false)
            : Promise.resolve(true),
      });
      return;
    }
    setConfirmation({
      title: `¿Eliminar ${product.name}?`,
      description: `Se borran sus ${product.variants.length} variantes, sus etiquetas y sus fotos. No se puede deshacer.`,
      submitLabel: "Eliminar producto",
      onConfirm: async () => {
        const ok = await actions.removeProduct(product.id);
        if (ok && selectedId === product.id) setSelected(null);
        return ok;
      },
    });
  };

  const variantHandlers: VariantHandlers = {
    onUploadImage: (variant, file) =>
      void actions.uploadVariantImage(variant.id, file),
    onRemoveImage: (variant) =>
      setConfirmation({
        title: "¿Quitar la foto?",
        description: `${variantLabel(variant)} quedará sin foto en la web.`,
        submitLabel: "Quitar foto",
        onConfirm: () => actions.removeVariantImage(variant.id),
      }),
    onChangePrice: (variant, pesos) =>
      actions.updateVariant(variant.id, { price: pesos }),
    onToggleActive: (variant, isActive) =>
      void actions.updateVariant(variant.id, { isActive }),
    onEdit: (variant: ProductVariant) => {
      const product = findProduct(variant.productId);
      if (product) setVariantTarget({ product, variant });
    },
    onDelete: (variant) =>
      setConfirmation({
        title: `¿Eliminar ${variantLabel(variant)}?`,
        description: variant.imageUrl
          ? "Se borra la variante y su foto. No se puede deshacer."
          : "Se borra la variante. No se puede deshacer.",
        submitLabel: "Eliminar variante",
        onConfirm: () => actions.removeVariant(variant.id),
      }),
  };

  const handlers: ProductRowHandlers = {
    onToggleExpanded: (productId) =>
      setExpandedIds((current) => {
        const next = new Set(current);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      }),
    onOpen: (productId) => setSelected(productId),
    onToggleActive: (product, isActive) =>
      void actions.setProductActive(product, isActive),
    onToggleFeatured: (product, isFeatured) =>
      void actions.updateProduct(product.id, { isFeatured }),
    onAddVariant: (product) => setVariantTarget({ product, variant: null }),
    onDelete: confirmDeleteProduct,
    variant: variantHandlers,
  };

  return (
    <>
      <ProductsView
        products={products}
        categories={categories}
        totals={totals}
        filters={filters}
        hasFilters={hasFilters}
        isLoading={productsQuery.isPending || categoriesQuery.isPending}
        isError={productsQuery.isError}
        expandedIds={expandedIds}
        selectedId={selectedId}
        uploadingVariantIds={actions.uploadingVariantIds}
        sort={sort}
        handlers={handlers}
        onSortChange={setSort}
        onFiltersChange={(patch) =>
          setFilters((current) => ({ ...current, ...patch }))
        }
        onResetFilters={() => setFilters(DEFAULT_PRODUCT_FILTERS)}
        onCreateProduct={() =>
          setCreateVersion((version) => (version ?? 0) + 1)
        }
        onManageTaxonomy={() => setTaxonomyOpen(true)}
        onRetry={() => void productsQuery.refetch()}
      />

      {createVersion !== null && (
        <CreateProductDialog
          key={createVersion}
          open
          categories={categories}
          defaultCategoryId={
            filters.productCategoryId ||
            (categories.filter((c) => c.isActive).length === 1
              ? (categories.find((c) => c.isActive)?.id ?? "")
              : "")
          }
          onOpenChange={(open) => !open && setCreateVersion(null)}
          onCreate={async (data, photos) => {
            const created = await actions.createProduct(data);
            if (created) {
              for (const photo of photos) {
                const variant = created.variants.find(
                  (item) =>
                    item.brand === photo.brand &&
                    item.presentation === photo.presentation,
                );
                if (variant)
                  await actions.uploadVariantImage(variant.id, photo.file);
              }
              setExpandedIds((current) => new Set(current).add(created.id));
              setSelected(created.id);
            }
            return created;
          }}
        />
      )}

      <VariantDialog
        target={variantTarget}
        onClose={() => setVariantTarget(null)}
        onSave={async (target, data) => {
          const ok = target.variant
            ? await actions.updateVariant(target.variant.id, data)
            : await actions.createVariant(target.product.id, data);
          if (ok) {
            setExpandedIds((current) =>
              new Set(current).add(target.product.id),
            );
            setVariantTarget(null);
          }
          return ok;
        }}
      />

      <ProductDrawer
        product={selectedProduct}
        detail={selectedDetail}
        categories={categories}
        tags={tags}
        treatments={treatments}
        uploadingVariantIds={actions.uploadingVariantIds}
        isSaving={actions.isSaving}
        variantHandlers={variantHandlers}
        onClose={() => setSelected(null)}
        onSave={actions.updateProduct}
        onToggleActive={(product, isActive) =>
          void actions.setProductActive(product, isActive)
        }
        onAddVariant={(product) => setVariantTarget({ product, variant: null })}
        onSaveTags={actions.saveProductTags}
        onCreateTag={actions.createTag}
        onAddRecommendation={actions.addRecommendation}
        onRemoveRecommendation={(recommendationId) =>
          void actions.removeRecommendation(recommendationId)
        }
        onDelete={confirmDeleteProduct}
      />

      <TaxonomySheet
        open={taxonomyOpen}
        categories={categories}
        tags={tags}
        onOpenChange={setTaxonomyOpen}
        onCreateCategory={async (name) =>
          (await actions.createCategory(name)) !== null
        }
        onRenameCategory={(id, name) => actions.updateCategory(id, { name })}
        onToggleCategory={(id, isActive) =>
          actions.updateCategory(id, { isActive })
        }
        onDeleteCategory={(category) =>
          setConfirmation({
            title: `¿Eliminar la categoría ${category.name}?`,
            description: "No tiene productos, así que se borra por completo.",
            submitLabel: "Eliminar categoría",
            onConfirm: () => actions.removeCategory(category.id),
          })
        }
        onCreateTag={async (name) => (await actions.createTag(name)) !== null}
        onRenameTag={(id, name) => actions.updateTag(id, { name })}
        onToggleTag={(id, isActive) => actions.updateTag(id, { isActive })}
        onDeleteTag={(tag) =>
          setConfirmation({
            title: `¿Eliminar la etiqueta ${tag.name}?`,
            description:
              tag.usage > 0
                ? `Se quitará de ${tag.usage === 1 ? "1 producto" : `${tag.usage} productos`}.`
                : "No la usa ningún producto.",
            submitLabel: "Eliminar etiqueta",
            onConfirm: () => actions.removeTag(tag.id),
          })
        }
      />

      <ConfirmToggleDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}
