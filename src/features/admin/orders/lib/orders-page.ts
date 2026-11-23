import type {
  ProductOrder,
  ProductOrderStatus,
} from "@/src/features/admin/types/product-orders.types";

export const ORDER_TABS: ReadonlyArray<{
  value: ProductOrderStatus;
  label: string;
}> = [
  { value: "PAGO_EN_REVISION", label: "Por verificar" },
  { value: "PENDIENTE_PAGO", label: "Esperando pago" },
  { value: "PAGADO", label: "Por entregar" },
  { value: "ENTREGADO", label: "Entregados" },
  { value: "CANCELADO", label: "Cancelados" },
];

export function formatPesos(value: number | null): string {
  return value === null
    ? "Por confirmar"
    : `$${Math.round(value).toLocaleString("es-CO")}`;
}

export type PaymentCheck = "MATCHES" | "SHORT" | "UNREAD" | "NO_TOTAL";

export function paymentCheck(order: ProductOrder): PaymentCheck {
  if (order.total === null) return "NO_TOTAL";
  if (order.proofAmount === null) return "UNREAD";
  return order.proofAmount >= order.total ? "MATCHES" : "SHORT";
}

export const PAYMENT_CHECK_LABEL: Record<PaymentCheck, string> = {
  MATCHES: "El monto coincide con el total",
  SHORT: "El monto es menor que el total",
  UNREAD: "No se leyó el monto: revisa la foto",
  NO_TOTAL: "El pedido no tiene total: ponlo antes de verificar",
};

export function whatsappUrl(phone: string | null): string | null {
  const digits = phone?.replace(/\D/g, "") ?? "";
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
}

export function itemLine(item: ProductOrder["items"][number]): string {
  const presentation = item.presentation ? ` (${item.presentation})` : "";
  const price = item.promoPrice ?? item.unitPrice;
  return `${item.quantity} × ${item.productName}${presentation} · ${
    price === null ? "sin precio" : formatPesos(price)
  }${item.promotion ? ` · ${item.promotion}` : ""}`;
}

export function canVerify(order: ProductOrder): boolean {
  return (
    order.total !== null &&
    (order.status === "PAGO_EN_REVISION" || order.status === "PENDIENTE_PAGO")
  );
}
