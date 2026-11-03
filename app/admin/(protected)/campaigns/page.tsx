import { Suspense } from "react";

import { CampaignsContainer } from "@/src/features/admin/campaigns/page/campaigns-container";

export default function CampaignsPage() {
  return (
    <Suspense>
      <CampaignsContainer />
    </Suspense>
  );
}
