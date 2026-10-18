"use client";

import { useState } from "react";

import { CheckboxField } from "@/src/features/admin/components/reservation-actions/form-controls";

interface BookingRescheduleConfirmProps {
  fromLabel: string;
  toLabel: string;
  isSubmitting: boolean;
  onConfirm: (notifyClient: boolean) => void;
}

export function BookingRescheduleConfirm({
  fromLabel,
  toLabel,
  isSubmitting,
  onConfirm,
}: BookingRescheduleConfirmProps) {
  const [notifyClient, setNotifyClient] = useState(true);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-secondary/10 bg-white/70 p-3 font-sans text-sm text-secondary">
        <p className="text-xs uppercase tracking-[0.16em] text-secondary/70">
          Cambio
        </p>
        <p className="mt-1 text-secondary/70 line-through">{fromLabel}</p>
        <p className="mt-0.5 font-medium">{toLabel}</p>
      </div>

      <CheckboxField
        id="reschedule-notify"
        checked={notifyClient}
        onChange={setNotifyClient}
        label="Avisar al cliente por WhatsApp"
        description="Desmárcalo si ya acordaste el cambio con el cliente."
      />

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => onConfirm(notifyClient)}
        className="h-11 cursor-pointer rounded-full bg-secondary font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Reagendando…" : "Confirmar nuevo horario"}
      </button>
    </div>
  );
}
