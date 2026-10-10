import { Suspense } from "react";

import { AssistantSection } from "@/src/features/admin/whatsapp/sections/assistant-section";

export default function WhatsappAssistantPage() {
  return (
    <Suspense>
      <AssistantSection />
    </Suspense>
  );
}
