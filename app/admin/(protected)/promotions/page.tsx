import { Suspense } from "react";

import { PromotionsContainer } from "@/src/features/admin/promotions/page/promotions-container";

export default function PromotionsPage() {
  return (
    <Suspense>
      <PromotionsContainer />
    </Suspense>
  );
}
