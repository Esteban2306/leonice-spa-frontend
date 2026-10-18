"use client";

import { Check, ChevronDown, Ellipsis, FileX, LogIn, RotateCcw } from "lucide-react";

import { ApproveDepositDialog } from "@/src/features/admin/components/reservation-actions/approve-deposit-dialog";
import { RejectDepositDialog } from "@/src/features/admin/components/reservation-actions/reject-deposit-dialog";
import { ReservationOptionsMenu } from "@/src/features/admin/components/reservation-actions/reservation-options-menu";
import type { DashboardReservationItem } from "@/src/features/admin/types/dashboard.types";
import {
  canCheckIn,
  canRevive,
} from "@/src/features/admin/utils/reservation-status.utils";

import type {
  ReservationPanelClient,
  ReservationPanelHandlers,
} from "./panelHandlers";

interface ReservationItemActionsProps extends ReservationPanelHandlers {
  item: DashboardReservationItem;
  client: ReservationPanelClient;
}

const PRIMARY =
  "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 font-sans text-base text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50";

const SECONDARY =
  "inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 font-sans text-sm text-red-700 transition-colors hover:bg-red-50";

const NOTE = "font-sans text-xs leading-5 text-secondary/70";

export function ReservationItemActions({
  item,
  client,
  actions,
  onOpenInCalendar,
  onReschedule,
  onViewClient,
}: ReservationItemActionsProps) {
  const isBusy = actions.busyReservationId === item.reservationId;

  return (
    <div className="flex flex-col gap-2.5">
      {item.status === "PENDIENTE_DEPOSITO" && (
        <>
          <ApproveDepositDialog
            reservationId={item.reservationId}
            clientName={client.name}
            priceThousands={item.priceThousands}
            hasProof={item.proofUrl !== null}
            belongsToGroup={client.isCombo}
            onApprove={actions.approveDeposit}
            trigger={
              <button type="button" className={PRIMARY} disabled={isBusy}>
                <Check className="size-4" strokeWidth={2} />
                Aceptar
              </button>
            }
          />

          {item.proofStatus === "UNDER_REVIEW" && (
            <RejectDepositDialog
              reservationId={item.reservationId}
              clientName={client.name}
              onReject={actions.rejectDeposit}
              trigger={
                <button type="button" className={SECONDARY} disabled={isBusy}>
                  <FileX className="size-4" strokeWidth={1.8} />
                  Rechazar comprobante
                </button>
              }
            />
          )}
        </>
      )}

      {item.status === "CONFIRMADA" &&
        (canCheckIn(item.status, item.isToday) ? (
          <button
            type="button"
            className={PRIMARY}
            disabled={isBusy}
            onClick={() => void actions.checkIn(item.reservationId)}
          >
            <LogIn className="size-4" strokeWidth={1.8} />
            {isBusy ? "Registrando…" : "Registrar llegada"}
          </button>
        ) : (
          <p className={NOTE}>El check-in se habilita el día de la cita.</p>
        ))}

      {canRevive(item.status, item.cancellationSource, item.isUpcoming) && (
        <button
          type="button"
          className={PRIMARY}
          disabled={isBusy}
          onClick={() => void actions.revive(item.reservationId)}
        >
          <RotateCcw className="size-4" strokeWidth={1.8} />
          {isBusy ? "Reactivando…" : "Reactivar reserva"}
        </button>
      )}

      <ReservationOptionsMenu
        target={{
          reservationId: item.reservationId,
          status: item.status,
          isUpcoming: item.isUpcoming,
          clientId: client.clientId,
          clientName: client.name,
          clientPhone: client.phone,
          treatmentName: item.treatmentName,
        }}
        actions={actions}
        onViewClient={onViewClient}
        onReschedule={onReschedule}
        onOpenInCalendar={onOpenInCalendar}
        trigger={
          <button
            type="button"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-tertiary/30 bg-primary px-4 font-sans text-base text-secondary transition-colors hover:bg-quaternary/30"
          >
            <Ellipsis className="size-4.5" strokeWidth={1.8} />
            Opciones
            <ChevronDown className="size-4" strokeWidth={1.8} />
          </button>
        }
      />
    </div>
  );
}
