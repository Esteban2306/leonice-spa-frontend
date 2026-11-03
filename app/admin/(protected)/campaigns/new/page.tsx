import { Suspense } from "react";

import { CampaignComposerContainer } from "@/src/features/admin/campaigns/page/campaign-composer-container";

export default function NewCampaignPage() {
  return (
    <Suspense>
      <CampaignComposerContainer />
    </Suspense>
  );
}
