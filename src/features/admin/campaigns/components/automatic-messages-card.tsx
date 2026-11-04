"use client";

import { useState } from "react";

import { useAutomaticMessages } from "@/src/features/admin/hooks/use-automation-rules";
import type {
  AutomaticMessage,
  AutomaticMessageResult,
} from "@/src/features/admin/types/automatic-messages.types";
import { ErrorPanel } from "@/src/features/admin/whatsapp/components/error-panel";
import {
  SECONDARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "@/src/features/admin/whatsapp/components/section-card";
import { StatusPill } from "@/src/features/admin/whatsapp/components/status-pill";

import { formatDateTime } from "../lib/campaign-format";

const FILTERS: ReadonlyArray<{
  value: AutomaticMessageResult | undefined;
  label: string;
}> = [
  { value: undefined, label: "Todos" },
  { value: "EXECUTED", label: "Enviados" },
  { value: "SKIPPED", label: "Omitidos" },
  { value: "FAILED", label: "Fallidos" },
];

const RESULT_PILL = {
  EXECUTED: { tone: "green", label: "Enviado" },
  SKIPPED: { tone: "amber", label: "Omitido" },
  FAILED: { tone: "red", label: "Falló" },
} as const;

function describe(message: AutomaticMessage): string {
  const what =
    message.kind === "REMINDER"
      ? "Recordatorio de cita"
      : message.target
        ? `Seguimiento de ${message.target}`
        : "Seguimiento";
  return message.clientName ? `${what} · ${message.clientName}` : what;
}

export function AutomaticMessagesCard() {
  const [result, setResult] = useState<AutomaticMessageResult | undefined>();
  const [page, setPage] = useState(1);
  const query = useAutomaticMessages({ result, page });
  const rows = query.data?.data ?? [];
  const totalPages = query.data?.pagination.totalPages ?? 1;

  return (
    <SectionCard
      title="Qué se envió solo"
      description="Recordatorios de cita y seguimientos automáticos. Si una clienta no recibió su mensaje, aquí ves el motivo."
      aside={
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              aria-pressed={result === filter.value}
              onClick={() => {
                setResult(filter.value);
                setPage(1);
              }}
              className={`h-9 cursor-pointer rounded-full border px-3 font-sans text-xs transition-colors ${
                result === filter.value
                  ? "border-secondary bg-secondary text-primary"
                  : "border-secondary/15 bg-white text-secondary/75 hover:bg-quaternary/20"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      }
    >
      {query.isError && (
        <ErrorPanel
          error={query.error}
          onRetry={() => void query.refetch()}
          compact
        />
      )}
      {query.isLoading && <SkeletonRows rows={3} height="h-14" />}
      <ul className="flex flex-col gap-2">
        {rows.map((message) => {
          const pill = RESULT_PILL[message.result];
          const detail = message.reason ?? message.errorMessage;
          return (
            <li
              key={message.id}
              className="flex flex-wrap items-start gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm text-secondary">
                  {describe(message)}
                </p>
                <p className="font-sans text-xs text-secondary/70">
                  {formatDateTime(message.executedAt)}
                </p>
                {detail && (
                  <p className="mt-1 font-sans text-xs text-secondary/80">
                    {detail}
                  </p>
                )}
              </div>
              <StatusPill tone={pill.tone}>{pill.label}</StatusPill>
            </li>
          );
        })}
      </ul>
      {!query.isLoading && rows.length === 0 && (
        <p className="font-sans text-sm text-secondary/70">
          Todavía no se ha enviado ningún mensaje automático.
        </p>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className={`${SECONDARY_BUTTON} h-9`}
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Anterior
          </button>
          <span className="font-sans text-xs text-secondary/70">
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            className={`${SECONDARY_BUTTON} h-9`}
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </SectionCard>
  );
}
