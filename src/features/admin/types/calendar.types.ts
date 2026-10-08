import type {
  CancellationSource,
  DepositCoverage,
  DepositStatus,
  ReservationChannel,
  ReservationStatus,
} from "./enums";

export interface FindCalendarParams {
  date?: string;
  from?: string;
  to?: string;
}

export interface CalendarApiDeposit {
  id: string;
  status: DepositStatus;
  coverage: DepositCoverage | null;
  imageUrl: string | null;
  amount: string | null;
}

export interface CalendarApiReservation {
  id: string;
  status: ReservationStatus;
  channel: ReservationChannel;
  comboGroupId: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  finalPrice: string;
  finalDurationMinutes: number;
  depositExpiresAt: string | null;
  checkedInAt: string | null;
  cancellationSource: CancellationSource | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  isProofUnderReview: boolean;
  client: { id: string; name: string; phone: string };
  treatment: { id: string; name: string };
  category: { id: string; name: string };
  deposit: CalendarApiDeposit | null;
}

export interface CalendarRangeResponse {
  date: string | null;
  from: string;
  to: string;
  reservations: CalendarApiReservation[];
}
