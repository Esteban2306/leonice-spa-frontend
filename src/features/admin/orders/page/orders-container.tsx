"use client";

import { useState } from "react";

import {
  useProductOrderActions,
  useProductOrders,
  useProductOrdersSummary,
} from "@/src/features/admin/hooks/use-product-orders";
import { type OrderTab, tabParams } from "../lib/orders-page";
import { OrdersView } from "./orders-view";

export function OrdersContainer() {
  const [tab, setTab] = useState<OrderTab>("TO_VERIFY");
  const orders = useProductOrders(tabParams(tab));
  const summary = useProductOrdersSummary();
  const actions = useProductOrderActions();

  return (
    <OrdersView
      tab={tab}
      summary={summary.data ?? null}
      orders={orders.data?.items ?? []}
      isLoading={orders.isLoading}
      isError={orders.isError}
      isPending={actions.isPending}
      onTabChange={setTab}
      onVerify={(order) => void actions.verify(order.id)}
      onReject={(order, reason) => void actions.reject(order.id, reason)}
      onDeliver={(order) => void actions.deliver(order.id)}
      onCancel={(order) => void actions.cancel(order.id)}
      onSetTotal={(order, total) => void actions.setTotal(order.id, total)}
      onRetry={() => void orders.refetch()}
    />
  );
}
