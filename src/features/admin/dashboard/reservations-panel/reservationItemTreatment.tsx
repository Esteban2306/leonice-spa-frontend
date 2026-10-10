import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { DashboardReservationItem } from "@/src/features/admin/types/dashboard.types";

import { DepositProofViewer } from "@/src/features/admin/components/reservation-actions/deposit-proof-viewer";
import { AssessmentCallout } from "@/src/features/admin/components/hair-assessment/assessment-callout";
import { ProofStatusNote } from "./proofStatusBadge";

interface ReservationItemTreatmentProps {
  item: DashboardReservationItem;
  clientName: string;
}

const LABEL = "font-sans text-xs uppercase tracking-[0.18em] text-secondary/50";

export function ReservationItemTreatment({
  item,
  clientName,
}: ReservationItemTreatmentProps) {
  const showProof =
    item.status === "PENDIENTE_DEPOSITO" || item.proofUrl !== null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className={LABEL}>Tratamiento</span>
        <p className="mt-2 font-sans text-lg leading-7 text-secondary">
          {item.treatmentName}
        </p>
        <p className="mt-1 font-sans text-sm text-secondary/55">
          {item.durationMinutes} min · {item.categoryLabel}
        </p>
      </div>

      <div>
        <span className={LABEL}>Precio</span>
        <p className="mt-2 font-sans text-xl text-secondary">
          {formatCopFromThousands(item.priceThousands)}
        </p>
      </div>

      {item.status === "CANCELADA" && item.cancellationReason && (
        <div>
          <span className={LABEL}>Motivo</span>
          <p className="mt-2 font-sans text-sm text-secondary/75">
            {item.cancellationReason}
          </p>
        </div>
      )}

      {showProof && (
        <div>
          <span className={LABEL}>Comprobante</span>
          <div className="mt-2 flex items-center gap-4">
            {item.proofUrl ? (
              <DepositProofViewer
                proofUrl={item.proofUrl}
                clientName={clientName}
              />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-tertiary/40 p-1 text-center font-sans text-[10px] leading-tight text-secondary/50">
                Sin comprobante
              </div>
            )}
            <ProofStatusNote status={item.proofStatus} />
          </div>
        </div>
      )}
    </div>
  );
}
