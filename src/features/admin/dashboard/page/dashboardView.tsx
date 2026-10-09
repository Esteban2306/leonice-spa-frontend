import type { ComponentProps } from "react";

import type {
  DashboardHeaderActions,
  DashboardHeaderData,
  DashboardMetricsData,
  DashboardPagination,
  DashboardReservation,
  DashboardView as DashboardViewId,
} from "@/src/features/admin/types/dashboard.types";

import { DashboardHeader } from "../components/dashboardHeader";
import { HairProfilesNotice } from "../components/hairProfilesNotice";
import { DashboardMetrics } from "../components/dashboardMetrics";
import type { ReservationPanelHandlers } from "../reservations-panel/panelHandlers";
import { ReservationsPanel } from "../reservations-panel/reservationsPanel";

interface DashboardViewProps
  extends DashboardHeaderActions, ReservationPanelHandlers {
  hairProfiles: ComponentProps<typeof HairProfilesNotice>;
  header: DashboardHeaderData;
  metrics: DashboardMetricsData;
  isSummaryLoading: boolean;
  isSummaryError: boolean;
  onRetrySummary: () => void;

  view: DashboardViewId;
  onViewChange: (view: DashboardViewId) => void;
  reservations: DashboardReservation[];
  pagination: DashboardPagination;
  isReservationsLoading: boolean;
  isReservationsError: boolean;
  onRetryReservations: () => void;
  onPageChange: (page: number) => void;
}

export function DashboardView({
  header,
  metrics,
  isSummaryLoading,
  isSummaryError,
  onRetrySummary,
  view,
  onViewChange,
  reservations,
  pagination,
  isReservationsLoading,
  isReservationsError,
  onRetryReservations,
  onPageChange,
  actions,
  onOpenInCalendar,
  onReschedule,
  onViewClient,
  onViewNotifications,
  onCreateReservation,
  onOpenDailyReport,
  hairProfiles,
}: DashboardViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
        <DashboardHeader
          locationName={header.locationName}
          summary={header.summary}
          onViewNotifications={onViewNotifications}
          onCreateReservation={onCreateReservation}
          onOpenDailyReport={onOpenDailyReport}
        />

        <HairProfilesNotice {...hairProfiles} />

        <DashboardMetrics
          data={metrics}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          onRetry={onRetrySummary}
        />

        <ReservationsPanel
          view={view}
          onViewChange={onViewChange}
          reservations={reservations}
          pagination={pagination}
          isLoading={isReservationsLoading}
          isError={isReservationsError}
          onRetry={onRetryReservations}
          onPageChange={onPageChange}
          actions={actions}
          onOpenInCalendar={onOpenInCalendar}
          onReschedule={onReschedule}
          onViewClient={onViewClient}
        />
      </div>
    </main>
  );
}
