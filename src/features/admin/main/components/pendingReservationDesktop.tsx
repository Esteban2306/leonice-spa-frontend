"use client";

import { Button } from "@/src/components/ui/button";
import { PendingReservation } from "../../types/dashboard.types";
import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { ReservationActionsPopover } from "./reservationActionsPopover";
import Image from "next/image";

interface PendingReservationDesktopProps {
  reservation: PendingReservation;

  onAccept: (reservationId: string) => void;
  onReschedule: (reservationId: string) => void;
  onContactClient: (clientId: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
  onViewProof: (reservationId: string, proofUrl: string) => void;
}

export function PendingReservationDesktop({
  reservation,
  onAccept,
  onReschedule,
  onContactClient,
  onViewClient,
  onCancel,
  onViewProof,
}: PendingReservationDesktopProps) {
  const { reservationId, clientId, client, appointment, deposit } = reservation;

  return (
    <div className="grid divide-y divide-tertiary/25 lg:grid-cols-[1.2fr_1fr_1.3fr_14rem] lg:divide-x lg:divide-y-0">
      <section className="p-4 sm:p-5 max-h-65">
        <div className="flex items-start gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-quaternary/30">
            {client.avatarUrl ? (
              <Image
                src={client.avatarUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <UserRound className="size-6 text-secondary/50" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-sans text-2xl text-secondary">{client.name}</h3>

            <span className="mt-2 inline-flex rounded-full border border-tertiary/40 bg-quaternary/30 px-3 py-1 font-sans text-xs font-medium text-secondary">
              <span className="mr-2 size-1.5 self-center rounded-full bg-tertiary" />
              Por confirmar
            </span>
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

      <section className="p-4 sm:p-5 max-h-65">
        <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
          Fecha
        </span>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-secondary" strokeWidth={1.7} />

            <span className="font-sans text-base text-secondary">
              {appointment.dateLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="size-5 text-secondary" strokeWidth={1.7} />

            <span className="font-sans text-base text-secondary">
              {appointment.timeLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="p-4 sm:p-2 max-h-65">
        <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
          Tratamiento
        </span>

        <p className="mt-2 font-sans text-lg leading-7 text-secondary">
          {appointment.treatmentName} · {appointment.durationMinutes} min
        </p>

        <p className="mt-2 font-sans text-sm text-secondary/55">
          {appointment.durationMinutes} min · {appointment.roomLabel}
        </p>

        <div className="mt-2">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
            Adelanto
          </span>

          <div className="mt-2 flex items-center gap-4">
            <span className="font-sans text-xl text-secondary">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(deposit.amount)}
            </span>

            <button
              type="button"
              aria-label={`Ver comprobante de ${client.name}`}
              onClick={() => onViewProof(reservationId, deposit.proofUrl)}
              className="group relative size-14 cursor-pointer overflow-hidden rounded-lg border border-tertiary/30 bg-white"
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

          {deposit.verified && (
            <div className="mt-2 flex items-center gap-2 font-sans text-sm text-green-800">
              <ShieldCheck className="size-4" strokeWidth={1.8} />
              Comprobante verificado
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col justify-center gap-3 p-4 sm:p-3">
        <Button
          type="button"
          onClick={() => onAccept(reservationId)}
          className="h-12 rounded-xl bg-secondary font-sans text-base text-primary hover:bg-secondary/90 cursor-pointer"
        >
          <Check className="size-4" strokeWidth={2} />
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
      </section>
    </div>
  );
}
