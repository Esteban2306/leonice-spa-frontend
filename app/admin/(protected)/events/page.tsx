import { Suspense } from "react";

import { EventsContainer } from "@/src/features/admin/promo-events/page/events-container";

export default function EventsPage() {
  return (
    <Suspense>
      <EventsContainer />
    </Suspense>
  );
}
