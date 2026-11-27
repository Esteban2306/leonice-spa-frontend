import { Suspense } from "react";

import { BookingWizard } from "@/src/features/admin/calendar/page/booking-wizard";

export default function NewReservationPage() {
  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  );
}
