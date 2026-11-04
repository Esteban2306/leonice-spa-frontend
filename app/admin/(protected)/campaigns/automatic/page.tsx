import { Suspense } from "react";

import { AutomaticMessagesContainer } from "@/src/features/admin/campaigns/page/automatic-messages-container";

export default function AutomaticMessagesPage() {
  return (
    <Suspense>
      <AutomaticMessagesContainer />
    </Suspense>
  );
}
