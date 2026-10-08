import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";

export interface ReservationPanelHandlers {
  actions: ReservationActions;
  onOpenInCalendar: (reservationId: string) => void;
  onReschedule: (reservationId: string) => void;
  onViewClient: (clientId: string) => void;
}

export interface ReservationPanelClient {
  clientId: string;
  name: string;
  phone: string;
  isCombo: boolean;
}
