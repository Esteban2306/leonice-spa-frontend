"use client";

import {
  CalendarClock,
  ChevronDown,
  Ellipsis,
  MessageCircle,
  UserRoundSearch,
  X,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

interface ReservationActionsPopoverProps {
  reservationId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;

  onReschedule: (reservationId: string) => void;
  onContactClient: (phone: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
  isCancelling: boolean;
}

export function ReservationActionsPopover({
  reservationId,
  clientId,
  clientName,
  clientPhone,
  onReschedule,
  onContactClient,
  onViewClient,
  onCancel,
  isCancelling,
}: ReservationActionsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        className="
          flex
          h-12
          w-full
          cursor-pointer
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-tertiary/30
          bg-primary
          px-4
          font-sans
          text-base
          text-secondary
          transition-colors
          hover:bg-quaternary/30
        "
        aria-label={`Opciones de reserva de ${clientName}`}
      >
        <Ellipsis className="size-4.5" strokeWidth={1.8} />
        Opciones
        <ChevronDown className="size-4" strokeWidth={1.8} />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="w-[18rem] rounded-2xl border border-tertiary/30 bg-primary p-2.5 shadow-[0_20px_50px_-20px_rgba(6,33,18,0.28)]"
      >
        <button
          type="button"
          onClick={() => onReschedule(reservationId)}
          className="
            flex
            w-full
            cursor-pointer
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            font-sans
            text-base
            text-secondary
            transition-colors
            hover:bg-quaternary/35
          "
        >
          <CalendarClock className="size-5" strokeWidth={1.7} />
          Reagendar
        </button>

        <a
          href={`https://wa.me/${clientPhone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            w-full
            cursor-pointer
            items-center
            justify-between
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            font-sans
            text-base
            text-secondary
            transition-colors
            hover:bg-quaternary/35
          "
        >
          <span className="flex items-center gap-3">
            <MessageCircle className="size-5" strokeWidth={1.7} />
            Contactar cliente
          </span>

          <span className="text-sm text-green-800">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => onViewClient(clientId)}
          className="
            flex
            w-full
            cursor-pointer
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            font-sans
            text-base
            text-secondary
            transition-colors
            hover:bg-quaternary/35
          "
        >
          <UserRoundSearch className="size-5" strokeWidth={1.7} />
          Ver información del cliente
        </button>

        <div className="my-2 h-px bg-tertiary/25" />

        <button
          type="button"
          onClick={() => onCancel(reservationId)}
          disabled={isCancelling}
          className="
            flex
            w-full
            cursor-pointer
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            font-sans
            text-base
            text-red-700
            transition-colors
            hover:bg-red-50
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          <X className="size-5" strokeWidth={1.8} />
          {isCancelling ? "Cancelando..." : "Cancelar reserva"}
        </button>
      </PopoverContent>
    </Popover>
  );
}
