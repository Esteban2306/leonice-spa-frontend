import { Suspense } from "react";

import { DeliveriesSection } from "@/src/features/admin/whatsapp/sections/deliveries-section";

export default function WhatsappDeliveriesPage() {
  return (
    <Suspense>
      <DeliveriesSection />
    </Suspense>
  );
}
