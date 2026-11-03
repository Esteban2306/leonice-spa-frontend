"use client";

import { useMemo, useState } from "react";

import { useAdminCategories } from "@/src/features/admin/hooks/use-categories";
import { useCatalogActions } from "@/src/features/admin/hooks/use-catalog-actions";
import { usePromotions } from "@/src/features/admin/hooks/use-promotions";
import { useAdminTreatments } from "@/src/features/admin/hooks/use-treatments";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "@/src/features/admin/services/components/confirm-toggle-dialog";
import {
  PromotionDialog,
  type PromotionTargetOptions,
} from "@/src/features/admin/services/components/promotion-dialog";
import type { Promotion } from "@/src/features/admin/types/promotions.types";
import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";

import {
  countPromotionsByState,
  filterPromotions,
  type PromotionFilter,
} from "../lib/promotions-page";
import { PromotionsView } from "./promotions-view";

const ALL_STATUSES = { status: "ALL" } as const;

interface DialogState {
  open: boolean;
  version: number;
  promotion: Promotion | null;
  target: PromotionTargetOptions | null;
}

const CLOSED: DialogState = {
  open: false,
  version: 0,
  promotion: null,
  target: null,
};

export function PromotionsContainer() {
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));
  const [filter, setFilter] = useState<PromotionFilter>("ALL");
  const [dialog, setDialog] = useState<DialogState>(CLOSED);
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );

  const promotionsQuery = usePromotions();
  const categoriesQuery = useAdminCategories(ALL_STATUSES);
  const treatmentsQuery = useAdminTreatments(ALL_STATUSES);
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

  const counts = useMemo(
    () => countPromotionsByState(promotions, nowMs),
    [promotions, nowMs],
  );
  const visible = useMemo(
    () => filterPromotions(promotions, filter, nowMs),
    [promotions, filter, nowMs],
  );

  const targetFor = (promotion: Promotion): PromotionTargetOptions | null => {
    if (promotion.treatmentId) {
      const treatment = treatments.find(
        (item) => item.id === promotion.treatmentId,
      );
      return treatment
        ? {
            treatment: { id: treatment.id, name: treatment.name },
            category: treatment.category,
          }
        : null;
    }
    return promotion.category
      ? { treatment: null, category: promotion.category }
      : null;
  };

  const open = (promotion: Promotion | null) =>
    setDialog((current) => ({
      open: true,
      version: current.version + 1,
      promotion,
      target: promotion ? targetFor(promotion) : null,
    }));

  return (
    <>
      <PromotionsView
        promotions={visible}
        counts={counts}
        filter={filter}
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
              "El descuento deja de aplicarse de inmediato en el bot y en las reservas nuevas.",
            submitLabel: "Desactivar promoción",
            onConfirm: () => actions.deactivatePromotion(promotion.id),
          })
        }
        onRetry={() => void promotionsQuery.refetch()}
      />

      <PromotionDialog
        key={`promotion-${dialog.version}`}
        open={dialog.open}
        target={dialog.target}
        choices={{
          categories: categories.map(({ id, name }) => ({ id, name })),
          treatments: treatments.map(({ id, name, categoryId }) => ({
            id,
            name,
            categoryId,
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
