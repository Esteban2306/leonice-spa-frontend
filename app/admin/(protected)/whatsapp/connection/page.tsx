import { Suspense } from "react";

import { ConnectionSection } from "@/src/features/admin/whatsapp/sections/connection-section";

export default function WhatsappConnectionPage() {
  return (
    <Suspense>
      <ConnectionSection />
    </Suspense>
  );
}
