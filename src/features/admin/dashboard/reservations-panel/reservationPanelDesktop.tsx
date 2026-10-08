"use client";

import { Phone } from "lucide-react";

import type { DashboardReservation } from "@/src/features/admin/types/dashboard.types";

import { ClientAvatar } from "./clientAvatar";
import type { ReservationPanelHandlers } from "./panelHandlers";
import { ReservationGroupBadge } from "./reservationGroupBadge";
import { ReservationItemActions } from "./reservationItemActions";
import { ReservationItemSchedule } from "./reservationItemSchedule";
import { ReservationItemTreatment } from "./reservationItemTreatment";

interface ReservationPanelDesktopProps extends ReservationPanelHandlers {
  reservation: DashboardReservation;
}

export function ReservationPanelDesktop({
  reservation,
  actions,
  onOpenInCalendar,
  onReschedule,
  onViewClient,
}: ReservationPanelDesktopProps) {
  const { clientId, client, dateLabel, items, isCombo } = reservation;
  const panelClient = { clientId, name: client.name, phone: client.phone, isCombo };

  return (
    <div className="grid divide-y divide-tertiary/25 lg:grid-cols-[1.2fr_3.3fr] lg:divide-x lg:divide-y-0">
      <section className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <ClientAvatar name={client.name} size="lg" />

          <div className="min-w-0">
            <h3 className="font-sans text-2xl text-secondary">{client.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ReservationGroupBadge reservation={reservation} />
              {isCombo && (
                <span className="font-sans text-xs text-secondary/60">
                  {items.length} tratamientos
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={`tel:${client.phone}`}
          className="mt-5 flex w-fit items-center gap-2 font-sans text-base text-secondary/65 transition-colors hover:text-secondary"
        >
          <Phone className="size-4" strokeWidth={1.7} />
          {client.phone}
        </a>

        <button
          type="button"
          onClick={() => onViewClient(clientId)}
          className="mt-3 cursor-pointer font-sans text-sm text-tertiary underline decoration-tertiary/50 underline-offset-4 hover:text-secondary"
        >
          Historial en CRM
        </button>
      </section>

      <div className="flex flex-col divide-y divide-tertiary/25">
        {items.map((item) => (
          <div
            key={item.reservationId}
            className="grid divide-y divide-tertiary/25 lg:grid-cols-[1fr_1.3fr_14rem] lg:divide-x lg:divide-y-0"
          >
            <section className="p-4 sm:p-5">
              <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
                Fecha
              </span>
              <div className="mt-4">
                <ReservationItemSchedule item={item} dateLabel={dateLabel} />
              </div>
            </section>

            <section className="p-4 sm:p-5">
              <ReservationItemTreatment item={item} clientName={client.name} />
            </section>

            <section className="flex flex-col justify-center p-4 sm:p-3">
              <ReservationItemActions
                item={item}
                client={panelClient}
                actions={actions}
                onOpenInCalendar={onOpenInCalendar}
                onReschedule={onReschedule}
                onViewClient={onViewClient}
              />
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
