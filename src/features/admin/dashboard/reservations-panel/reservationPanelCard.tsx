"use client";

import type { DashboardReservation } from "@/src/features/admin/types/dashboard.types";

import type { ReservationPanelHandlers } from "./panelHandlers";
import { ReservationPanelDesktop } from "./reservationPanelDesktop";
import { ReservationPanelMobile } from "./reservationPanelMobile";

interface ReservationPanelCardProps extends ReservationPanelHandlers {
  reservation: DashboardReservation;
}

export function ReservationPanelCard(props: ReservationPanelCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB]">
      <div className="lg:hidden">
        <ReservationPanelMobile {...props} />
      </div>
      <div className="hidden lg:block">
        <ReservationPanelDesktop {...props} />
      </div>
    </article>
  );
}
