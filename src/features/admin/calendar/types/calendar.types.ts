export type CalendarViewMode = "month" | "week";

export type CalendarReservationStatus = "CONFIRMADA" | "AGENDADA";

export type CalendarFilterGroup = "status" | "category";

export interface CalendarReservation {
  id: string;
  comboId: string | null;
  /** YYYY-MM-DD */
  dateKey: string;
  clientName: string;
  treatmentName: string;
  professionalName: string;
  start: string;
  end: string;
  status: CalendarReservationStatus;
  phone: string;
  category: string;
  price: number;
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

export interface ReservationActionHandlers {
  onViewClient: (reservationId: string) => void;
  onReschedule: (reservationId: string) => void;
  onCancel: (reservationId: string) => void;
}

export interface ScheduleActionHandlers {
  onBlockDay: () => void;
  onBlockHours: () => void;
  onEditSchedule: () => void;
}
