import { DashboardHeader } from "../components/dashboardHeader";
import { DashboardMetrics } from "../components/dashboardMetrics";

import type {
  DashboardHeaderActions,
  DashboardData,
  AcceptReservationHandler,
} from "@/src/features/admin/types/dashboard.types";
import { PendingReservations } from "../pending-reservations/pendingReservations";

interface DashboardViewProps extends DashboardHeaderActions {
  data: DashboardData;

  isPendingReservationsLoading: boolean;
  isPendingReservationsError: boolean;
  onRetryPendingReservations: () => void;

  onAcceptReservation: AcceptReservationHandler;
  onRescheduleReservation: (reservationId: string) => void;
  onContactClient: (phone: string) => void;
  onViewClient: (clientId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onViewProof: (reservationId: string, proofUrl: string) => void;

  isCancellingReservation: boolean;
  cancellingReservationId: string | null;

  onPendingReservationsPageChange: (page: number) => void;
}

export function DashboardView({
  data,
  isPendingReservationsLoading,
  isPendingReservationsError,
  isCancellingReservation,
  cancellingReservationId,
  onRetryPendingReservations,
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
          isLoading={isPendingReservationsLoading}
          isError={isPendingReservationsError}
          onRetry={onRetryPendingReservations}
          onAccept={onAcceptReservation}
          onReschedule={onRescheduleReservation}
          onContactClient={onContactClient}
          onViewClient={onViewClient}
          onCancel={onCancelReservation}
          onViewProof={onViewProof}
          onPageChange={onPendingReservationsPageChange}
          isCancellingReservation={isCancellingReservation}
          cancellingReservationId={cancellingReservationId}
        />
      </div>
    </main>
  );
}
