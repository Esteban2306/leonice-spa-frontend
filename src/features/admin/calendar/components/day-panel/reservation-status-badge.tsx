import type {
  CancellationSource,
  ReservationStatus,
} from "@/src/features/admin/types/enums";
import { RESERVATION_STATUS_LABELS } from "@/src/features/admin/utils/reservation-status.utils";

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  cancellationSource: CancellationSource | null;
}

const TONE: Partial<Record<ReservationStatus, string>> = {
  PENDIENTE_DEPOSITO: "border border-amber-300 bg-amber-100 text-amber-900",
  CONFIRMADA: "bg-secondary text-primary",
  CITA_EN_CURSO: "bg-green-700 text-white",
  COMPLETADA: "border border-green-300 bg-green-100 text-green-800",
  NO_SHOW: "border border-red-300 bg-red-100 text-red-800",
  CANCELADA: "border border-red-200 bg-white text-red-700",
};

const CANCELLED_SHORT: Record<CancellationSource, string> = {
  CLIENT: "Cancelada · cliente",
  ADMIN: "Cancelada · admin",
  TIMEOUT: "Cancelada · vencida",
};

export function ReservationStatusBadge({
  status,
  cancellationSource,
}: ReservationStatusBadgeProps) {
  const label =
    status === "CANCELADA" && cancellationSource
      ? CANCELLED_SHORT[cancellationSource]
      : RESERVATION_STATUS_LABELS[status];

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 font-sans text-[11px] ${
        TONE[status] ?? "border border-tertiary/50 text-secondary"
      }`}
    >
      {label}
    </span>
  );
}
