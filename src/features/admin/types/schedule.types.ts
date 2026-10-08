import type { ScheduleExceptionType } from "./enums";

export interface ScheduleWindow {
  start: string;
  end: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleException {
  id: string;
  date: string;
  type: ScheduleExceptionType;
  categoryId: string | null;
  categoryName: string | null;
  scope: "GLOBAL" | "CATEGORY";
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  createdAt: string;
}

export interface ScheduleDay {
  date: string;
  isClosed: boolean;
  windows: ScheduleWindow[];
  categories: Array<{
    categoryId: string;
    name: string;
    isClosed: boolean;
    windows: ScheduleWindow[];
  }>;
  exceptions: ScheduleException[];
}

export interface CreateScheduleExceptionRequest {
  date: string;
  type: ScheduleExceptionType;
  categoryId?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface ScheduleChangeResult extends ScheduleException {
  depositDeadlinesExtended: Array<{
    reservationId: string;
    depositExpiresAt: string;
  }>;
}

export interface ScheduleConflictReservation {
  reservationId: string;
  clientName: string;
  treatment: string;
  scheduledStart: string;
}
