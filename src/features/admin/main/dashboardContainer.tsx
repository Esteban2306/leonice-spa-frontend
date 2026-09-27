"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardView } from "./dashboardView";
import type { DashboardData } from "@/src/features/admin/types/dashboard.types";

const PAGE_SIZE = 3;

export function DashboardContainer() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const dashboardData: DashboardData = {
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

    pendingReservations: {
      reservations: [
        {
          reservationId: "reservation-001",
          clientId: "client-001",
          client: {
            name: "Valentina Ríos",
            phone: "+57 310 442 8871",
            avatarUrl: "/images/clients/valentina.jpg",
          },
          appointment: {
            dateLabel: "Hoy · sáb 19 sep",
            timeLabel: "10:30 am",
            treatmentName: "Ritual Keratina Orgánica + Corte",
            durationMinutes: 60,
            roomLabel: "Silla 2",
          },
          deposit: {
            amount: 50_000,
            proofUrl: "/images/payment-proofs/proof-001.jpg",
            verified: true,
          },
          status: "PENDING_CONFIRMATION",
        },

        {
          reservationId: "reservation-002",
          clientId: "client-002",
          client: {
            name: "Mariana Duarte",
            phone: "+57 322 518 9043",
            avatarUrl: "/images/clients/mariana.jpg",
          },
          appointment: {
            dateLabel: "Hoy · sáb 19 sep",
            timeLabel: "12:00 pm",
            treatmentName: "Balayage Caramelo + Hidratación Karité",
            durationMinutes: 120,
            roomLabel: "Silla 2",
          },
          deposit: {
            amount: 80_000,
            proofUrl: "/images/payment-proofs/proof-002.jpg",
            verified: true,
          },
          status: "PENDING_CONFIRMATION",
        },

        {
          reservationId: "reservation-003",
          clientId: "client-003",
          client: {
            name: "Carolina Méndez",
            phone: "+57 315 207 6638",
            avatarUrl: "/images/clients/carolina.jpg",
          },
          appointment: {
            dateLabel: "Hoy · sáb 19 sep",
            timeLabel: "4:00 pm",
            treatmentName: "Alisado Botánico + Masaje Capilar",
            durationMinutes: 90,
            roomLabel: "Silla 2",
          },
          deposit: {
            amount: 60_000,
            proofUrl: "/images/payment-proofs/proof-003.jpg",
            verified: true,
          },
          status: "PENDING_CONFIRMATION",
        },
      ],

      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        total: 8,
        totalPages: 3,
      },
    },
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewNotifications = () => {
    router.push("/admin/notifications");
  };

  const handleCreateReservation = () => {
    router.push("/admin/calendar?new=true");
  };

  const handleAcceptReservation = (reservationId: string) => {
    console.log("Aceptar reserva:", reservationId);
  };

  const handleRescheduleReservation = (reservationId: string) => {
    router.push(`/admin/calendar?reservationId=${reservationId}`);
  };

  const handleContactClient = (clientId: string) => {
    console.log("Contactar cliente:", clientId);
  };

  const handleViewClient = (clientId: string) => {
    router.push(`/admin/clients/${clientId}`);
  };

  const handleCancelReservation = (reservationId: string) => {
    console.log("Cancelar reserva:", reservationId);
  };

  const handleViewProof = (reservationId: string, proofUrl: string) => {
    console.log("Ver comprobante:", {
      reservationId,
      proofUrl,
    });
  };

  return (
    <DashboardView
      data={dashboardData}
      onViewNotifications={handleViewNotifications}
      onCreateReservation={handleCreateReservation}
      onAcceptReservation={handleAcceptReservation}
      onRescheduleReservation={handleRescheduleReservation}
      onContactClient={handleContactClient}
      onViewClient={handleViewClient}
      onCancelReservation={handleCancelReservation}
      onViewProof={handleViewProof}
      onPendingReservationsPageChange={handlePageChange}
    />
  );
}
