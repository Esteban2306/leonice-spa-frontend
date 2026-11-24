import type {
  FindProductOrdersParams,
  ProductFulfillment,
  ProductOrder,
  ProductOrderStatus,
  ProductPaymentMethod,
  ProductOrdersSummary,
} from "@/src/features/admin/types/product-orders.types";

export type OrderTab = "TO_VERIFY" | "PAGADO" | "ENTREGADO" | "CANCELADO";

export const ORDER_TABS: ReadonlyArray<{ value: OrderTab; label: string }> = [
  { value: "TO_VERIFY", label: "Por verificar" },
  { value: "PAGADO", label: "Por entregar" },
  { value: "ENTREGADO", label: "Entregados" },
  { value: "CANCELADO", label: "Cancelados" },
];

export function tabParams(tab: OrderTab): FindProductOrdersParams {
  return tab === "TO_VERIFY"
    ? { view: "TO_VERIFY", pageSize: 50 }
    : { status: tab, pageSize: 50 };
}

export function tabCount(
  tab: OrderTab,
  summary: ProductOrdersSummary | null,
): number | null {
  if (!summary) return null;
  return tab === "TO_VERIFY" ? summary.toVerify : summary.counts[tab];
}

const OPEN: readonly ProductOrderStatus[] = [
  "PENDIENTE_PAGO",
  "PAGO_EN_REVISION",
];

export const isOpen = (order: ProductOrder) => OPEN.includes(order.status);

export const FULFILLMENT_TEXT: Record<ProductFulfillment, string> = {
  DOMICILIO: "🛵 A domicilio",
  RECOGER: "🏠 Recoge en el spa",
};

export const PAYMENT_TEXT: Record<ProductPaymentMethod, string> = {
  TRANSFERENCIA: "Transferencia",
  CONTRAENTREGA: "Efectivo al recibirlo",
  EN_TIENDA: "Paga en el spa",
};

export function paymentStatus(order: ProductOrder): string | null {
  if (order.paymentMethod !== "TRANSFERENCIA") return null;
  if (order.status === "PAGO_EN_REVISION") return "Comprobante recibido";
  if (order.status === "PENDIENTE_PAGO") return "Aún no envía el comprobante";
  return null;
}

export function verifyLabel(order: ProductOrder): string {
  return order.fulfillment === "DOMICILIO"
    ? "Verificar y avisar que va en camino"
    : order.fulfillment === "RECOGER"
      ? "Verificar y avisar que puede recogerlo"
      : "Verificar y avisarle";
}

export function chatHref(
  phone: string | null,
  conversationId?: string | null,
): string | null {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (!conversationId && digits.length < 10) return null;
  const params = new URLSearchParams();
  if (conversationId) params.set("chat", conversationId);
  if (digits.length >= 10) params.set("buscar", digits);
  return `/admin/whatsapp/inbox?${params.toString()}`;
}

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
  NO_TOTAL: "Un producto quedó sin precio: escribe el total antes de verificar",
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
  return order.total !== null && isOpen(order);
}

export function canDeliver(order: ProductOrder): boolean {
  return isOpen(order) || order.status === "PAGADO";
}
