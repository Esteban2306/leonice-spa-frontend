"use client";

import Link from "@/src/features/admin/components/admin-link";
import { Package } from "lucide-react";

import { BrandLoader } from "@/src/components/brand/brand-loader";
import { useProductOrders } from "@/src/features/admin/hooks/use-product-orders";
import {
  formatPesos,
  FULFILLMENT_TEXT,
  itemLine,
  PAYMENT_TEXT,
} from "@/src/features/admin/orders/lib/orders-page";
import type { ProductOrderStatus } from "@/src/features/admin/types/product-orders.types";

const STATUS: Record<ProductOrderStatus, { label: string; className: string }> =
  {
    PENDIENTE_PAGO: {
      label: "Por verificar",
      className: "bg-amber-100 text-amber-900",
    },
    PAGO_EN_REVISION: {
      label: "Por verificar",
      className: "bg-amber-100 text-amber-900",
    },
    PAGADO: {
      label: "Por entregar",
      className: "bg-quaternary/40 text-secondary",
    },
    ENTREGADO: { label: "Entregado", className: "bg-green-100 text-green-800" },
    CANCELADO: {
      label: "Cancelado",
      className: "bg-secondary/10 text-secondary/70",
    },
  };

const day = (value: string) =>
  new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function OrdersTab({ clientId }: { clientId: string }) {
  const orders = useProductOrders({ clientId, pageSize: 30 });
  const items = orders.data?.items ?? [];

  if (orders.isLoading) {
    return <BrandLoader variant="compact" label="Cargando pedidos…" />;
  }
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[2rem] border border-dashed border-tertiary/40 p-8 text-center font-sans text-sm text-secondary/70">
        <Package className="size-6 text-tertiary" aria-hidden />
        Todavía no ha pedido productos.
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((order) => {
        const status = STATUS[order.status];
        return (
          <li
            key={order.id}
            className="flex flex-col gap-2 rounded-[1.5rem] border border-tertiary/25 bg-[#FCF6EB] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-sans text-sm font-semibold text-secondary">
                Pedido {order.code} · {day(order.createdAt)}
              </p>
              <span
                className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <ul className="font-sans text-sm text-secondary/80">
              {order.items.map((item) => (
                <li key={item.id}>{itemLine(item)}</li>
              ))}
            </ul>
            <p className="font-sans text-xs text-secondary/70">
              {order.fulfillment
                ? FULFILLMENT_TEXT[order.fulfillment]
                : "Entrega sin indicar"}
              {order.deliveryAddress ? ` · ${order.deliveryAddress}` : ""}
              {order.paymentMethod
                ? ` · ${PAYMENT_TEXT[order.paymentMethod]}`
                : ""}
            </p>
            <div className="flex items-center justify-between">
              <p className="font-sans text-base font-bold text-secondary tabular-nums">
                {formatPesos(order.total)}
              </p>
              <Link
                href="/admin/orders"
                className="font-sans text-sm font-semibold text-secondary underline"
              >
                Ver en pedidos
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
