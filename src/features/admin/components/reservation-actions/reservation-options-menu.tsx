"use client";

import { useState, type ReactElement } from "react";
import {
  CalendarClock,
  CalendarSearch,
  Copy,
  Link2,
  MessageCircle,
  UserRoundSearch,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import type { ReservationStatus } from "@/src/features/admin/types/enums";
import { isCancellableStatus } from "@/src/features/admin/utils/reservation-status.utils";

import { CancelReservationDialog } from "./cancel-reservation-dialog";

export interface ReservationMenuTarget {
  reservationId: string;
  status: ReservationStatus;
  isUpcoming: boolean;
  clientId: string;
  clientName: string;
  clientPhone: string;
  treatmentName: string;
}

interface ReservationOptionsMenuProps {
  target: ReservationMenuTarget;
  actions: ReservationActions;
  trigger: ReactElement;
  onViewClient: (clientId: string) => void;
  onReschedule?: (reservationId: string) => void;
  onOpenInCalendar?: (reservationId: string) => void;
}

const ITEM_CLASS =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left font-sans text-base text-secondary transition-colors hover:bg-quaternary/35 disabled:pointer-events-none disabled:opacity-50";

interface OptionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

function OptionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  className = "",
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${ITEM_CLASS} ${className}`}
    >
      <Icon className="size-5" strokeWidth={1.7} />
      {label}
    </button>
  );
}

function Divider() {
  return <div className="my-2 h-px bg-tertiary/25" />;
}

export function ReservationOptionsMenu({
  target,
  actions,
  trigger,
  onViewClient,
  onReschedule,
  onOpenInCalendar,
}: ReservationOptionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const canCancel = isCancellableStatus(target.status);
  const canShareLink = canCancel && target.isUpcoming;
  const isBusy = actions.busyReservationId === target.reservationId;

  const runAndClose = (run: () => void) => {
    setMenuOpen(false);
    run();
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          render={trigger}
          aria-label={`Opciones de reserva de ${target.clientName}`}
        />

        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={10}
          className="w-76 rounded-2xl border border-tertiary/30 bg-primary p-2.5 shadow-[0_20px_50px_-20px_rgba(6,33,18,0.28)]"
        >
          {canCancel && onReschedule && (
            <OptionButton
              icon={CalendarClock}
              label="Reagendar"
              onClick={() => runAndClose(() => onReschedule(target.reservationId))}
            />
          )}

          {onOpenInCalendar && (
            <OptionButton
              icon={CalendarSearch}
              label="Ver en el calendario"
              onClick={() =>
                runAndClose(() => onOpenInCalendar(target.reservationId))
              }
            />
          )}

          <a
            href={`https://wa.me/${target.clientPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className={`${ITEM_CLASS} justify-between`}
          >
            <span className="flex items-center gap-3">
              <MessageCircle className="size-5" strokeWidth={1.7} />
              Contactar cliente
            </span>
            <span className="text-sm text-green-800">WhatsApp</span>
          </a>

          <OptionButton
            icon={UserRoundSearch}
            label="Ver ficha CRM"
            onClick={() => runAndClose(() => onViewClient(target.clientId))}
          />

          {canShareLink && (
            <>
              <Divider />
              <OptionButton
                icon={Link2}
                label="Enviar enlace de cancelación"
                disabled={isBusy}
                onClick={() =>
                  runAndClose(
                    () => void actions.sendCancellationLink(target.reservationId),
                  )
                }
              />
              <OptionButton
                icon={Copy}
                label="Copiar enlace de cancelación"
                disabled={isBusy}
                onClick={() =>
                  runAndClose(
                    () => void actions.copyCancellationLink(target.reservationId),
                  )
                }
              />
            </>
          )}

          {canCancel && (
            <>
              <Divider />
              <OptionButton
                icon={X}
                label="Cancelar reserva"
                disabled={isBusy}
                className="text-red-700 hover:bg-red-50"
                onClick={() => runAndClose(() => setCancelOpen(true))}
              />
            </>
          )}
        </PopoverContent>
      </Popover>

      {canCancel && (
        <CancelReservationDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          reservationId={target.reservationId}
          clientName={target.clientName}
          treatmentName={target.treatmentName}
          onCancel={actions.cancel}
        />
      )}
    </>
  );
}
