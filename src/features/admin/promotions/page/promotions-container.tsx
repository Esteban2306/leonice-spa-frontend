"use client";

import { useMemo, useState } from "react";

import { useAdminCategories } from "@/src/features/admin/hooks/use-categories";
import { useCatalogActions } from "@/src/features/admin/hooks/use-catalog-actions";
import {
  useAdminProductCategories,
  useAdminProducts,
} from "@/src/features/admin/hooks/use-products";
import { usePromotions } from "@/src/features/admin/hooks/use-promotions";
import { useAdminTreatments } from "@/src/features/admin/hooks/use-treatments";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "@/src/features/admin/services/components/confirm-toggle-dialog";
import { PromotionDialog } from "@/src/features/admin/services/components/promotion-dialog";
import type { Promotion } from "@/src/features/admin/types/promotions.types";
import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";

import {
  countPromotionsByState,
  filterPromotions,
  filterPromotionsByDomain,
  type PromotionDomainFilter,
  type PromotionFilter,
} from "../lib/promotions-page";
import { PromotionsView } from "./promotions-view";

const ALL_STATUSES = { status: "ALL" } as const;

interface DialogState {
  open: boolean;
  version: number;
  promotion: Promotion | null;
}

const CLOSED: DialogState = {
  open: false,
  version: 0,
  promotion: null,
};

export function PromotionsContainer() {
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));
  const [filter, setFilter] = useState<PromotionFilter>("ALL");
  const [domain, setDomain] = useState<PromotionDomainFilter>("ALL");
  const [dialog, setDialog] = useState<DialogState>(CLOSED);
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );

  const promotionsQuery = usePromotions();
  const categoriesQuery = useAdminCategories(ALL_STATUSES);
  const treatmentsQuery = useAdminTreatments(ALL_STATUSES);
  const productCategoriesQuery = useAdminProductCategories();
  const productsQuery = useAdminProducts(ALL_STATUSES);
  const actions = useCatalogActions();

  const promotions = useMemo(
    () => promotionsQuery.data ?? [],
    [promotionsQuery.data],
  );
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const treatments = useMemo(
    () => treatmentsQuery.data ?? [],
    [treatmentsQuery.data],
  );

  const productCategories = useMemo(
    () => productCategoriesQuery.data ?? [],
    [productCategoriesQuery.data],
  );
  const products = useMemo(
    () => productsQuery.data ?? [],
    [productsQuery.data],
  );

  const inDomain = useMemo(
    () => filterPromotionsByDomain(promotions, domain),
    [promotions, domain],
  );
  const counts = useMemo(
    () => countPromotionsByState(inDomain, nowMs),
    [inDomain, nowMs],
  );
  const visible = useMemo(
    () => filterPromotions(inDomain, filter, nowMs),
    [inDomain, filter, nowMs],
  );

  const open = (promotion: Promotion | null) =>
    setDialog((current) => ({
      open: true,
      version: current.version + 1,
      promotion,
    }));

  return (
    <>
      <PromotionsView
        promotions={visible}
        counts={counts}
        filter={filter}
        domain={domain}
        onDomainChange={setDomain}
        isLoading={promotionsQuery.isLoading}
        isError={promotionsQuery.isError}
        nowMs={nowMs}
        onFilterChange={setFilter}
        onCreate={() => open(null)}
        onEdit={(promotion) => open(promotion)}
        onDeactivate={(promotion) =>
          setConfirmation({
            title: `Desactivar ${promotion.name}`,
            description:
              "El descuento deja de aplicarse de inmediato en el asistente y en las reservas nuevas.",
            submitLabel: "Desactivar promoción",
            onConfirm: () => actions.deactivatePromotion(promotion.id),
          })
        }
        onDelete={(promotion) =>
          setConfirmation({
            title: `¿Eliminar ${promotion.name}?`,
            description:
              "Se borra por completo y ya no aparecerá en el panel. Si estaba vigente, el descuento deja de aplicarse de inmediato. No se puede deshacer.",
            submitLabel: "Eliminar promoción",
            onConfirm: () => actions.removePromotion(promotion.id),
          })
        }
        onRetry={() => void promotionsQuery.refetch()}
      />

      <PromotionDialog
        key={`promotion-${dialog.version}`}
        open={dialog.open}
        target={null}
        choices={{
          categories: categories.map(({ id, name }) => ({ id, name })),
          treatments: treatments.map(({ id, name, categoryId }) => ({
            id,
            name,
            categoryId,
          })),
          productCategories: productCategories.map(({ id, name }) => ({
            id,
            name,
          })),
          products: products.map(({ id, name, kind, productCategoryId }) => ({
            id,
            name,
            kind,
            productCategoryId,
          })),
        }}
        promotion={dialog.promotion}
        todayKey={todayKey}
        onOpenChange={(next) =>
          setDialog((current) => ({ ...current, open: next }))
        }
        onSave={(data) =>
          dialog.promotion
            ? actions.updatePromotion(dialog.promotion.id, data)
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
