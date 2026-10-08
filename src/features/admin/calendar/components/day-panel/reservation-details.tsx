import { formatBogotaTime } from "@/src/lib/date/bogota";
import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { DepositStatus } from "@/src/features/admin/types/enums";

import type { CalendarReservation } from "../../types/calendar.types";

interface ReservationDetailsProps {
  reservation: CalendarReservation;
}

const DEPOSIT_LABELS: Record<DepositStatus, string> = {
  PENDIENTE: "En revisión",
  CONFIRMADO: "Confirmado",
  RECHAZADO: "Rechazado",
  CONVERTIDO_A_CREDITO: "Convertido en crédito",
};

interface DetailFieldProps {
  label: string;
  value: string;
  align?: "left" | "right";
}

function DetailField({ label, value, align = "left" }: DetailFieldProps) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="font-sans text-[10px] uppercase tracking-wide text-secondary/40">
        {label}
      </p>
      <p className="mt-1 font-sans text-xs text-secondary">{value}</p>
    </div>
  );
}

function describeDeposit(reservation: CalendarReservation): string {
  if (!reservation.depositStatus) return "Sin depósito";
  const label = DEPOSIT_LABELS[reservation.depositStatus];
  return reservation.depositAmount !== null
    ? `${label} · ${formatCopFromThousands(reservation.depositAmount)}`
    : label;
}

export function ReservationDetails({ reservation }: ReservationDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DetailField label="Teléfono" value={reservation.phone} />
      <DetailField
        label="Precio"
        value={formatCopFromThousands(reservation.price)}
        align="right"
      />
      <DetailField label="Categoría" value={reservation.categoryName} />
      <DetailField
        label="Duración"
        value={`${reservation.durationMinutes} min`}
        align="right"
      />
      <DetailField label="Depósito" value={describeDeposit(reservation)} />
      {reservation.checkedInAt && (
        <DetailField
          label="Llegada"
          value={formatBogotaTime(reservation.checkedInAt)}
          align="right"
        />
      )}
      {reservation.cancellationReason && (
        <div className="col-span-2">
          <DetailField label="Motivo de cancelación" value={reservation.cancellationReason} />
        </div>
      )}
    </div>
  );
}
