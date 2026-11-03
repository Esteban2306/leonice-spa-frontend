import type { Campaign } from "@/src/features/admin/types/campaigns.types";

import { campaignProgress } from "../lib/campaign-format";

interface CampaignProgressProps {
  campaign: Pick<Campaign, "total" | "sent" | "failed" | "skipped" | "status">;
  large?: boolean;
  onDark?: boolean;
}

export function CampaignProgress({
  campaign,
  large = false,
  onDark = false,
}: CampaignProgressProps) {
  const percent = campaignProgress(campaign);
  const done = campaign.sent + campaign.failed + campaign.skipped;
  const barTone =
    campaign.status === "PAUSED"
      ? "bg-amber-500"
      : campaign.status === "CANCELLED"
        ? "bg-secondary/30"
        : "bg-tertiary";

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Avance del envío"
        className={`w-full overflow-hidden rounded-full ${onDark ? "bg-primary/20" : "bg-secondary/10"} ${large ? "h-4" : "h-2.5"}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ${barTone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p
        className={`flex flex-wrap items-center justify-between gap-2 font-sans text-xs ${onDark ? "text-primary/80" : "text-secondary/75"}`}
      >
        <span className="tabular-nums">
          {done} de {campaign.total} · {percent}%
        </span>
        <span className="tabular-nums">
          {campaign.sent} enviados
          {campaign.failed > 0 && ` · ${campaign.failed} fallaron`}
          {campaign.skipped > 0 && ` · ${campaign.skipped} omitidas`}
        </span>
      </p>
    </div>
  );
}
