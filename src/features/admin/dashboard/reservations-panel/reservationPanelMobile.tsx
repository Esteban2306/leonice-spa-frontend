"use client";

import { Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import type { DashboardReservation } from "@/src/features/admin/types/dashboard.types";

import { ClientAvatar } from "./clientAvatar";
import type { ReservationPanelHandlers } from "./panelHandlers";
import { ReservationGroupBadge } from "./reservationGroupBadge";
import { ReservationItemActions } from "./reservationItemActions";
import { ReservationItemSchedule } from "./reservationItemSchedule";
import { ReservationItemTreatment } from "./reservationItemTreatment";

interface ReservationPanelMobileProps extends ReservationPanelHandlers {
  reservation: DashboardReservation;
}

export function ReservationPanelMobile({
  reservation,
  actions,
  onOpenInCalendar,
  onViewClient,
}: ReservationPanelMobileProps) {
  const { clientId, client, dateLabel, items, isCombo } = reservation;
  const panelClient = { clientId, name: client.name, phone: client.phone, isCombo };

  return (
    <Accordion>
      <AccordionItem value={reservation.groupKey} className="border-none">
        <AccordionTrigger className="px-4 py-4 no-underline hover:no-underline sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 pr-3">
            <ClientAvatar name={client.name} size="md" />

            <div className="min-w-0 text-left">
              <h3 className="truncate font-sans text-lg text-secondary">
                {client.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <ReservationGroupBadge reservation={reservation} />
                {isCombo && (
                  <span className="font-sans text-xs text-secondary/65">
                    {items.length} tratamientos
                  </span>
                )}
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 sm:px-5">
          <div className="flex flex-col gap-5 border-t border-tertiary/25 pt-4">
            <a
              href={`tel:${client.phone}`}
              className="flex w-fit items-center gap-2 font-sans text-sm text-secondary/70"
            >
              <Phone className="size-4 shrink-0" />
              {client.phone}
            </a>

            {items.map((item, index) => (
              <div
                key={item.reservationId}
                className={`flex flex-col gap-5 ${
                  index > 0 ? "border-t border-tertiary/25 pt-5" : ""
                }`}
              >
                <ReservationItemSchedule item={item} dateLabel={dateLabel} compact />
                <ReservationItemTreatment item={item} clientName={client.name} />
                <ReservationItemActions
                  item={item}
                  client={panelClient}
                  actions={actions}
                  onOpenInCalendar={onOpenInCalendar}
                  onViewClient={onViewClient}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => onViewClient(clientId)}
              className="w-fit cursor-pointer font-sans text-sm text-tertiary underline underline-offset-4"
            >
              Historial en CRM
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
