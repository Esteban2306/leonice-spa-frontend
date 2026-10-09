import { BadgePercent, CircleOff, Gauge, Layers, Sparkles } from "lucide-react";

import { KpiButton } from "@/src/features/admin/components/kpi-button";

import type { CatalogFilters } from "../lib/catalog";

export interface CatalogTotals {
  activeTreatments: number;
  inactiveTreatments: number;
  activeStations: number;
  totalCapacity: number;
  currentPromotions: number;
}

interface CatalogKpisProps {
  totals: CatalogTotals;
  filters: CatalogFilters;
  onApply: (patch: Partial<CatalogFilters>) => void;
  onManageStations: () => void;
}

export function CatalogKpis({
  totals,
  filters,
  onApply,
  onManageStations,
}: CatalogKpisProps) {
  return (
    <section
      aria-label="Resumen del catálogo"
      className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-5 [&>*]:w-40 [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-auto"
    >
      <KpiButton
        numericFont
        icon={Sparkles}
        tone="dark"
        value={String(totals.activeTreatments)}
        label="Servicios activos"
        hint="Se ofrecen en el bot y el calendario"
        isActive={filters.status === "ACTIVE" && !filters.hasActivePromotion}
        onClick={() => onApply({ status: "ACTIVE", hasActivePromotion: false })}
      />
      <KpiButton
        numericFont
        icon={CircleOff}
        value={String(totals.inactiveTreatments)}
        label="Inactivos"
        hint="Conservan su historial"
        isActive={filters.status === "INACTIVE"}
        onClick={() =>
          onApply({ status: "INACTIVE", hasActivePromotion: false })
        }
      />
      <KpiButton
        numericFont
        icon={Layers}
        value={String(totals.activeStations)}
        label="Estaciones activas"
        hint="Categorías que se pueden reservar"
        onClick={onManageStations}
      />
      <KpiButton
        numericFont
        icon={Gauge}
        value={String(totals.totalCapacity)}
        label="Citas a la vez"
        hint="Suma de capacidad activa"
        onClick={onManageStations}
      />
      <KpiButton
        numericFont
        icon={BadgePercent}
        tone="gold"
        value={String(totals.currentPromotions)}
        label="Promociones vigentes"
        hint="Ver servicios en promoción"
        isActive={filters.hasActivePromotion}
        onClick={() => onApply({ status: "ACTIVE", hasActivePromotion: true })}
      />
    </section>
  );
}
