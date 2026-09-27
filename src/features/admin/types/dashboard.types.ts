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

export interface PendingReservationsPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DashboardMetricsData {
  completedReservations: {
    value: number;
    comparison: string;
    todayInProgress: number;
  };

  pendingReservations: {
    value: number;
    description: string;
    averageWaitMinutes: number;
  };

  dailyEarnings: {
    value: number;
    comparison: string;
    description: string;
  };
}

export type ReservationStatus = "PENDING_CONFIRMATION";

export interface PendingReservation {
  reservationId: string;
  clientId: string;

  client: {
    name: string;
    phone: string;
    avatarUrl?: string;
  };

  appointment: {
    dateLabel: string;
    timeLabel: string;
    treatmentName: string;
    durationMinutes: number;
    roomLabel: string;
  };

  deposit: {
    amount: number;
    proofUrl: string;
    verified: boolean;
  };

  status: ReservationStatus;
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
