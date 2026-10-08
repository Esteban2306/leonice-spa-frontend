import type { HairProfileStatus } from "@/src/features/admin/types/clients.types";

import { HAIR_STATUS_LABELS } from "../lib/client-crm";

const TONE: Record<HairProfileStatus, string> = {
  VALID: "border-green-300 bg-green-50 text-green-800",
  EXPIRED: "border-amber-300 bg-amber-50 text-amber-900",
  MISSING: "border-secondary/15 bg-white text-secondary/65",
};

export function HairStatusChip({ status }: { status: HairProfileStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans text-[11px] ${TONE[status]}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          status === "VALID" ? "bg-green-700" : status === "EXPIRED" ? "bg-amber-600" : "bg-secondary/30"
        }`}
      />
      {HAIR_STATUS_LABELS[status]}
    </span>
  );
}
