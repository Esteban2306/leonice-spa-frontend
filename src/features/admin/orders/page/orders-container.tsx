"use client";

import { useState } from "react";

import {
  useProductOrderActions,
  useProductOrders,
  useProductOrdersSummary,
} from "@/src/features/admin/hooks/use-product-orders";
import type { ProductOrderStatus } from "@/src/features/admin/types/product-orders.types";

import { OrdersView } from "./orders-view";

export function OrdersContainer() {
  const [status, setStatus] = useState<ProductOrderStatus>("PAGO_EN_REVISION");
  const orders = useProductOrders({ status, pageSize: 50 });
  const summary = useProductOrdersSummary();
  const actions = useProductOrderActions();

  return (
    <OrdersView
      status={status}
      counts={summary.data?.counts ?? null}
      orders={orders.data?.items ?? []}
      isLoading={orders.isLoading}
      isError={orders.isError}
      isPending={actions.isPending}
      onStatusChange={setStatus}
      onVerify={(order) => void actions.verify(order.id)}
      onReject={(order, reason) => void actions.reject(order.id, reason)}
      onDeliver={(order) => void actions.deliver(order.id)}
      onCancel={(order) => void actions.cancel(order.id)}
      onSetTotal={(order, total) => void actions.setTotal(order.id, total)}
      onRetry={() => void orders.refetch()}
    />
  );
}
