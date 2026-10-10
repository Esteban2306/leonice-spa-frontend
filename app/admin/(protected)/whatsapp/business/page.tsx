import { Suspense } from "react";

import { BusinessSection } from "@/src/features/admin/whatsapp/sections/business-section";

export default function WhatsappBusinessPage() {
  return (
    <Suspense>
      <BusinessSection />
    </Suspense>
  );
}
