import type { DepositCoverage } from "./enums";

export interface DashboardSummary {
  todayAppointments: number;
  pendingConfirmations: number;
}

export interface DashboardHeaderData {
  locationName: string;
  summary: DashboardSummary;
}

export type AcceptReservationHandler = (
  reservationId: string,
  coverage: DepositCoverage,
) => Promise<void>;

export interface DashboardHeaderActions {
  onViewNotifications: () => void;
  onCreateReservation: () => void;
}

export interface PendingReservationsPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DashboardMetricsData {
  completedReservations: {
    value: number;
  };

  pendingReservations: {
    value: number;
  };

  dailyEarnings: {
    value: number;
    currency: string;
  };
}

export type ProofStatus = "NONE" | "UNDER_REVIEW" | "REJECTED" | "VERIFIED";

export interface PendingReservationItem {
  reservationId: string;
  treatmentName: string;
  categoryLabel: string;
  durationMinutes: number;
  timeLabel: string;
  totalPrice: number;
  proofUrl: string | null;
  proofStatus: ProofStatus;
  depositExpiresAt: string | null;
}

export interface PendingReservation {
  clientId: string;
  client: {
    name: string;
    phone: string;
  };
  dateLabel: string;
  items: PendingReservationItem[];
}

export interface PendingReservationsData {
  reservations: PendingReservation[];
  pagination: PendingReservationsPagination;
}

export interface DashboardData {
  header: DashboardHeaderData;
  metrics: DashboardMetricsData;
  pendingReservations: PendingReservationsData;
}
