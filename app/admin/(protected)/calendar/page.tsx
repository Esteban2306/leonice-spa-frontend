import { Suspense } from "react";

import { CalendarContainer } from "@/src/features/admin/calendar/page/calendar-container";

export default function CalendarPage() {
  return (
    <main className="contents">
      <Suspense>
        <CalendarContainer />
      </Suspense>
    </main>
  );
}
