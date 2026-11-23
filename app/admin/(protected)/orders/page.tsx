import { Suspense } from "react";

import { OrdersContainer } from "@/src/features/admin/orders/page/orders-container";

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContainer />
    </Suspense>
  );
}
