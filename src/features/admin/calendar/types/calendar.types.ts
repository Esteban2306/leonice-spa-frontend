export type CalendarViewMode = "month" | "week";

export type CalendarReservationStatus = "CONFIRMADA" | "AGENDADA";

export interface CalendarReservation {
  id: string;
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

export interface CalendarDay {
  date: Date;
  reservations: CalendarReservation[];
}
