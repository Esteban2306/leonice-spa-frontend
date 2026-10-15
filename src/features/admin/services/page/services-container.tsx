"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import { useCapacityPools } from "@/src/features/admin/hooks/use-capacity-pools";
import { useCatalogActions } from "@/src/features/admin/hooks/use-catalog-actions";
import { useAdminCategories } from "@/src/features/admin/hooks/use-categories";
import { useDebouncedValue } from "@/src/features/admin/hooks/use-debounced-value";
import { usePromotions } from "@/src/features/admin/hooks/use-promotions";
import { useAdminTreatments } from "@/src/features/admin/hooks/use-treatments";
import type { CapacityPool } from "@/src/features/admin/types/capacity-pools.types";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";
import type { Promotion } from "@/src/features/admin/types/promotions.types";
import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";

import { CapacityDialog } from "../components/capacity-dialog";
import { CategoryDialog } from "../components/category-dialog";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "../components/confirm-toggle-dialog";
import { CreateTreatmentDialog } from "../components/create-treatment-dialog";
import {
  PromotionDialog,
  type PromotionTargetOptions,
} from "../components/promotion-dialog";
import type { StationHandlers } from "../components/station-column";
import {
  TreatmentDrawer,
  type DrawerFocus,
} from "../components/treatment-drawer";
import {
  DEFAULT_FILTERS,
  buildTreatmentParams,
  countActiveFilters,
  groupTreatmentsByCategory,
  promotionsForTreatment,
  type CatalogFilters,
} from "../lib/catalog";
import { ServicesView } from "./services-view";

const TEXT_DEBOUNCE_MS = 350;
const ALL_STATUSES = { status: "ALL" } as const;
const CURRENT_PROMOTIONS = { validity: "CURRENT", isActive: true } as const;

interface DialogState<T> {
  open: boolean;
  value: T;
  version: number;
}

function closed<T>(value: T, version: number): DialogState<T> {
  return { open: false, value, version };
}

