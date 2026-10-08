import { getBogotaDayKey } from "@/src/lib/date/bogota";

import type { DashboardView } from "../../types/dashboard.types";
import type { FindReservationsParams } from "../../types/reservations.types";

export interface DashboardViewConfig {
  id: DashboardView;
  label: string;
  title: string;
  description: string;
  emptyMessage: string;
}

export const DASHBOARD_VIEWS: readonly DashboardViewConfig[] = [
  {
    id: "pending",
    label: "Pendientes",
    title: "Reservas pendientes",
    description:
      "Revisa el comprobante, aprueba con el monto recibido o gestiona cada reserva desde Opciones.",
    emptyMessage: "No hay reservas esperando depósito.",
  },
  {
    id: "confirmed",
    label: "Confirmadas",
    title: "Próximas confirmadas",
    description:
      "Citas con depósito aprobado desde hoy. Las de hoy permiten registrar el check-in.",
    emptyMessage: "No hay citas confirmadas próximas.",
  },
  {
    id: "completed",
    label: "Completadas hoy",
    title: "Completadas hoy",
    description: "Citas atendidas y cerradas durante el día.",
    emptyMessage: "Todavía no hay citas completadas hoy.",
  },
  {
    id: "cancelled",
    label: "Canceladas",
    title: "Canceladas próximas",
    description:
      "Canceladas por el administrador o por vencimiento del depósito. Las vencidas se pueden reactivar.",
    emptyMessage: "No hay cancelaciones próximas del administrador ni por vencimiento.",
  },
];

export const DEFAULT_DASHBOARD_VIEW: DashboardView = "pending";

export function isDashboardView(value: string | null): value is DashboardView {
  return DASHBOARD_VIEWS.some((view) => view.id === value);
}

export function getDashboardViewConfig(view: DashboardView): DashboardViewConfig {
  return DASHBOARD_VIEWS.find((config) => config.id === view) ?? DASHBOARD_VIEWS[0];
}

export function buildDashboardViewParams(
  view: DashboardView,
  now: Date = new Date(),
): FindReservationsParams {
  const today = getBogotaDayKey(now);

  switch (view) {
    case "pending":
      return { status: "PENDIENTE_DEPOSITO" };
    case "confirmed":
      return { status: "CONFIRMADA", from: today };
    case "completed":
      return { status: "COMPLETADA", date: today };
    case "cancelled":
      return {
        status: "CANCELADA",
        from: today,
        cancellationSources: "ADMIN,TIMEOUT",
      };
  }
}
