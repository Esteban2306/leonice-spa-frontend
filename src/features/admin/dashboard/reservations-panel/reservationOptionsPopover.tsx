"use client";

import { useState } from "react";
import {
  CalendarClock,
  CalendarSearch,
  ChevronDown,
  Copy,
  Ellipsis,
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
import { CancelReservationDialog } from "@/src/features/admin/components/reservation-actions/cancel-reservation-dialog";
import type { DashboardReservationItem } from "@/src/features/admin/types/dashboard.types";
import { isCancellableStatus } from "@/src/features/admin/utils/reservation-status.utils";

import type {
  ReservationPanelClient,
  ReservationPanelHandlers,
} from "./panelHandlers";

interface ReservationOptionsPopoverProps extends ReservationPanelHandlers {
  item: DashboardReservationItem;
  client: ReservationPanelClient;
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

export function ReservationOptionsPopover({
  item,
  client,
  actions,
  onOpenInCalendar,
  onViewClient,
}: ReservationOptionsPopoverProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const isLive = isCancellableStatus(item.status) && item.isUpcoming;
  const isBusy = actions.busyReservationId === item.reservationId;

  const runAndClose = (run: () => void) => {
    setMenuOpen(false);
    run();
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-tertiary/30 bg-primary px-4 font-sans text-base text-secondary transition-colors hover:bg-quaternary/30"
          aria-label={`Opciones de reserva de ${client.name}`}
        >
          <Ellipsis className="size-4.5" strokeWidth={1.8} />
          Opciones
          <ChevronDown className="size-4" strokeWidth={1.8} />
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={10}
          className="w-[19rem] rounded-2xl border border-tertiary/30 bg-primary p-2.5 shadow-[0_20px_50px_-20px_rgba(6,33,18,0.28)]"
        >
          <OptionButton
            icon={isLive ? CalendarClock : CalendarSearch}
            label={isLive ? "Reagendar en el calendario" : "Ver en el calendario"}
            onClick={() => runAndClose(() => onOpenInCalendar(item.reservationId))}
          />

          <a
            href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
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
            label="Ver información del cliente"
            onClick={() => runAndClose(() => onViewClient(client.clientId))}
          />

          {isLive && (
            <>
              <div className="my-2 h-px bg-tertiary/25" />

              <OptionButton
                icon={Link2}
                label="Enviar enlace de cancelación"
                disabled={isBusy}
                onClick={() =>
                  runAndClose(
                    () => void actions.sendCancellationLink(item.reservationId),
                  )
                }
              />

              <OptionButton
                icon={Copy}
                label="Copiar enlace de cancelación"
                disabled={isBusy}
                onClick={() =>
                  runAndClose(
                    () => void actions.copyCancellationLink(item.reservationId),
                  )
                }
              />

              <div className="my-2 h-px bg-tertiary/25" />

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

      {isLive && (
        <CancelReservationDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          reservationId={item.reservationId}
          clientName={client.name}
          treatmentName={item.treatmentName}
          onCancel={actions.cancel}
        />
      )}
    </>
  );
}
