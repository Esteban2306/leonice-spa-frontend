"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleCheck, MessageCircle } from "lucide-react";

import { HttpError } from "@/src/lib/api/http-error";
import { normalizeError } from "@/src/lib/errors/normalize-error";

import { cancellationLinksApi } from "../api/cancellation-links.api";
import {
  buildCancelRequest,
  formatDayKey,
  formatTimeRange,
  whatsappLink,
} from "../lib/cancellation";
import type { CancellationScope } from "../types";
import { CancelCard, CancelShell, WhatsAppButton } from "./cancel-shell";
import { CancelForm } from "./cancel-form";

const SPA_WHATSAPP = process.env.NEXT_PUBLIC_SPA_WHATSAPP;

function isLinkProblem(error: unknown): boolean {
  return (
    error instanceof HttpError &&
    (error.status === 404 || error.status === 410 || error.status === 400)
  );
}

export function CancelPage({ token }: { token: string }) {
  const detailsQuery = useQuery({
    queryKey: ["public", "cancellation-link", token],
    queryFn: () => cancellationLinksApi.describe(token),
    retry: false,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  const cancelMutation = useMutation({
    mutationKey: ["public", "cancellation-link", token, "cancel"],
    mutationFn: ({
      scope,
      reason,
    }: {
      scope: CancellationScope;
      reason?: string;
    }) =>
      cancellationLinksApi.cancel(
        token,
        buildCancelRequest(detailsQuery.data!, scope, reason),
      ),
  });

  const details = detailsQuery.data;
  const reschedule = whatsappLink(
    SPA_WHATSAPP,
    details
      ? `Hola, soy ${details.clientFirstName ?? ""}. Cancelé mi cita del ${formatDayKey(details.date)} y quiero reagendar.`
      : "Hola, quiero información sobre mi cita.",
  );

  if (detailsQuery.isLoading) {
    return (
      <CancelShell>
        <div
          aria-busy="true"
          className="flex flex-col gap-4 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-8"
        >
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-secondary/10" />
          <div className="h-20 animate-pulse rounded-2xl bg-secondary/5" />
          <div className="h-12 animate-pulse rounded-full bg-secondary/10" />
          <span className="sr-only">Cargando tus citas…</span>
        </div>
      </CancelShell>
    );
  }

  if (detailsQuery.isError || !details) {
    const message = normalizeError(detailsQuery.error).message;
    return (
      <CancelShell>
        <CancelCard
          title={
            isLinkProblem(detailsQuery.error)
              ? "Este enlace no está disponible"
              : "No pudimos cargar tu cita"
          }
        >
          <p role="alert" className="font-sans text-base text-secondary">
            {message}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {!isLinkProblem(detailsQuery.error) && (
              <button
                type="button"
                onClick={() => void detailsQuery.refetch()}
                className="h-12 cursor-pointer rounded-full border border-secondary/20 px-6 font-sans text-sm text-secondary transition-colors hover:bg-secondary/5"
              >
                Intentar de nuevo
              </button>
            )}
            {reschedule && (
              <WhatsAppButton href={reschedule}>
                <MessageCircle className="size-4" strokeWidth={1.8} />
                Escribir al spa
              </WhatsAppButton>
            )}
          </div>
        </CancelCard>
      </CancelShell>
    );
  }

  if (cancelMutation.isSuccess) {
    const { cancelled, alreadyCancelled } = cancelMutation.data;
    const all = [...cancelled, ...alreadyCancelled];
    return (
      <CancelShell>
        <CancelCard
          title={
            all.length > 1
              ? "Tus citas quedaron canceladas"
              : "Tu cita quedó cancelada"
          }
          subtitle={`${formatDayKey(details.date)}. El spa ya fue notificado.`}
        >
          <ul className="flex flex-col gap-2">
            {all.map((reservation) => (
              <li
                key={reservation.reservationId}
                className="flex items-center gap-3 rounded-2xl border border-secondary/10 bg-white/70 p-4"
              >
                <CircleCheck
                  className="size-5 shrink-0 text-green-700"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="font-sans text-base font-semibold text-secondary">
                    {reservation.treatment}
                  </p>
                  <p className="font-sans text-sm text-secondary/75 tabular-nums">
                    {formatTimeRange(
                      reservation.scheduledStart,
                      reservation.scheduledEnd,
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {reschedule ? (
            <div className="flex flex-col gap-3">
              <p className="font-sans text-sm text-secondary/80">
                ¿Quieres otra fecha? Escríbenos y te ayudamos a reagendar.
              </p>
              <WhatsAppButton href={reschedule}>
                <MessageCircle className="size-4" strokeWidth={1.8} />
                Escríbenos para reagendar
              </WhatsAppButton>
            </div>
          ) : (
            <p className="font-sans text-sm text-secondary/80">
              Cuando quieras volver, escríbenos por WhatsApp y te ayudamos a
              reagendar.
            </p>
          )}
        </CancelCard>
      </CancelShell>
    );
  }

  return (
    <CancelShell>
      <CancelForm
        details={details}
        isSubmitting={cancelMutation.isPending}
        submitError={
          cancelMutation.isError
            ? normalizeError(cancelMutation.error).message
            : null
        }
        whatsappHref={reschedule}
        onCancel={(scope, reason) => {
          if (cancelMutation.isPending) return;
          cancelMutation.mutate({ scope, reason });
        }}
      />
    </CancelShell>
  );
}
