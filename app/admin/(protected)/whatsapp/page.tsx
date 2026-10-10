import { Suspense } from "react";

import { OverviewSection } from "@/src/features/admin/whatsapp/sections/overview-section";

export default function WhatsappOverviewPage() {
  return (
    <Suspense>
      <OverviewSection />
    </Suspense>
  );
}
