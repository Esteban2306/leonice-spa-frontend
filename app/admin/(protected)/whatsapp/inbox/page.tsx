import { Suspense } from "react";

import { InboxSection } from "@/src/features/admin/whatsapp/sections/inbox-section";

export default function WhatsappInboxPage() {
  return (
    <Suspense>
      <InboxSection />
    </Suspense>
  );
}
