import {
  CalendarClock,
  ClipboardPen,
  Copy,
  FileX,
  Link2,
  MessageCircle,
  Phone,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { isCancellableStatus } from "@/src/features/admin/utils/reservation-status.utils";

import { needsAssessment, type StageAction } from "../../lib/reservation-stage";
import type { CalendarReservation } from "../../types/calendar.types";
import { SECONDARY_ACTION } from "./panel-buttons";
import { ReservationDetails } from "./reservation-details";

export type ReservationDialog =
  "assess" | "approve" | "reject" | "complete" | "cancel";

interface ReservationActionsSheetProps {
  reservation: CalendarReservation;
  open: boolean;
  primary: StageAction | null;
  isUpcoming: boolean;
  isBusy: boolean;
  onOpenChange: (open: boolean) => void;
  onDialog: (dialog: ReservationDialog) => void;
  onReschedule: () => void;
  onViewClient: () => void;
  onSendLink: () => void;
  onCopyLink: () => void;
}

interface RowProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

function Row({
  icon: Icon,
  label,
  onClick,
  disabled,
  className = "",
}: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${SECONDARY_ACTION} justify-start ${className}`}
    >
      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
      {label}
    </button>
  );
}

export function ReservationActionsSheet({
  reservation,
  open,
  primary,
  isUpcoming,
  isBusy,
  onOpenChange,
  onDialog,
  onReschedule,
  onViewClient,
  onSendLink,
  onCopyLink,
}: ReservationActionsSheetProps) {
  const { status } = reservation;
  const isLive = isCancellableStatus(status);
  const awaitsPayment = status === "PENDIENTE_DEPOSITO";
  const digits = reservation.phone.replace(/\D/g, "");

  const closeAnd = (run: () => void) => () => {
    onOpenChange(false);
    run();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="mx-auto max-h-[88dvh] max-w-lg gap-4 overflow-y-auto rounded-t-[2rem] border-tertiary/30 bg-primary px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-secondary"
      >
        <div className="relative pr-12">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 grid size-11 cursor-pointer place-items-center rounded-full hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <SheetTitle className="font-heading text-2xl text-secondary">
            {reservation.dependentName ?? reservation.clientName}
          </SheetTitle>
          <SheetDescription className="font-sans text-sm text-secondary/80">
            {reservation.treatmentName} · {reservation.start}
          </SheetDescription>
        </div>

        <ReservationDetails reservation={reservation} />

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/${digits}`}
            target="_blank"
            rel="noopener noreferrer"
            className={SECONDARY_ACTION}
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            WhatsApp
          </a>
          <a href={`tel:+${digits}`} className={SECONDARY_ACTION}>
            <Phone className="size-5" aria-hidden="true" />
            Llamar
          </a>
        </div>

        <div className="flex flex-col gap-2">
          {needsAssessment(reservation) && primary !== "assess" && (
            <Row
              icon={ClipboardPen}
              label="Registrar valoración"
              onClick={closeAnd(() => onDialog("assess"))}
            />
          )}
          {awaitsPayment &&
            primary !== "register-payment" &&
            primary !== "approve-proof" && (
              <Row
                icon={Wallet}
                label="Registrar pago"
                disabled={isBusy}
                onClick={closeAnd(() => onDialog("approve"))}
              />
            )}
          {awaitsPayment && reservation.isProofUnderReview && (
            <Row
              icon={FileX}
              label="Rechazar comprobante"
              disabled={isBusy}
              className="text-red-700"
              onClick={closeAnd(() => onDialog("reject"))}
            />
          )}
          {isLive && (
            <Row
              icon={CalendarClock}
              label="Cambiar día u hora"
              disabled={isBusy}
              onClick={closeAnd(onReschedule)}
            />
          )}
          <Row
            icon={UserRound}
            label="Ver ficha del cliente"
            onClick={closeAnd(onViewClient)}
          />
          {isLive && isUpcoming && (
            <>
              <Row
                icon={Link2}
                label="Enviarle el enlace para cancelar"
                disabled={isBusy}
                onClick={closeAnd(onSendLink)}
              />
              <Row
                icon={Copy}
                label="Copiar el enlace para cancelar"
                disabled={isBusy}
                onClick={closeAnd(onCopyLink)}
              />
            </>
          )}
        </div>

        {isLive && (
          <Row
            icon={X}
            label="Cancelar la cita"
            disabled={isBusy}
            className="border-red-300 text-red-700 hover:bg-red-50"
            onClick={closeAnd(() => onDialog("cancel"))}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
