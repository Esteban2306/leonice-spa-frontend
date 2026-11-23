"use client";

import AdminLink from "@/src/features/admin/components/admin-link";
import { ShoppingBag } from "lucide-react";

import { useProductOrdersSummary } from "@/src/features/admin/hooks/use-product-orders";

export function OrdersToVerifyNotice() {
  const summary = useProductOrdersSummary();
  const toVerify = summary.data?.toVerify ?? 0;
  const toDeliver = summary.data?.toDeliver ?? 0;
  if (toVerify === 0 && toDeliver === 0) return null;

  return (
    <AdminLink
      href="/admin/orders"
      className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-tertiary/40 bg-[#FCF6EB] px-5 py-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
    >
      <ShoppingBag className="size-5" strokeWidth={1.75} />
      <span className="font-semibold">
        {toVerify > 0
          ? `${toVerify} ${toVerify === 1 ? "comprobante de pedido" : "comprobantes de pedidos"} por verificar`
          : `${toDeliver} ${toDeliver === 1 ? "pedido pagado" : "pedidos pagados"} por entregar`}
      </span>
      <span className="text-secondary/70">
        Verifícalos en un clic desde Pedidos.
      </span>
    </AdminLink>
  );
}
