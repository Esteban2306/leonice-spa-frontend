import { CalendarCheck, Clock3, Coins } from "lucide-react";

import type { DashboardMetricsData } from "@/src/features/admin/types/dashboard.types";

import { DashboardMetricCard } from "./dashboardMetricCard";

interface DashboardMetricsProps {
  data: DashboardMetricsData;
}

export function DashboardMetrics({ data }: DashboardMetricsProps) {
  return (
    <section
      aria-label="Resumen de métricas"
      className="grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
      <DashboardMetricCard
        icon={CalendarCheck}
        label="Reservas realizadas"
        value={data.completedReservations.value}
        badge="Hoy"
        variant="featured"
      />

      <DashboardMetricCard
        icon={Clock3}
        label="Reservas pendientes"
        value={data.pendingReservations.value}
        description="Pendientes de depósito"
      />

      <DashboardMetricCard
        icon={Coins}
        label="Ganancias del día"
        value={data.dailyEarnings.value}
        description="Reservas completadas"
        format="currency"
      />
    </section>
  );
}
