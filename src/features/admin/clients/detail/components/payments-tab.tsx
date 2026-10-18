import { Receipt, Wallet } from "lucide-react";

import { formatBogotaDayLabel } from "@/src/lib/date/bogota";
import { formatCopFromThousands } from "@/src/lib/money/cop";
import { DepositProofViewer } from "@/src/features/admin/components/reservation-actions/deposit-proof-viewer";
import type { ClientCredit, DepositRecordView } from "@/src/features/admin/types/deposits.types";
import type { DepositStatus } from "@/src/features/admin/types/enums";

interface PaymentsTabProps {
  clientName: string;
  deposits: readonly DepositRecordView[];
  credits: readonly ClientCredit[];
  isLoading: boolean;
}

const STATUS: Record<DepositStatus, { label: string; className: string }> = {
  PENDIENTE: { label: "En revisión", className: "bg-amber-100 text-amber-900" },
  CONFIRMADO: { label: "Confirmado", className: "bg-green-100 text-green-800" },
  RECHAZADO: { label: "Rechazado", className: "bg-red-100 text-red-800" },
  CONVERTIDO_A_CREDITO: { label: "En crédito", className: "bg-quaternary/40 text-secondary" },
};

const COVERAGE = { ANTICIPO: "Anticipo", PAGO_COMPLETO: "Pago completo" } as const;

export function PaymentsTab({ clientName, deposits, credits, isLoading }: PaymentsTabProps) {
  const totalPaid = deposits
    .filter((deposit) => deposit.status === "CONFIRMADO" && deposit.amount)
    .reduce((sum, deposit) => sum + Number(deposit.amount), 0);
  const totalCredit = credits.reduce((sum, credit) => sum + Number(credit.amount), 0);

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[2rem] bg-secondary p-5 text-primary">
          <Receipt className="size-5 text-quaternary" />
          <p className="mt-3 font-sans text-xs uppercase tracking-[0.18em] text-primary/60">Total pagado</p>
          <p className="mt-1 font-heading text-3xl">{formatCopFromThousands(totalPaid)}</p>
        </div>
        <div className="rounded-[2rem] border border-tertiary/40 bg-quaternary/30 p-5 text-secondary">
          <Wallet className="size-5" />
          <p className="mt-3 font-sans text-xs uppercase tracking-[0.18em] text-secondary/70">Crédito disponible</p>
          <p className="mt-1 font-heading text-3xl">{formatCopFromThousands(totalCredit)}</p>
          <p className="mt-1 font-sans text-xs text-secondary/70">Se aplica automáticamente en su próxima reserva.</p>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[2rem] border border-tertiary/25 bg-[#FCF6EB] p-5">
        <h2 className="font-heading text-xl text-secondary">Depósitos</h2>
        {isLoading && <p className="font-sans text-sm text-secondary/70">Cargando pagos…</p>}
        {!isLoading && deposits.length === 0 && (
          <p className="font-sans text-sm text-secondary/70">Aún no hay depósitos registrados.</p>
        )}
        <ul className="flex flex-col gap-2">
          {deposits.map((deposit) => (
            <li key={deposit.id} className="flex items-center gap-3 rounded-2xl border border-secondary/10 bg-white p-3">
              {deposit.imageUrl ? (
                <DepositProofViewer proofUrl={deposit.imageUrl} clientName={clientName} />
              ) : (
                <span className="grid size-14 shrink-0 place-items-center rounded-lg border border-dashed border-tertiary/40 text-center font-sans text-[10px] text-secondary/70">Sin imagen</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-sans text-sm text-secondary">
                  {deposit.reservation.treatment.name} · {formatBogotaDayLabel(deposit.reservation.scheduledStart)}
                </span>
                <span className="block font-sans text-xs text-secondary/70">
                  {deposit.coverage ? COVERAGE[deposit.coverage] : "Cobertura por definir"}
                  {deposit.amount ? ` · ${formatCopFromThousands(deposit.amount)}` : ""}
                  {deposit.rejectionReason ? ` · ${deposit.rejectionReason}` : ""}
                </span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 font-sans text-[11px] ${STATUS[deposit.status].className}`}>
                {STATUS[deposit.status].label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
