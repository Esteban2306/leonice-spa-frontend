"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";

import type { PendingReservation } from "@/src/features/admin/types/dashboard.types";

import { ReservationActionsPopover } from "./reservationActionsPopover";

interface PendingReservationMobileProps {
  reservation: PendingReservation;

  onAccept: (reservationId: string) => void;
  onReschedule: (reservationId: string) => void;
  onContactClient: (clientId: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
  onViewProof: (reservationId: string, proofUrl: string) => void;
}

export function PendingReservationMobile({
  reservation,
  onAccept,
  onReschedule,
  onContactClient,
  onViewClient,
  onCancel,
  onViewProof,
}: PendingReservationMobileProps) {
  const { reservationId, clientId, client, appointment, deposit } = reservation;

  return (
    <Accordion>
      <AccordionItem value={reservationId} className="border-none">
        <AccordionTrigger
          className="
            px-4
            py-4
            no-underline
            hover:no-underline
            sm:px-5
          "
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 pr-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-quaternary/30">
              {client.avatarUrl ? (
                <Image
                  src={client.avatarUrl}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <UserRound className="size-5 text-secondary/50" />
                </div>
              )}
            </div>

            <div className="min-w-0 text-left">
              <h3 className="truncate font-sans text-lg text-secondary">
                {client.name}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-tertiary" />

                <span className="font-sans text-xs text-secondary/65">
                  Por confirmar
                </span>
              </div>

              <a
                href={`tel:${client.phone}`}
                onClick={(event) => event.stopPropagation()}
                className="mt-1 flex items-center gap-1.5 truncate font-sans text-xs text-secondary/60"
              >
                <Phone className="size-3.5 shrink-0" />
                {client.phone}
              </a>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 sm:px-5">
          <div className="flex flex-col gap-5 border-t border-tertiary/25 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-secondary/50">
                  Fecha
                </span>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-secondary" />
                    <span className="font-sans text-sm text-secondary">
                      {appointment.dateLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-secondary" />
                    <span className="font-sans text-sm text-secondary">
                      {appointment.timeLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-secondary/50">
                  Tratamiento
                </span>

                <p className="mt-2 font-sans text-sm leading-6 text-secondary">
                  {appointment.treatmentName}
                </p>

                <p className="mt-1 font-sans text-xs text-secondary/55">
                  {appointment.durationMinutes} min · {appointment.roomLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-quaternary/20 p-3">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-secondary/50">
                  Adelanto
                </span>

                <p className="mt-1 font-sans text-lg text-secondary">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(deposit.amount)}
                </p>

                {deposit.verified && (
                  <div className="mt-1 flex items-center gap-1.5 font-sans text-xs text-green-800">
                    <ShieldCheck className="size-3.5" />
                    Verificado
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-label={`Ver comprobante de ${client.name}`}
                onClick={() => onViewProof(reservationId, deposit.proofUrl)}
                className="group relative size-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-tertiary/30 bg-white"
              >
                <Image
                  src={deposit.proofUrl}
                  alt="Comprobante de pago"
                  fill
                  sizes="56px"
                  className="object-cover"
                />

                <span className="absolute inset-0 flex items-center justify-center bg-secondary/0 text-primary opacity-0 transition-all group-hover:bg-secondary/60 group-hover:opacity-100">
                  <Eye className="size-5" />
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() => onAccept(reservationId)}
                className="h-12 rounded-xl bg-secondary font-sans text-sm text-primary hover:bg-secondary/90"
              >
                <Check className="size-4" />
                Aceptar
              </Button>

              <ReservationActionsPopover
                reservationId={reservationId}
                clientId={clientId}
                clientName={client.name}
                onReschedule={onReschedule}
                onContactClient={onContactClient}
                onViewClient={onViewClient}
                onCancel={onCancel}
              />
            </div>

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
