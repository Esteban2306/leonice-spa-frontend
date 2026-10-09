import { Suspense } from "react";

import { ServicesContainer } from "@/src/features/admin/services/page/services-container";

export default function ServicesPage() {
  return (
    <Suspense>
      <ServicesContainer />
    </Suspense>
  );
}
