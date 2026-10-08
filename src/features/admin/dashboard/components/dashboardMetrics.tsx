import { CalendarCheck, Clock3, Coins } from "lucide-react";

import type { DashboardMetricsData } from "@/src/features/admin/types/dashboard.types";

import { DashboardMetricCard } from "./dashboardMetricCard";

interface DashboardMetricsProps {
  data: DashboardMetricsData;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function DashboardMetrics({
  data,
  isLoading,
  isError,
  onRetry,
}: DashboardMetricsProps) {
  return (
    <section
      aria-label="Resumen de métricas"
      className="grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
      {isError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800 lg:col-span-3"
        >
          No se pudieron cargar las métricas del día.
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
          >
            Reintentar
          </button>
        </div>
      )}
      <DashboardMetricCard
        icon={CalendarCheck}
        label="Reservas realizadas"
        value={data.completedReservations.value}
        isLoading={isLoading}
        badge="Hoy"
        variant="featured"
      />

      <DashboardMetricCard
        icon={Clock3}
        label="Reservas pendientes"
        value={data.pendingReservations.value}
        isLoading={isLoading}
        description="Pendientes de depósito"
      />

      <DashboardMetricCard
        icon={Coins}
        label="Ganancias del día"
        value={data.dailyEarnings.value}
        isLoading={isLoading}
        description="Reservas completadas"
        format="currency"
      />
    </section>
  );
}
