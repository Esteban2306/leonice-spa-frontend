"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DashboardView } from "../page/dashboardView";
import { useApproveDeposit } from "@/src/features/admin/hooks/use-deposits";
import {
  useAdminCancelReservation,
  usePendingReservations,
} from "@/src/features/admin/hooks/use-reservations";
import type {
  AcceptReservationHandler,
  DashboardData,
} from "@/src/features/admin/types/dashboard.types";
import { useDashboardSummary } from "../../hooks/use-dashboard";

const PAGE_SIZE = 3;

function parsePage(raw: string | null): number {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

export function DashboardContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = parsePage(searchParams.get("page"));

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const {
    data: pendingData,
    isLoading: isPendingInitialLoading,
    isPlaceholderData: isPendingPageTransition,
    isError: isPendingError,
    refetch: refetchPending,
  } = usePendingReservations({ page: currentPage, pageSize: PAGE_SIZE });

  const approveDeposit = useApproveDeposit();
  const cancelReservation = useAdminCancelReservation();

  useEffect(() => {
    if (!pendingData) return;

    const lastPage = Math.max(pendingData.pagination.totalPages, 1);
    if (currentPage > lastPage) {
      goToPage(lastPage);
    }
  }, [pendingData, currentPage, goToPage]);

  const handleViewNotifications = () => {
    router.push("/admin/notifications");
  };

  const handleCreateReservation = () => {
    router.push("/admin/calendar?new=true");
  };

  const handleAcceptReservation: AcceptReservationHandler = async (
    reservationId,
    coverage,
  ) => {
    await approveDeposit.mutateAsync({
      reservationId,
      data: { coverage },
    });
  };

  const handleRescheduleReservation = (reservationId: string) => {
    router.push(`/admin/calendar?reservationId=${reservationId}`);
  };

  const handleContactClient = (phone: string) => {
    const whatsappPhone = phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${whatsappPhone}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleViewClient = (clientId: string) => {
    router.push(`/admin/clients/${clientId}`);
  };

  const handleCancelReservation = async (reservationId: string) => {
    await cancelReservation.mutateAsync({
      reservationId,
      data: {},
    });
  };

  const handleViewProof = (reservationId: string, proofUrl: string) => {
    console.log("Ver comprobante:", { reservationId, proofUrl }); // TODO
  };

  const {
    data: dashboardSummary,
    isLoading: isDashboardSummaryLoading,
    isError: isDashboardSummaryError,
    refetch: refetchDashboardSummary,
  } = useDashboardSummary();

  const metrics: DashboardData["metrics"] = {
    completedReservations: {
      value: dashboardSummary?.metrics.completedReservations.value ?? 0,
    },

    pendingReservations: {
      value: dashboardSummary?.metrics.pendingReservations.value ?? 0,
    },

    dailyEarnings: {
      value: Number(dashboardSummary?.metrics.dailyEarnings.value ?? 0),
      currency: dashboardSummary?.metrics.dailyEarnings.currency ?? "COP",
    },
  };

  const dashboardHeader: DashboardData["header"] = {
    locationName: "Sede principal",
    summary: {
      todayAppointments: dashboardSummary?.header.todayAppointments ?? 0,

      pendingConfirmations: dashboardSummary?.header.pendingConfirmations ?? 0,
    },
  };

  return (
    <DashboardView
      data={{
        header: dashboardHeader,
        metrics,
        pendingReservations: {
          reservations: pendingData?.reservations ?? [],
          pagination: pendingData?.pagination ?? {
            page: currentPage,
            pageSize: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          },
        },
      }}
      isPendingReservationsLoading={
        isPendingInitialLoading || isPendingPageTransition
      }
      isPendingReservationsError={isPendingError}
      onRetryPendingReservations={() => void refetchPending()}
      onViewNotifications={handleViewNotifications}
      onCreateReservation={handleCreateReservation}
      onAcceptReservation={handleAcceptReservation}
      onRescheduleReservation={handleRescheduleReservation}
      onContactClient={handleContactClient}
      onViewClient={handleViewClient}
      onCancelReservation={handleCancelReservation}
      onViewProof={handleViewProof}
      onPendingReservationsPageChange={goToPage}
      isCancellingReservation={cancelReservation.isPending}
      cancellingReservationId={
        cancelReservation.variables?.reservationId ?? null
      }
    />
  );
}
