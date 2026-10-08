import type { DashboardReservation } from "@/src/features/admin/types/dashboard.types";

import { getGroupProofStatus, ProofStatusBadge } from "./proofStatusBadge";
import { ReservationStateBadge } from "./reservationStateBadge";

interface ReservationGroupBadgeProps {
  reservation: DashboardReservation;
}

export function ReservationGroupBadge({ reservation }: ReservationGroupBadgeProps) {
  const [first] = reservation.items;

  if (first.status === "PENDIENTE_DEPOSITO") {
    return <ProofStatusBadge status={getGroupProofStatus(reservation.items)} />;
  }

  return <ReservationStateBadge item={first} />;
}
