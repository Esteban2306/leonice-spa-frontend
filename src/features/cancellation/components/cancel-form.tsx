"use client";

import { useState } from "react";
import { CalendarDays, Clock3, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  CANCELLATION_REASONS,
  MAX_REASON_LENGTH,
  availableScopes,
  composeReason,
  formatDayKey,
  formatExpiry,
  formatTimeRange,
  reservationStatusLabel,
} from "../lib/cancellation";
import type { CancellationLinkDetails, CancellationScope } from "../types";
import { CancelCard, WhatsAppButton } from "./cancel-shell";

interface CancelFormProps {
  details: CancellationLinkDetails;
  isSubmitting: boolean;
  submitError: string | null;
  whatsappHref: string | null;
  onCancel: (scope: CancellationScope, reason: string | undefined) => void;
}

export function CancelForm({
  details,
  isSubmitting,
  submitError,
  whatsappHref,
  onCancel,
}: CancelFormProps) {
  const scopes = availableScopes(details);
  const [scope, setScope] = useState<CancellationScope>(scopes[0] ?? "SINGLE");
  const [chip, setChip] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const cancellableCount = details.reservations.filter(
    (r) => r.cancellable,
  ).length;
  const affected = details.reservations.filter((r) =>
    scope === "DAY"
      ? r.cancellable
      : r.reservationId === details.linkReservationId,
  );
  const greeting = details.clientFirstName
    ? `Hola, ${details.clientFirstName}`
    : "Hola";

  if (scopes.length === 0) {
    return (
      <CancelCard
        title={greeting}
        subtitle={`Tus citas del ${formatDayKey(details.date)}`}
      >
        <p className="font-sans text-base text-secondary">
          Estas citas ya no se pueden cancelar desde este enlace: ya empezaron o
          fueron cerradas.
        </p>
        {whatsappHref ? (
          <WhatsAppButton href={whatsappHref}>
            <MessageCircle className="size-4" strokeWidth={1.8} />
            Escribir al spa
          </WhatsAppButton>
        ) : (
          <p className="font-sans text-sm text-secondary/80">
            Si necesitas ayuda con tu cita, escríbenos por WhatsApp.
          </p>
        )}
      </CancelCard>
    );
  }

  return (
    <CancelCard
      title={greeting}
      subtitle={`Puedes cancelar tus citas del ${formatDayKey(details.date)} hasta que empiecen.`}
    >
      <section
        aria-labelledby="cancel-appointments"
        className="flex flex-col gap-3"
      >
        <h2
          id="cancel-appointments"
          className="font-sans text-xs uppercase tracking-[0.16em] text-secondary/70"
        >
          Tus citas de ese día
        </h2>
        <ul className="flex flex-col gap-2">
          {details.reservations.map((reservation) => {
            const isAffected = affected.some(
              (r) => r.reservationId === reservation.reservationId,
            );
            return (
              <li
                key={reservation.reservationId}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                  isAffected
                    ? "border-secondary bg-white"
                    : "border-secondary/10 bg-white/60",
                )}
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-quaternary/40 text-secondary">
                  <CalendarDays className="size-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-base font-semibold text-secondary">
                    {reservation.treatment}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-sans text-sm text-secondary/75 tabular-nums">
                    <Clock3 className="size-3.5" strokeWidth={1.8} />
                    {formatTimeRange(
                      reservation.scheduledStart,
                      reservation.scheduledEnd,
                    )}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-full px-2.5 py-0.5 font-sans text-[11px]",
                      reservation.status === "CANCELADA"
                        ? "bg-secondary/5 text-secondary/70"
                        : "bg-secondary/5 text-secondary/80",
                    )}
                  >
                    {reservationStatusLabel(
                      reservation.status,
                      reservation.cancellable,
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {scopes.length > 1 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-sans text-sm font-semibold text-secondary">
            ¿Qué quieres cancelar?
          </legend>
          {scopes.map((option) => {
            const isSelected = scope === option;
            const label =
              option === "SINGLE"
                ? `Solo ${details.reservations.find((r) => r.reservationId === details.linkReservationId)?.treatment ?? "esta cita"}`
                : `Todo el día (${cancellableCount} citas)`;
            return (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 font-sans text-sm transition-colors",
                  isSelected
                    ? "border-secondary bg-white text-secondary"
                    : "border-secondary/15 bg-white/60 text-secondary/80",
                )}
              >
                <input
                  type="radio"
                  name="cancel-scope"
                  value={option}
                  checked={isSelected}
                  onChange={() => {
                    setScope(option);
                    setIsConfirming(false);
                  }}
                  className="size-4 accent-secondary"
                />
                {label}
              </label>
            );
          })}
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-sans text-xs uppercase tracking-[0.16em] text-secondary/70">
          Motivo (opcional)
        </legend>
        <div className="flex flex-wrap gap-2">
          {CANCELLATION_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              aria-pressed={chip === reason}
              onClick={() => setChip(chip === reason ? null : reason)}
              className={cn(
                "min-h-10 cursor-pointer rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
                chip === reason
                  ? "border-tertiary bg-quaternary/45 text-secondary"
                  : "border-secondary/15 bg-white text-secondary/80 hover:bg-quaternary/20",
              )}
            >
              {reason}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="cancel-note">
          Cuéntanos algo más
        </label>
        <textarea
          id="cancel-note"
          value={note}
          maxLength={MAX_REASON_LENGTH - (chip?.length ?? 0) - 2}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Cuéntanos algo más si quieres"
          className="min-h-20 w-full resize-y rounded-2xl border border-secondary/15 bg-white px-4 py-3 font-sans text-sm text-secondary outline-none placeholder:text-secondary/55 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40"
        />
      </fieldset>

      {submitError && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
        >
          {submitError}
        </p>
      )}

      {isConfirming ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4">
          <p className="font-sans text-sm text-red-900">
            {affected.length === 1
              ? `Vas a cancelar ${affected[0]?.treatment}. Esta acción no se puede deshacer.`
              : `Vas a cancelar ${affected.length} citas. Esta acción no se puede deshacer.`}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsConfirming(false)}
              className="h-12 cursor-pointer rounded-full px-5 font-sans text-sm text-secondary/80 transition-colors hover:bg-secondary/5 disabled:opacity-50"
            >
              Volver
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onCancel(scope, composeReason(chip, note))}
              className="h-12 cursor-pointer rounded-full bg-red-700 px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Cancelando…" : "Sí, cancelar"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="h-12 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
        >
          {affected.length > 1 ? "Cancelar mis citas" : "Cancelar mi cita"}
        </button>
      )}

      <p className="font-sans text-xs text-secondary/70">
        Este enlace es válido hasta el {formatExpiry(details.expiresAt)}
      </p>
    </CancelCard>
  );
}
