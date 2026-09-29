"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import type { AcceptReservationHandler } from "@/src/features/admin/types/dashboard.types";
import type { DepositCoverage } from "@/src/features/admin/types/enums";

interface AcceptReservationButtonProps {
  reservationId: string;
  hasProof: boolean;
  onAccept: AcceptReservationHandler;
  className: string;
}

const COVERAGE_OPTIONS: ReadonlyArray<{
  value: DepositCoverage;
  label: string;
}> = [
  { value: "ANTICIPO", label: "Anticipo" },
  { value: "PAGO_COMPLETO", label: "Pago completo" },
];

export function AcceptReservationButton({
  reservationId,
  hasProof,
  onAccept,
  className,
}: AcceptReservationButtonProps) {
  const [isChoosing, setIsChoosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChoose = async (coverage: DepositCoverage) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onAccept(reservationId, coverage);
      setIsChoosing(false);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo aprobar la reserva.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isChoosing) {
    return (
      <Button
        type="button"
        onClick={() => setIsChoosing(true)}
        className={`cursor-pointer ${className}`}
      >
        <Check className="size-4" strokeWidth={2} />
        Aceptar
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans text-xs text-secondary/60">
        {hasProof
          ? "¿Qué cubre el pago?"
          : "Sin comprobante adjunto. ¿Qué cubre el pago recibido?"}
      </p>

      {COVERAGE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          disabled={isSubmitting}
          onClick={() => void handleChoose(option.value)}
          className="h-10 cursor-pointer rounded-xl bg-secondary font-sans text-sm text-primary hover:bg-secondary/90"
        >
          {option.label}
        </Button>
      ))}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setIsChoosing(false);
          setError(null);
        }}
        className="w-fit cursor-pointer font-sans text-xs text-tertiary underline underline-offset-4 disabled:opacity-50"
      >
        Volver
      </button>

      {error && (
        <p role="alert" className="font-sans text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
