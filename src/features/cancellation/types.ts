export type CancellationScope = "SINGLE" | "DAY";

export interface CancellationLinkReservation {
  reservationId: string;
  treatment: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: string;
  cancellable: boolean;
}

export interface CancellationLinkDetails {
  clientFirstName: string | null;
  date: string;
  expiresAt: string;
  linkReservationId: string;
  reservations: CancellationLinkReservation[];
}

export interface CancelWithLinkRequest {
  scope: CancellationScope;
  reservationId?: string;
  reason?: string;
}

export interface CancelledReservation {
  reservationId: string;
  treatment: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface CancelWithLinkResult {
  scope: CancellationScope;
  cancelled: CancelledReservation[];
  alreadyCancelled: CancelledReservation[];
}
