import type { CampaignStatus } from "@/src/features/admin/types/campaigns.types";

import { CAMPAIGN_STATUS_LABELS } from "../lib/campaign-format";

const TONE: Record<CampaignStatus, string> = {
  RUNNING: "border-green-300 bg-green-50 text-green-800",
  PAUSED: "border-amber-300 bg-amber-50 text-amber-900",
  COMPLETED: "border-tertiary/60 bg-quaternary/30 text-secondary",
  CANCELLED: "border-secondary/15 bg-white text-secondary/65",
};

export function CampaignStatusChip({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[11px] ${TONE[status]}`}
    >
      {CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}
