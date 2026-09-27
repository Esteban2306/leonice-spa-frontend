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
        footer={
          <>
            <span className="text-quaternary">
              {data.completedReservations.comparison}
            </span>

            <span aria-hidden="true">·</span>

            <span>
              {data.completedReservations.todayInProgress} en sala hoy
            </span>
          </>
        }
      />

      <DashboardMetricCard
        icon={Clock3}
        label="Reservas pendientes"
        value={data.pendingReservations.value}
        description={data.pendingReservations.description}
        footer={
          <>
            Tiempo medio de espera:{" "}
            <span className="text-tertiary">
              {data.pendingReservations.averageWaitMinutes} min
            </span>
          </>
        }
      />

      <DashboardMetricCard
        icon={Coins}
        label="Ganancias del día"
        value={data.dailyEarnings.value}
        description={data.dailyEarnings.description}
        footer={data.dailyEarnings.comparison}
        format="currency"
      />
    </section>
  );
}
