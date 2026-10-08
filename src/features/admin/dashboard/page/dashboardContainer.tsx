"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";

import { useDashboardSummary } from "../../hooks/use-dashboard";
import { useDashboardReservations } from "../../hooks/use-dashboard-reservations";
import { useReservationActions } from "../../hooks/use-reservation-actions";
import type {
  DashboardHeaderData,
  DashboardMetricsData,
  DashboardView as DashboardViewId,
} from "../../types/dashboard.types";
import {
  DEFAULT_DASHBOARD_VIEW,
  isDashboardView,
} from "../lib/dashboard-views";
import { RESERVATIONS_PANEL_ID } from "../reservations-panel/reservationsPanel";
import { DashboardView } from "./dashboardView";

const PAGE_SIZE = 3;

function parsePage(raw: string | null): number {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

export function DashboardContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawView = searchParams.get("view");
  const view: DashboardViewId = isDashboardView(rawView)
    ? rawView
    : DEFAULT_DASHBOARD_VIEW;
  const currentPage = parsePage(searchParams.get("page"));
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));

  const replaceQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null) params.delete(key);
        else params.set(key, value);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const goToPage = useCallback(
    (page: number) => replaceQuery({ page: page <= 1 ? null : String(page) }),
    [replaceQuery],
  );

  const changeView = useCallback(
    (next: DashboardViewId) =>
      replaceQuery({
        view: next === DEFAULT_DASHBOARD_VIEW ? null : next,
        page: null,
      }),
    [replaceQuery],
  );

  const reservationsQuery = useDashboardReservations({
    view,
    page: currentPage,
    pageSize: PAGE_SIZE,
    todayKey,
  });
  const summaryQuery = useDashboardSummary();
  const actions = useReservationActions();

  const { data: reservationsData } = reservationsQuery;

  useEffect(() => {
    if (!reservationsData) return;

    const lastPage = Math.max(reservationsData.pagination.totalPages, 1);
    if (currentPage > lastPage) {
      goToPage(lastPage);
    }
  }, [reservationsData, currentPage, goToPage]);

  const handleViewNotifications = () => {
    changeView("pending");
    document
      .getElementById(RESERVATIONS_PANEL_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCreateReservation = () => {
    router.push("/admin/calendar?new=true");
  };

  const handleOpenInCalendar = (reservationId: string) => {
    router.push(`/admin/calendar?reservationId=${reservationId}`);
  };

  const handleReschedule = (reservationId: string) => {
    router.push(`/admin/calendar?reschedule=${reservationId}`);
  };

  const handleViewClient = (clientId: string) => {
    router.push(`/admin/clients/${clientId}`);
  };

  const summary = summaryQuery.data;

  const metrics: DashboardMetricsData = {
    completedReservations: {
      value: summary?.metrics.completedReservations.value ?? 0,
    },
    pendingReservations: {
      value: summary?.metrics.pendingReservations.value ?? 0,
    },
    dailyEarnings: {
      value: Number(summary?.metrics.dailyEarnings.value ?? 0),
      currency: summary?.metrics.dailyEarnings.currency ?? "COP",
    },
  };

  const header: DashboardHeaderData = {
    locationName: "Sede principal",
    summary: {
      todayAppointments: summary?.header.todayAppointments ?? 0,
      pendingConfirmations: summary?.header.pendingConfirmations ?? 0,
    },
  };

  return (
    <DashboardView
      header={header}
      metrics={metrics}
      isSummaryLoading={summaryQuery.isLoading}
      isSummaryError={summaryQuery.isError && !summary}
      onRetrySummary={() => void summaryQuery.refetch()}
      view={view}
      onViewChange={changeView}
      reservations={reservationsData?.reservations ?? []}
      pagination={
        reservationsData?.pagination ?? {
          page: currentPage,
          pageSize: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        }
      }
      isReservationsLoading={
        reservationsQuery.isLoading || reservationsQuery.isPlaceholderData
      }
      isReservationsError={reservationsQuery.isError}
      onRetryReservations={() => void reservationsQuery.refetch()}
      onPageChange={goToPage}
      actions={actions}
      onOpenInCalendar={handleOpenInCalendar}
      onReschedule={handleReschedule}
      onViewClient={handleViewClient}
      onViewNotifications={handleViewNotifications}
      onCreateReservation={handleCreateReservation}
    />
  );
}
