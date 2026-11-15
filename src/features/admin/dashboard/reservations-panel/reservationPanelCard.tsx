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
    <article className="@container overflow-hidden rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB]">
      <div className="@5xl:hidden">
        <ReservationPanelMobile {...props} />
      </div>
      <div className="hidden @5xl:block">
        <ReservationPanelDesktop {...props} />
      </div>
    </article>
  );
}
