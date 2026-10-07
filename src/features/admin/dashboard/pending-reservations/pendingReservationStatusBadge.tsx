import { Clock3, FileCheck, FileX, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  PendingReservationItem,
  ProofStatus,
} from "@/src/features/admin/types/dashboard.types";

const PROOF_STATUS_PRIORITY: readonly ProofStatus[] = [
  "UNDER_REVIEW",
  "REJECTED",
  "NONE",
  "VERIFIED",
];

interface BadgePresentation {
  label: string;
  Icon: LucideIcon;
  className: string;
}

const BADGE_BY_STATUS: Record<ProofStatus, BadgePresentation> = {
  UNDER_REVIEW: {
    label: "Revisar comprobante",
    Icon: FileCheck,
    className: "border-tertiary/40 bg-tertiary/20 text-secondary",
  },
  REJECTED: {
    label: "Comprobante rechazado",
    Icon: FileX,
    className: "border-red-300 bg-red-100 text-red-800",
  },
  NONE: {
    label: "Esperando depósito",
    Icon: Clock3,
    className: "border-tertiary/40 bg-quaternary/30 text-secondary",
  },
  VERIFIED: {
    label: "Depósito verificado",
    Icon: ShieldCheck,
    className: "border-green-300 bg-green-100 text-green-800",
  },
};

export function getGroupProofStatus(
  items: readonly PendingReservationItem[],
): ProofStatus {
  const present = new Set(items.map((item) => item.proofStatus));

  return PROOF_STATUS_PRIORITY.find((status) => present.has(status)) ?? "NONE";
}

interface PendingReservationStatusBadgeProps {
  status: ProofStatus;
}

export function PendingReservationStatusBadge({
  status,
}: PendingReservationStatusBadgeProps) {
  const { label, Icon, className } = BADGE_BY_STATUS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs font-medium ${className}`}
    >
      <Icon className="size-3.5" strokeWidth={1.8} />
      {label}
    </span>
  );
}

interface ProofStatusNoteProps {
  status: ProofStatus;
}

export function ProofStatusNote({ status }: ProofStatusNoteProps) {
  if (status === "VERIFIED") {
    return (
      <p className="flex items-center gap-1.5 font-sans text-sm text-green-800">
        <ShieldCheck className="size-4 shrink-0" strokeWidth={1.8} />
        Comprobante verificado
      </p>
    );
  }

  if (status === "REJECTED") {
    return (
      <p className="flex items-center gap-1.5 font-sans text-sm text-red-800">
        <FileX className="size-4 shrink-0" strokeWidth={1.8} />
        Comprobante rechazado
      </p>
    );
  }

  return null;
}
