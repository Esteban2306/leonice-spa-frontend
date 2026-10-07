"use client";

import { CalendarDays, Clock3, Phone } from "lucide-react";

import type {
  AcceptReservationHandler,
  PendingReservation,
} from "@/src/features/admin/types/dashboard.types";

import { AcceptReservationButton } from "./acceptReservationButton";
import { ClientAvatar } from "./clientAvatar";
import { DepositCountdown } from "./depositCountdown";
import { DepositProofViewer } from "./depositProofViewer";
import {
  PendingReservationStatusBadge,
  ProofStatusNote,
  getGroupProofStatus,
} from "./pendingReservationStatusBadge";
import { ReservationActionsPopover } from "./reservationActionsPopover";

interface PendingReservationDesktopProps {
  reservation: PendingReservation;

  isCancellingReservation: boolean;
  cancellingReservationId: string | null;

  onAccept: AcceptReservationHandler;
  onReschedule: (reservationId: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
}

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function PendingReservationDesktop({
  reservation,
  onAccept,
  isCancellingReservation,
  cancellingReservationId,
  onReschedule,
  onViewClient,
  onCancel,
}: PendingReservationDesktopProps) {
  const { clientId, client, dateLabel, items } = reservation;

  return (
    <div className="grid divide-y divide-tertiary/25 lg:grid-cols-[1.2fr_3.3fr] lg:divide-x lg:divide-y-0">
      <section className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <ClientAvatar name={client.name} size="lg" />

          <div className="min-w-0">
            <h3 className="font-sans text-2xl text-secondary">{client.name}</h3>

            <div className="mt-2">
              <PendingReservationStatusBadge
                status={getGroupProofStatus(items)}
              />
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
        {items.map((item) => {
          const { reservationId, proofUrl, proofStatus } = item;

          return (
            <div
              key={reservationId}
              className="grid divide-y divide-tertiary/25 lg:grid-cols-[1fr_1.3fr_14rem] lg:divide-x lg:divide-y-0"
            >
              <section className="p-4 sm:p-5">
                <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
                  Fecha
                </span>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      className="size-5 text-secondary"
                      strokeWidth={1.7}
                    />

                    <span className="font-sans text-base text-secondary">
                      {dateLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3
                      className="size-5 text-secondary"
                      strokeWidth={1.7}
                    />

                    <span className="font-sans text-base text-secondary">
                      {item.timeLabel}
                    </span>
                  </div>
                  <DepositCountdown
                    expiresAt={item.depositExpiresAt}
                    proofStatus={proofStatus}
                  />
                </div>
              </section>

              <section className="p-4 sm:p-5">
                <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
                  Tratamiento
                </span>

                <p className="mt-2 font-sans text-lg leading-7 text-secondary">
                  {item.treatmentName}
                </p>

                <p className="mt-2 font-sans text-sm text-secondary/55">
                  {item.durationMinutes} min · {item.categoryLabel}
                </p>

                <div className="mt-2">
                  <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
                    Precio
                  </span>

                  <p className="mt-2 font-sans text-xl text-secondary">
                    {COP_FORMATTER.format(item.totalPrice)}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="font-sans text-xs uppercase tracking-[0.18em] text-secondary/50">
                    Comprobante
                  </span>

                  <div className="mt-2 flex items-center gap-4">
                    {proofUrl ? (
                      <DepositProofViewer
                        proofUrl={proofUrl}
                        clientName={client.name}
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-lg border border-dashed border-tertiary/40 p-1 text-center font-sans text-[10px] leading-tight text-secondary/50">
                        Sin comprobante
                      </div>
                    )}

                    <ProofStatusNote status={proofStatus} />
                  </div>
                </div>
              </section>

              <section className="flex flex-col justify-center gap-3 p-4 sm:p-3">
                <AcceptReservationButton
                  reservationId={reservationId}
                  proofStatus={proofStatus}
                  onAccept={onAccept}
                  className="h-12 rounded-xl bg-secondary font-sans text-base text-primary hover:bg-secondary/90"
                />

                <ReservationActionsPopover
                  reservationId={reservationId}
                  clientId={clientId}
                  clientName={client.name}
                  clientPhone={client.phone}
                  onReschedule={onReschedule}
                  onViewClient={onViewClient}
                  onCancel={onCancel}
                  isCancelling={
                    isCancellingReservation &&
                    cancellingReservationId === reservationId
                  }
                />
              </section>
            </div>
          );
        })}
      </div>
    </div>
  );
}
