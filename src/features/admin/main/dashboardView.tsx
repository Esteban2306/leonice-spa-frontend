import { DashboardHeader } from "./components/dashboardHeader";
import { DashboardMetrics } from "./components/dashboardMetrics";

import type {
  DashboardHeaderActions,
  DashboardData,
} from "@/src/features/admin/types/dashboard.types";
import { PendingReservations } from "./components/pendingReservations";

interface DashboardViewProps extends DashboardHeaderActions {
  data: DashboardData;

  onAcceptReservation: (reservationId: string) => void;
  onRescheduleReservation: (reservationId: string) => void;
  onContactClient: (clientId: string) => void;
  onViewClient: (clientId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onViewProof: (reservationId: string, proofUrl: string) => void;

  onPendingReservationsPageChange: (page: number) => void;
}

export function DashboardView({
  data,
  onViewNotifications,
  onCreateReservation,
  onAcceptReservation,
  onRescheduleReservation,
  onContactClient,
  onViewClient,
  onCancelReservation,
  onViewProof,
  onPendingReservationsPageChange,
}: DashboardViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
        <DashboardHeader
          locationName={data.header.locationName}
          summary={data.header.summary}
          onViewNotifications={onViewNotifications}
          onCreateReservation={onCreateReservation}
        />

        <DashboardMetrics data={data.metrics} />

        <PendingReservations
          reservations={data.pendingReservations.reservations}
          pagination={data.pendingReservations.pagination}
          onAccept={onAcceptReservation}
          onReschedule={onRescheduleReservation}
          onContactClient={onContactClient}
          onViewClient={onViewClient}
          onCancel={onCancelReservation}
          onViewProof={onViewProof}
          onPageChange={onPendingReservationsPageChange}
        />
      </div>
    </main>
  );
}
