"use client";

import { useState } from "react";
import {
  CalendarClock,
  Check,
  CircleCheckBig,
  CircleUserRound,
  Copy,
  FileX,
  Link2,
  LogIn,
  MessageCircle,
  RotateCcw,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ApproveDepositDialog } from "@/src/features/admin/components/reservation-actions/approve-deposit-dialog";
import { CancelReservationDialog } from "@/src/features/admin/components/reservation-actions/cancel-reservation-dialog";
import { DepositProofViewer } from "@/src/features/admin/components/reservation-actions/deposit-proof-viewer";
import { RejectDepositDialog } from "@/src/features/admin/components/reservation-actions/reject-deposit-dialog";
import type { ReservationActions as ReservationActionsApi } from "@/src/features/admin/hooks/use-reservation-actions";
import {
  canCheckIn,
  canRevive,
  isCancellableStatus,
} from "@/src/features/admin/utils/reservation-status.utils";

import type { CalendarReservation } from "../../types/calendar.types";

interface ReservationActionsProps {
  reservation: CalendarReservation;
  isToday: boolean;
  isUpcoming: boolean;
  belongsToCombo: boolean;
  actions: ReservationActionsApi;
  onViewClient: (clientId: string) => void;
  onReschedule: (reservationId: string) => void;
}

const PRIMARY =
  "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary font-sans text-sm text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50";

const SECONDARY =
  "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-secondary/15 bg-white/70 px-3 font-sans text-xs text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50";

interface SecondaryButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}

function SecondaryButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  title,
  className = "",
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${SECONDARY} ${className}`}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

export function ReservationActions({
  reservation,
  isToday,
  isUpcoming,
  belongsToCombo,
  actions,
  onViewClient,
  onReschedule,
}: ReservationActionsProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const isBusy = actions.busyReservationId === reservation.id;
  const { status } = reservation;
  const isLive = isCancellableStatus(status);
  const whatsappPhone = reservation.phone.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-2">
      {status === "PENDIENTE_DEPOSITO" && (
        <>
          {reservation.proofUrl && (
            <div className="flex items-center gap-3 rounded-2xl border border-secondary/10 bg-white/60 p-2">
              <DepositProofViewer
                proofUrl={reservation.proofUrl}
                clientName={reservation.clientName}
              />
              <span className="font-sans text-xs text-secondary/70">
                {reservation.isProofUnderReview
                  ? "Comprobante por revisar"
                  : "Último comprobante enviado"}
              </span>
            </div>
          )}

          <ApproveDepositDialog
            reservationId={reservation.id}
            clientName={reservation.clientName}
            priceThousands={reservation.price}
            hasProof={reservation.proofUrl !== null}
            belongsToGroup={belongsToCombo}
            onApprove={actions.approveDeposit}
            trigger={
              <button type="button" className={PRIMARY} disabled={isBusy}>
                <Check className="size-4" />
                Aprobar depósito
              </button>
            }
          />

          {reservation.isProofUnderReview && (
            <RejectDepositDialog
              reservationId={reservation.id}
              clientName={reservation.clientName}
              onReject={actions.rejectDeposit}
              trigger={
                <button
                  type="button"
                  disabled={isBusy}
                  className={`${SECONDARY} w-full border-red-200 text-red-700 hover:bg-red-50`}
                >
                  <FileX className="size-3.5" />
                  Rechazar comprobante
                </button>
              }
            />
          )}
        </>
      )}

      {canCheckIn(status, isToday) && (
        <button
          type="button"
          className={PRIMARY}
          disabled={isBusy}
          onClick={() => void actions.checkIn(reservation.id)}
        >
          <LogIn className="size-4" />
          {status === "NO_SHOW"
            ? "Registrar llegada tarde"
            : "Registrar llegada"}
        </button>
      )}

      {status === "CONFIRMADA" && !isToday && (
        <p className="text-center font-sans text-[11px] text-secondary/70">
          El check-in se habilita el día de la cita.
        </p>
      )}

      {status === "CITA_EN_CURSO" && (
        <button
          type="button"
          className={PRIMARY}
          disabled={isBusy}
          onClick={() => void actions.complete(reservation.id)}
        >
          <CircleCheckBig className="size-4" />
          Completar cita
        </button>
      )}

      {canRevive(status, reservation.cancellationSource, isUpcoming) && (
        <button
          type="button"
          className={PRIMARY}
          disabled={isBusy}
          onClick={() => void actions.revive(reservation.id)}
        >
          <RotateCcw className="size-4" />
          Reactivar reserva
        </button>
      )}

      <div className="grid grid-cols-2 gap-2">
        <SecondaryButton
          icon={CircleUserRound}
          label="Ver CRM"
          onClick={() => onViewClient(reservation.clientId)}
        />

        <a
          href={`https://wa.me/${whatsappPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY}
        >
          <MessageCircle className="size-3.5" />
          WhatsApp
        </a>

        {isLive && (
          <SecondaryButton
            icon={CalendarClock}
            label="Reagendar"
            disabled={isBusy}
            title="Elige un nuevo día y horario en el calendario"
            className="col-span-2"
            onClick={() => onReschedule(reservation.id)}
          />
        )}

        {isLive && isUpcoming && (
          <>
            <SecondaryButton
              icon={Link2}
              label="Enviar enlace"
              disabled={isBusy}
              title="Envía al cliente por WhatsApp el enlace para cancelar"
              onClick={() => void actions.sendCancellationLink(reservation.id)}
            />
            <SecondaryButton
              icon={Copy}
              label="Copiar enlace"
              disabled={isBusy}
              title="Copia el enlace de cancelación para enviarlo a mano"
              onClick={() => void actions.copyCancellationLink(reservation.id)}
            />
          </>
        )}
      </div>

      {isLive && (
        <>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => setCancelOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 self-center font-sans text-xs text-red-700 underline underline-offset-4 transition-opacity hover:opacity-75 disabled:opacity-50"
          >
            <X className="size-3.5" />
            Cancelar reserva
          </button>

          <CancelReservationDialog
            open={cancelOpen}
            onOpenChange={setCancelOpen}
            reservationId={reservation.id}
            clientName={reservation.clientName}
            treatmentName={reservation.treatmentName}
            onCancel={actions.cancel}
          />
        </>
      )}
    </div>
  );
}
