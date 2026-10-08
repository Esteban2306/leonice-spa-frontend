import { Ban, CalendarCheck2, CircleCheck, TimerOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { DashboardReservationItem } from "@/src/features/admin/types/dashboard.types";
import { describeReservationStatus } from "@/src/features/admin/utils/reservation-status.utils";

interface ReservationStateBadgeProps {
  item: Pick<DashboardReservationItem, "status" | "cancellationSource" | "isToday">;
}

interface Presentation {
  label: string;
  Icon: LucideIcon;
  className: string;
}

function present(item: ReservationStateBadgeProps["item"]): Presentation {
  if (item.status === "CONFIRMADA") {
    return {
      label: item.isToday ? "Confirmada · hoy" : "Confirmada",
      Icon: CalendarCheck2,
      className: "border-secondary/20 bg-secondary text-primary",
    };
  }

  if (item.status === "COMPLETADA") {
    return {
      label: "Completada",
      Icon: CircleCheck,
      className: "border-green-300 bg-green-100 text-green-800",
    };
  }

  if (item.status === "CANCELADA" && item.cancellationSource === "TIMEOUT") {
    return {
      label: "Venció el depósito",
      Icon: TimerOff,
      className: "border-amber-300 bg-amber-100 text-amber-800",
    };
  }

  return {
    label: describeReservationStatus(item.status, item.cancellationSource),
    Icon: Ban,
    className: "border-red-300 bg-red-100 text-red-800",
  };
}

export function ReservationStateBadge({ item }: ReservationStateBadgeProps) {
  const { label, Icon, className } = present(item);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs font-medium ${className}`}
    >
      <Icon className="size-3.5" strokeWidth={1.8} />
      {label}
    </span>
  );
}