export function ServicesContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));

  const [filters, setFilters] = useState<CatalogFilters>(() => ({
    ...DEFAULT_FILTERS,
    q: searchParams.get("q") ?? "",
  }));
  const [mobileStationId, setMobileStationId] = useState<string | null>(null);
  const [drawerFocus, setDrawerFocus] = useState<DrawerFocus>("details");
  const [pinnedTreatment, setPinnedTreatment] = useState<AdminTreatment | null>(
    null,
  );
  const [busyTreatmentIds, setBusyTreatmentIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );
  const [createTreatment, setCreateTreatment] = useState(closed("", 0));
  const [categoryDialog, setCategoryDialog] = useState(
    closed<AdminCategory | null>(null, 0),
  );
  const [capacityCategoryId, setCapacityCategoryId] = useState<string | null>(
    null,
  );
  const [promotionDialog, setPromotionDialog] = useState(
    closed<{
      target: PromotionTargetOptions | null;
      promotion: Promotion | null;
    }>({ target: null, promotion: null }, 0),
  );

  const selectedTreatmentId = searchParams.get("servicio");

  const textFilters = {
    q: filters.q,
    priceMinPesos: filters.priceMinPesos,
    priceMaxPesos: filters.priceMaxPesos,
    durationMin: filters.durationMin,
    durationMax: filters.durationMax,
  };
  const debouncedText = useDebouncedValue(
    textFilters,
    TEXT_DEBOUNCE_MS,
    JSON.stringify(textFilters),
  );
  const treatmentParams = useMemo(
    () => buildTreatmentParams({ ...filters, ...debouncedText }),
    [filters, debouncedText],
  );

  const categoriesQuery = useAdminCategories(ALL_STATUSES);
  const poolsQuery = useCapacityPools(ALL_STATUSES);
  const treatmentsQuery = useAdminTreatments(treatmentParams);
  const currentPromotionsQuery = usePromotions(CURRENT_PROMOTIONS);
  const actions = useCatalogActions();

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const treatments = useMemo(
    () => treatmentsQuery.data ?? [],
    [treatmentsQuery.data],
  );
  const pools = useMemo(() => poolsQuery.data ?? [], [poolsQuery.data]);

  const treatmentsByCategory = useMemo(
    () => groupTreatmentsByCategory(treatments),
    [treatments],
  );
  const poolsByCategory = useMemo(() => {
    const groups = new Map<string, CapacityPool[]>();
    for (const pool of pools) {
      groups.set(pool.categoryId, [
        ...(groups.get(pool.categoryId) ?? []),
        pool,
      ]);
    }
    return groups;
  }, [pools]);

  const selectedFromList = selectedTreatmentId
    ? (treatments.find((t) => t.id === selectedTreatmentId) ?? null)
    : null;
  if (selectedFromList && selectedFromList !== pinnedTreatment) {
    setPinnedTreatment(selectedFromList);
  }
  const selectedTreatment =
    selectedFromList ??
    (pinnedTreatment && pinnedTreatment.id === selectedTreatmentId
      ? pinnedTreatment
      : null);

  const drawerPromotionsQuery = usePromotions(
    selectedTreatment
      ? { withinCategoryId: selectedTreatment.categoryId }
      : undefined,
    { enabled: selectedTreatment !== null },
  );
  const drawerPromotions = useMemo(
    () =>
      selectedTreatment
        ? promotionsForTreatment(
            drawerPromotionsQuery.data ?? [],
            selectedTreatment,
          )
        : [],
    [drawerPromotionsQuery.data, selectedTreatment],
  );

  const effectiveMobileStationId =
    mobileStationId && categories.some((c) => c.id === mobileStationId)
      ? mobileStationId
      : (categories[0]?.id ?? null);

  const totals = useMemo(() => {
    const activeCategoryIds = new Set(
      categories.filter((c) => c.isActive).map((c) => c.id),
    );
    return {
      activeTreatments: categories.reduce(
        (sum, c) => sum + c.activeTreatmentCount,
        0,
      ),
      inactiveTreatments: categories.reduce(
        (sum, c) => sum + (c.treatmentCount - c.activeTreatmentCount),
        0,
      ),
      activeStations: activeCategoryIds.size,
      totalCapacity: pools
        .filter(
          (pool) => pool.isActive && activeCategoryIds.has(pool.categoryId),
        )
        .reduce((sum, pool) => sum + pool.maxConcurrent, 0),
      currentPromotions: currentPromotionsQuery.data?.length ?? 0,
    };
  }, [categories, pools, currentPromotionsQuery.data]);

  const replaceParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const changeFilters = (patch: Partial<CatalogFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    if (patch.q !== undefined) replaceParams({ q: patch.q.trim() || null });
  };

  const openTreatment = (
    treatmentId: string,
    focus: DrawerFocus = "details",
  ) => {
    setDrawerFocus(focus);
    replaceParams({ servicio: treatmentId });
  };

  const markBusy = (id: string, busy: boolean) =>
    setBusyTreatmentIds((current) => {
      const next = new Set(current);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  const setTreatmentActive = async (
    treatment: AdminTreatment,
    isActive: boolean,
  ) => {
    markBusy(treatment.id, true);
    const ok = await actions.setTreatmentActive(treatment.id, isActive);
    markBusy(treatment.id, false);
    return ok;
  };

  const toggleTreatment = (treatment: AdminTreatment, isActive: boolean) => {
    if (isActive) {
      void setTreatmentActive(treatment, true);
      return;
    }
    setConfirmation({
      title: `Desactivar ${treatment.name}`,
      description:
        treatment.reservationCount > 0
          ? `Deja de ofrecerse en el bot y el calendario. Sus ${treatment.reservationCount} reservas registradas se conservan.`
          : "Deja de ofrecerse en el bot y el calendario. Puedes activarlo de nuevo cuando quieras.",
      submitLabel: "Desactivar servicio",
      onConfirm: () => setTreatmentActive(treatment, false),
    });
  };

  const toggleCategory = (category: AdminCategory, isActive: boolean) => {
    if (isActive) {
      void actions.setCategoryActive(category.id, true);
      return;
    }
    setConfirmation({
      title: `Desactivar ${category.name}`,
      description: `Ninguno de sus ${category.activeTreatmentCount} servicios activos se podrá reservar mientras la categoría esté inactiva.`,
      submitLabel: "Desactivar categoría",
      onConfirm: () => actions.setCategoryActive(category.id, false),
    });
  };

  const openPromotion = (
    target: PromotionTargetOptions | null,
    promotion: Promotion | null,
  ) =>
    setPromotionDialog((current) => ({
      open: true,
      value: { target, promotion },
      version: current.version + 1,
    }));

  const promotionTargetFor = (
    treatment: AdminTreatment,
  ): PromotionTargetOptions => ({
    treatment: { id: treatment.id, name: treatment.name },
    category: { id: treatment.category.id, name: treatment.category.name },
  });

  const handlers: StationHandlers = {
    onOpenTreatment: (id) => openTreatment(id),
    onEditTreatment: (treatment) => openTreatment(treatment.id),
    onHairPricing: (treatment) => openTreatment(treatment.id, "hair"),
    onCreatePromotion: (treatment) =>
      openPromotion(promotionTargetFor(treatment), null),
    onToggleTreatment: toggleTreatment,
    onCreateTreatment: (categoryId) =>
      setCreateTreatment((current) => ({
        open: true,
        value: categoryId,
        version: current.version + 1,
      })),
    onEditCategory: (category) =>
      setCategoryDialog((current) => ({
        open: true,
        value: category,
        version: current.version + 1,
      })),
    onManageCapacity: (category) => setCapacityCategoryId(category.id),
    onToggleCategory: toggleCategory,
    onCommitCapacity: (poolId, maxConcurrent) =>
      actions.updateCapacityPool(poolId, { maxConcurrent }),
  };

  const capacityCategory =
    categories.find((c) => c.id === capacityCategoryId) ?? null;
  const categoryForDialog = categoryDialog.value;

  return (
    <>
      <ServicesView
        categories={categories}
        poolsByCategory={poolsByCategory}
        treatmentsByCategory={treatmentsByCategory}
        totals={totals}
        filters={filters}
        hasFilters={
          countActiveFilters(filters) > 0 || filters.q.trim().length >= 2
        }
        resultCount={treatmentsQuery.data ? treatments.length : null}
        isLoading={categoriesQuery.isLoading || treatmentsQuery.isLoading}
        isFetching={treatmentsQuery.isFetching}
        isError={
          categoriesQuery.isError ||
          treatmentsQuery.isError ||
          poolsQuery.isError
        }
        mobileStationId={effectiveMobileStationId}
        selectedTreatmentId={selectedTreatment?.id ?? null}
        busyTreatmentIds={busyTreatmentIds}
        handlers={handlers}
        onFiltersChange={changeFilters}
        onResetFilters={() => changeFilters({ ...DEFAULT_FILTERS })}
        onMobileStationChange={setMobileStationId}
        onCreateCategory={() =>
          setCategoryDialog((current) => ({
            open: true,
            value: null,
            version: current.version + 1,
          }))
        }
        onCreateTreatment={() =>
          handlers.onCreateTreatment(effectiveMobileStationId ?? "")
        }
        onRetry={() => {
          void categoriesQuery.refetch();
          void treatmentsQuery.refetch();
          void poolsQuery.refetch();
        }}
        onManageStations={() =>
          document
            .getElementById("estaciones")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <TreatmentDrawer
        treatment={selectedTreatment}
        focus={drawerFocus}
        categories={categories}
        promotions={drawerPromotions}
        isPromotionsLoading={drawerPromotionsQuery.isLoading}
        isSaving={actions.isSaving}
        isVideoUploading={actions.isVideoUploading}
        nowMs={nowMs}
        onClose={() => replaceParams({ servicio: null })}
        onSave={actions.updateTreatment}
        onToggleActive={toggleTreatment}
        onSaveHairPricing={actions.saveHairPricing}
        onUploadVideo={actions.uploadTreatmentVideo}
        onRemoveVideo={actions.removeTreatmentVideo}
        onCreatePromotion={(treatment) =>
          openPromotion(promotionTargetFor(treatment), null)
        }
        onEditPromotion={(promotion) =>
          openPromotion(
            selectedTreatment ? promotionTargetFor(selectedTreatment) : null,
            promotion,
          )
        }
        onDeactivatePromotion={(promotion) =>
          setConfirmation({
            title: `Desactivar ${promotion.name}`,
            description:
              "El descuento deja de aplicarse de inmediato en el bot y en las reservas nuevas.",
            submitLabel: "Desactivar promoción",
            onConfirm: () => actions.deactivatePromotion(promotion.id),
          })
        }
      />

      <CreateTreatmentDialog
        key={`create-${createTreatment.version}`}
        open={createTreatment.open}
        defaultCategoryId={createTreatment.value}
        categories={categories}
        onOpenChange={(open) =>
          setCreateTreatment((current) => ({ ...current, open }))
        }
        onCreate={async (data) => {
          const created = await actions.createTreatment(data);
          if (created) {
            if (filters.status === "INACTIVE")
              changeFilters({ status: "ACTIVE" });
            openTreatment(created.id);
          }
          return created !== null;
        }}
      />

      <CategoryDialog
        key={`category-${categoryDialog.version}`}
        open={categoryDialog.open}
        category={categoryForDialog}
        onOpenChange={(open) =>
          setCategoryDialog((current) => ({ ...current, open }))
        }
        onSave={(data) =>
          categoryForDialog
            ? actions.updateCategory(categoryForDialog.id, data)
            : actions.createCategory(data)
        }
      />

      <CapacityDialog
        key={`capacity-${capacityCategoryId ?? "none"}`}
        category={capacityCategory}
        pools={
          capacityCategory
            ? (poolsByCategory.get(capacityCategory.id) ?? [])
            : []
        }
        onClose={() => setCapacityCategoryId(null)}
        onCreate={(name, maxConcurrent) =>
          capacityCategory
            ? actions.createCapacityPool({
                categoryId: capacityCategory.id,
                name,
                maxConcurrent,
              })
            : Promise.resolve(false)
        }
        onUpdate={(poolId, name, maxConcurrent) =>
          actions.updateCapacityPool(poolId, { name, maxConcurrent })
        }
        onToggle={actions.setCapacityPoolActive}
      />

      <PromotionDialog
        key={`promotion-${promotionDialog.version}`}
        open={promotionDialog.open}
        target={promotionDialog.value.target}
        promotion={promotionDialog.value.promotion}
        todayKey={todayKey}
        onOpenChange={(open) =>
          setPromotionDialog((current) => ({ ...current, open }))
        }
        onSave={(data) =>
          promotionDialog.value.promotion
            ? actions.updatePromotion(promotionDialog.value.promotion.id, data)
            : actions.createPromotion(data)
        }
      />

      <ConfirmToggleDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}
