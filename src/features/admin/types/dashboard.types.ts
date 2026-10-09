import type { ReservationAssessment } from "./reservations.types";
import type { CancellationSource, ReservationStatus } from "./enums";

export interface DashboardSummary {
  todayAppointments: number;
  pendingConfirmations: number;
}

export interface DashboardHeaderData {
  locationName: string;
  summary: DashboardSummary;
}

export interface DashboardHeaderActions {
  onViewNotifications: () => void;
  onCreateReservation: () => void;
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

export type DashboardView = "pending" | "confirmed" | "completed" | "cancelled";

export interface DashboardReservationItem {
  reservationId: string;
  status: ReservationStatus;
  treatmentName: string;
  categoryLabel: string;
  durationMinutes: number;
  scheduledStart: string;
  isToday: boolean;
  isUpcoming: boolean;
  timeLabel: string;
  priceThousands: number;
  proofUrl: string | null;
  proofStatus: ProofStatus;
  depositExpiresAt: string | null;
  cancellationSource: CancellationSource | null;
  cancellationReason: string | null;
  assessment?: ReservationAssessment;
}

export interface DashboardReservation {
  groupKey: string;
  clientId: string;
  client: {
    name: string;
    phone: string;
  };
  dateLabel: string;
  isCombo: boolean;
  items: DashboardReservationItem[];
}

export interface DashboardPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DashboardReservationsData {
  reservations: DashboardReservation[];
  pagination: DashboardPagination;
}
