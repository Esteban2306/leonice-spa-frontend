import { Suspense } from "react";

import { CampaignDetailContainer } from "@/src/features/admin/campaigns/page/campaign-detail-container";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  return (
    <Suspense>
      <CampaignDetailContainer campaignId={campaignId} />
    </Suspense>
  );
}
