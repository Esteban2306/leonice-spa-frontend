import { Suspense } from "react";

import { DashboardContainer } from "@/src/features/admin/dashboard/page/dashboardContainer";

export default function AdminPage() {
  return (
    <Suspense>
      <DashboardContainer />
    </Suspense>
  );
}
