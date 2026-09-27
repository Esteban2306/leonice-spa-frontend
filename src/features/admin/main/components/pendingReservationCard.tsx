"use client";

import type { PendingReservation } from "@/src/features/admin/types/dashboard.types";

import { PendingReservationDesktop } from "./pendingReservationDesktop";
import { PendingReservationMobile } from "./pendingReservationMobile";

interface PendingReservationCardProps {
  reservation: PendingReservation;

  onAccept: (reservationId: string) => void;
  onReschedule: (reservationId: string) => void;
  onContactClient: (clientId: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
  onViewProof: (reservationId: string, proofUrl: string) => void;
}

export function PendingReservationCard({
  reservation,
  onAccept,
  onReschedule,
  onContactClient,
  onViewClient,
  onCancel,
  onViewProof,
}: PendingReservationCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB]">
      <div className="lg:hidden">
        <PendingReservationMobile
          reservation={reservation}
          onAccept={onAccept}
          onReschedule={onReschedule}
          onContactClient={onContactClient}
          onViewClient={onViewClient}
          onCancel={onCancel}
          onViewProof={onViewProof}
        />
      </div>
      <div className="hidden lg:block">
        <PendingReservationDesktop
          reservation={reservation}
          onAccept={onAccept}
          onReschedule={onReschedule}
          onContactClient={onContactClient}
          onViewClient={onViewClient}
          onCancel={onCancel}
          onViewProof={onViewProof}
        />
      </div>
    </article>
  );
}
