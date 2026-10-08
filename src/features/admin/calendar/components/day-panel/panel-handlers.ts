import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";

export interface DayPanelHandlers {
  todayKey: string;
  nowMs: number;
  actions: ReservationActions;
  onViewClient: (clientId: string) => void;
  onReschedule: (reservationId: string) => void;
}
