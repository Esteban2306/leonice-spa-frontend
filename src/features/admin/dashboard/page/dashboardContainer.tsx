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

const PAGE_SIZE = 3;

const DASHBOARD_MOCK_SECTIONS: Omit<DashboardData, "pendingReservations"> = {
  header: {
    locationName: "Sede principal",
    summary: {
      todayAppointments: 8,
      pendingConfirmations: 3,
    },
  },
  metrics: {
    completedReservations: {
      value: 18,
      comparison: "+4 frente a ayer",
      todayInProgress: 6,
    },
    pendingReservations: {
      value: 3,
      description: "Necesitan tu confirmación",
      averageWaitMinutes: 25,
    },
    dailyEarnings: {
      value: 1_840_000,
      comparison: "+12% vs. promedio semanal",
      description: "Incluye adelantos confirmados",
    },
  },
};

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

  return (
    <DashboardView
      data={{
        ...DASHBOARD_MOCK_SECTIONS,
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
