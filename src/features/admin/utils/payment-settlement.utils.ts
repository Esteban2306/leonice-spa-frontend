export type PaymentMethodLabel = "EFECTIVO" | "TRANSFERENCIA" | "MIXTO";

export interface SettlementBreakdown {
  pricePesos: number;
  advancePesos: number;
  cashPesos: number;
  transferPesos: number;
}

export function balanceDuePesos(pricePesos: number, advancePesos: number) {
  return Math.max(pricePesos - advancePesos, 0);
}

export function collectedMatchesBalance(breakdown: SettlementBreakdown) {
  return (
    breakdown.cashPesos + breakdown.transferPesos ===
    balanceDuePesos(breakdown.pricePesos, breakdown.advancePesos)
  );
}

export function derivePaymentMethod(
  breakdown: Pick<
    SettlementBreakdown,
    "advancePesos" | "cashPesos" | "transferPesos"
  >,
): PaymentMethodLabel {
  const nonCash = breakdown.transferPesos + breakdown.advancePesos;
  if (breakdown.cashPesos > 0 && nonCash > 0) return "MIXTO";
  if (breakdown.cashPesos > 0) return "EFECTIVO";
  return "TRANSFERENCIA";
}

export const PAYMENT_METHOD_LABELS: Readonly<
  Record<PaymentMethodLabel, string>
> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  MIXTO: "Mixto (efectivo y transferencia)",
};
