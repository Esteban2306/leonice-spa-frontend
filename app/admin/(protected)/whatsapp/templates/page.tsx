import { Suspense } from "react";

import { TemplatesSection } from "@/src/features/admin/whatsapp/sections/templates-section";

export default function WhatsappTemplatesPage() {
  return (
    <Suspense>
      <TemplatesSection />
    </Suspense>
  );
}
