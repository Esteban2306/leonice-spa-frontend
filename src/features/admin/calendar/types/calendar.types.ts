import type {
  CancellationSource,
  DepositStatus,
  ReservationStatus,
} from "@/src/features/admin/types/enums";

export type CalendarViewMode = "month" | "week";

export type CalendarFilterGroup = "status" | "category" | "attention";

export interface CalendarReservation {
  id: string;
  comboGroupId: string | null;
  dateKey: string;
  clientId: string;
  clientName: string;
  phone: string;
  treatmentName: string;
  categoryId: string;
  categoryName: string;
  startsAt: string;
  endsAt: string;
  start: string;
  end: string;
  durationMinutes: number;
  status: ReservationStatus;
  price: number;
  depositStatus: DepositStatus | null;
  depositAmount: number | null;
  proofUrl: string | null;
  isProofUnderReview: boolean;
  depositExpiresAt: string | null;
  checkedInAt: string | null;
  cancellationSource: CancellationSource | null;
  cancellationReason: string | null;
}

export interface CalendarFilter {
  id: string;
  label: string;
  group: CalendarFilterGroup;
}

export interface ReservationGroup {
  id: string;
  isCombo: boolean;
  reservations: CalendarReservation[];
}

export interface DayScheduleSummary {
  isClosed: boolean;
  hasExceptions: boolean;
}

export interface ScheduleActionHandlers {
  onBlockDay: () => void;
  onBlockHours: () => void;
  onOpenExtraHours: () => void;
}
