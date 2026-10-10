import { CalendarDays, Clock3 } from "lucide-react";

import type { DashboardReservationItem } from "@/src/features/admin/types/dashboard.types";

import { DepositCountdown } from "./depositCountdown";
import { AssessmentCallout } from "../../components/hair-assessment/assessment-callout";

interface ReservationItemScheduleProps {
  item: DashboardReservationItem;
  dateLabel: string;
  compact?: boolean;
  clientId: string;
  clientName: string;
}

export function ReservationItemSchedule({
  item,
  dateLabel,
  compact = false,
  clientId,
  clientName,
}: ReservationItemScheduleProps) {
  const iconClass = compact ? "size-4 text-secondary" : "size-5 text-secondary";
  const textClass = compact
    ? "font-sans text-sm text-secondary"
    : "font-sans text-base text-secondary";

  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-3"}`}>
      <div className="flex items-center gap-3">
        <CalendarDays className={iconClass} strokeWidth={1.7} />
        <span className={textClass}>{dateLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <Clock3 className={iconClass} strokeWidth={1.7} />
        <span className={textClass}>{item.timeLabel}</span>
      </div>

      {item.status === "PENDIENTE_DEPOSITO" && (
        <DepositCountdown
          expiresAt={item.depositExpiresAt}
          proofStatus={item.proofStatus}
        />
      )}

      <AssessmentCallout
        assessment={item.assessment}
        clientId={clientId}
        clientName={clientName}
        treatmentName={item.treatmentName}
      />
    </div>
  );
}
