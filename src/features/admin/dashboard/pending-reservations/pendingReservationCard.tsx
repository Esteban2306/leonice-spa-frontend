"use client";

import type {
  AcceptReservationHandler,
  PendingReservation,
} from "@/src/features/admin/types/dashboard.types";

import { PendingReservationDesktop } from "./pendingReservationDesktop";
import { PendingReservationMobile } from "./pendingReservationMobile";

interface PendingReservationCardProps {
  reservation: PendingReservation;

  isCancellingReservation: boolean;
  cancellingReservationId: string | null;

  onAccept: AcceptReservationHandler;
  onReschedule: (reservationId: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
}

export function PendingReservationCard({
  reservation,
  onAccept,
  onReschedule,
  isCancellingReservation,
  cancellingReservationId,
  onViewClient,
  onCancel,
}: PendingReservationCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB]">
      <div className="lg:hidden">
        <PendingReservationMobile
          reservation={reservation}
          onAccept={onAccept}
          onReschedule={onReschedule}
          onViewClient={onViewClient}
          onCancel={onCancel}
          isCancellingReservation={isCancellingReservation}
          cancellingReservationId={cancellingReservationId}
        />
      </div>
      <div className="hidden lg:block">
        <PendingReservationDesktop
          reservation={reservation}
          onAccept={onAccept}
          onReschedule={onReschedule}
          onViewClient={onViewClient}
          onCancel={onCancel}
          isCancellingReservation={isCancellingReservation}
          cancellingReservationId={cancellingReservationId}
        />
      </div>
    </article>
  );
}
