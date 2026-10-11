"use client";

import { Fragment, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, RotateCcw, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { conduitApi } from "@/src/features/admin/api/conduit.api";
import { adminQueryKeys } from "@/src/features/admin/hooks/query-keys";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import {
  useDeadLetters,
  useDeliveryEvents,
  useOutboundMessages,
  useOutboxEvents,
} from "@/src/features/admin/hooks/use-conduit";
import {
  useConduitActions,
  type ConduitActions,
} from "@/src/features/admin/hooks/use-conduit-actions";
import { useDebouncedValue } from "@/src/features/admin/hooks/use-debounced-value";
import type {
  AttemptLog,
  DeadLetter,
  OutboundMessage,
  OutboundStatus,
  OutboxEvent,
} from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import {
  EmptyState,
  SECONDARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import type { StatusTone } from "../lib/whatsapp-format";
import {
  DEAD_LETTER_TIPS,
  deadLetterReason,
  formatDateTime,
  formatWhatsappPhone,
} from "../lib/whatsapp-format";

const VIEWS = [
  { id: "mensajes", label: "Mensajes" },
  { id: "fallidos", label: "Fallidos" },
  { id: "eventos", label: "Avisos de reservas" },
  { id: "confirmaciones", label: "Confirmaciones de entrega" },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

const STATUS_COPY: Record<OutboundStatus, { label: string; tone: StatusTone }> =
  {
    PENDING: { label: "Programado", tone: "gray" },
    QUEUED: { label: "En cola", tone: "gray" },
    PROCESSING: { label: "Enviando", tone: "amber" },
    SENT: { label: "Enviado", tone: "green" },
    FAILED: { label: "Falló", tone: "red" },
    RETRYING: { label: "Reintentando", tone: "amber" },
    DEAD: { label: "Fallido", tone: "red" },
    CANCELLED: { label: "Cancelado", tone: "gray" },
  };

const EVENT_COPY: Record<string, string> = {
  "reservation.created": "Reserva creada",
  "reservation.confirmed": "Reserva confirmada",
  "reservation.cancelled": "Reserva cancelada",
};

function Pager({
  page,
  total,
  size,
  onChange,
}: {
  page: number;
  total: number;
  size: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between font-sans text-sm text-secondary/75">
      <span className="tabular-nums">
        Página {page} de {pages} · {total} en total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${SECONDARY_BUTTON} h-9`}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Anterior
        </button>
        <button
          type="button"
          className={`${SECONDARY_BUTTON} h-9`}
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function Attempts({ messageId }: { messageId: string }) {
  const detail = useQuery({
    queryKey: [...adminQueryKeys.conduit.all(), "message", messageId],
    queryFn: () => conduitApi.message(messageId),
    staleTime: 30_000,
    retry: false,
  });
  if (detail.isError) return <ErrorPanel error={detail.error} compact />;
  if (detail.isLoading)
    return (
      <p className="font-sans text-xs text-secondary/70">Cargando intentos…</p>
    );
  const logs: AttemptLog[] = detail.data?.attemptLogs ?? [];
  if (logs.length === 0)
    return (
      <p className="font-sans text-xs text-secondary/70">
        Sin intentos registrados.
      </p>
    );
  return (
    <ol className="flex flex-col gap-1 font-sans text-xs text-secondary/80">
      {logs.map((log) => (
        <li key={log.id} className="tabular-nums">
          Intento {log.attemptNumber}: {log.status} ·{" "}
          {formatDateTime(log.createdAt)}
          {log.errorCode &&
            ` · ${deadLetterReason(log.errorCode, log.errorDetail)}`}
        </li>
      ))}
    </ol>
  );
}

function MessagesView({ actions }: { actions: ConduitActions }) {
  const [status, setStatus] = useState<OutboundStatus | "">("");
  const [queue, setQueue] = useState<"all" | "immediate" | "scheduled">("all");
  const [recipient, setRecipient] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const digits = recipient.replace(/\D/g, "");
  const debounced = useDebouncedValue(digits, 350, digits);
  const messages = useOutboundMessages({
    ...(status ? { status } : {}),
    queue,
    ...(debounced ? { recipient: debounced } : {}),
    page,
    limit: 20,
  });
  const data: OutboundMessage[] = messages.data?.data ?? [];

  return (
    <SectionCard title="Mensajes enviados y programados">
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Estado"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OutboundStatus | "");
            setPage(1);
          }}
          className={`${INPUT_CLASS} h-10 w-44`}
        >
          <option value="">Todos los estados</option>
          {(Object.keys(STATUS_COPY) as OutboundStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_COPY[s].label}
            </option>
          ))}
        </select>
        <select
          aria-label="Cola"
          value={queue}
          onChange={(e) => {
            setQueue(e.target.value as typeof queue);
            setPage(1);
          }}
          className={`${INPUT_CLASS} h-10 w-44`}
        >
          <option value="all">Inmediatos y programados</option>
          <option value="immediate">Inmediatos</option>
          <option value="scheduled">Programados</option>
        </select>
        <input
          type="search"
          inputMode="tel"
          aria-label="Buscar por número"
          placeholder="Buscar por número"
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value);
            setPage(1);
          }}
          className={`${INPUT_CLASS} h-10 w-52`}
        />
      </div>
      {messages.isError ? (
        <ErrorPanel
          error={messages.error}
          onRetry={() => void messages.refetch()}
          compact
        />
      ) : messages.isLoading ? (
        <SkeletonRows rows={4} height="h-12" />
      ) : data.length === 0 ? (
        <EmptyState title="Sin mensajes">
          No hay envíos con esos filtros.
        </EmptyState>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[46rem] font-sans text-sm">
            <thead>
              <tr className="border-b border-tertiary/25 text-left text-xs uppercase tracking-[0.12em] text-secondary/70">
                <th scope="col" className="py-2 pr-3 font-normal">
                  Para
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Plantilla
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Estado
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Fecha
                </th>
                <th scope="col" className="py-2 font-normal">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((message) => {
                const copy = STATUS_COPY[message.status] ?? {
                  label: message.status,
                  tone: "gray" as StatusTone,
                };
                const cancellable = ["PENDING", "QUEUED", "FAILED"].includes(
                  message.status,
                );
                return (
                  <Fragment key={message.id}>
                    <tr className="border-b border-tertiary/15">
                      <td className="py-2.5 pr-3 text-secondary tabular-nums">
                        {formatWhatsappPhone(message.recipient)}
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-xs text-secondary/80">
                        {message.template?.name ?? "—"}
                      </td>
                      <td className="py-2.5 pr-3">
                        <StatusPill
                          tone={message.isOverdue ? "amber" : copy.tone}
                        >
                          {message.isOverdue ? "Atrasado" : copy.label}
                        </StatusPill>
                        {message.lastError && (
                          <p
                            className="mt-1 max-w-56 truncate text-[11px] text-red-800"
                            title={message.lastError}
                          >
                            {message.lastError}
                          </p>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-secondary/80">
                        {message.sentAt
                          ? formatDateTime(message.sentAt)
                          : message.queue === "scheduled" &&
                              message.minutesUntilSend !== null
                            ? `En ${message.minutesUntilSend} min`
                            : formatDateTime(message.scheduledAt)}
                      </td>
                      <td className="py-2.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          aria-expanded={open === message.id}
                          onClick={() =>
                            setOpen(open === message.id ? null : message.id)
                          }
                          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full px-2.5 text-xs text-secondary/80 hover:bg-secondary/5"
                        >
                          Intentos
                          <ChevronDown
                            className={cn(
                              "size-3.5 transition-transform",
                              open === message.id && "rotate-180",
                            )}
                          />
                        </button>
                        {cancellable && (
                          <button
                            type="button"
                            disabled={actions.busy.has(`message:${message.id}`)}
                            onClick={() =>
                              void actions.cancelMessage(message.id)
                            }
                            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full px-2.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle className="size-3.5" />
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                    {open === message.id && (
                      <tr className="border-b border-tertiary/15 bg-primary/40">
                        <td colSpan={5} className="px-3 py-3">
                          <Attempts messageId={message.id} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pager
        page={page}
        total={messages.data?.meta.total ?? 0}
        size={20}
        onChange={setPage}
      />
    </SectionCard>
  );
}

function DeadLettersView({ actions }: { actions: ConduitActions }) {
  const [page, setPage] = useState(1);
  const [confirming, setConfirming] = useState<DeadLetter | null>(null);
  const deadLetters = useDeadLetters({ requeued: false, page, limit: 20 });
  const data = deadLetters.data?.data ?? [];

  return (
    <SectionCard
      title="Mensajes fallidos"
      description="Mensajes que no se pudieron entregar tras todos los reintentos. Reintentar los vuelve a pasar por la política anti-bloqueo."
    >
      {deadLetters.isError ? (
        <ErrorPanel
          error={deadLetters.error}
          onRetry={() => void deadLetters.refetch()}
          compact
        />
      ) : deadLetters.isLoading ? (
        <SkeletonRows rows={3} height="h-20" />
      ) : data.length === 0 ? (
        <EmptyState title="Todo salió bien">
          No hay mensajes fallidos por revisar.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((item) => {
            const tip = item.lastErrorCode
              ? DEAD_LETTER_TIPS[item.lastErrorCode]
              : undefined;
            return (
              <li
                key={item.messageId}
                className="flex flex-wrap items-start gap-3 rounded-[1.25rem] border border-red-200 bg-white/80 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-secondary tabular-nums">
                    {formatWhatsappPhone(item.message?.recipient)}
                    {item.message?.template?.name && (
                      <span className="ml-2 font-mono text-xs font-normal text-secondary/70">
                        {item.message.template.name}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 font-sans text-sm text-red-900">
                    {deadLetterReason(item.lastErrorCode, item.reason)}
                  </p>
                  {tip && (
                    <p className="mt-0.5 font-sans text-xs text-secondary/75">
                      {tip}
                    </p>
                  )}
                  {item.message?.renderedBody && (
                    <p className="mt-2 line-clamp-2 rounded-xl bg-primary px-3 py-2 font-sans text-xs whitespace-pre-wrap text-secondary/80">
                      {item.message.renderedBody}
                    </p>
                  )}
                  <p className="mt-1 font-sans text-[11px] text-secondary/65 tabular-nums">
                    {item.totalAttempts} intentos ·{" "}
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  className={`${SECONDARY_BUTTON} h-10`}
                  disabled={actions.busy.has(`requeue:${item.messageId}`)}
                  onClick={() =>
                    item.lastErrorCode === "UNKNOWN_OUTCOME"
                      ? setConfirming(item)
                      : void actions.requeue(item.messageId)
                  }
                >
                  <RotateCcw className="size-4" />
                  Reintentar
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <Pager
        page={page}
        total={deadLetters.data?.meta.total ?? 0}
        size={20}
        onChange={setPage}
      />
      <ActionDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
        tone="danger"
        title="¿Reintentar este mensaje?"
        description="No se pudo confirmar si ya salió. Si lo reintentas, la clienta podría recibirlo dos veces."
        submitLabel="Reintentar de todos modos"
        submittingLabel="Reintentando…"
        onSubmit={() =>
          confirming
            ? actions.requeue(confirming.messageId)
            : Promise.resolve(false)
        }
      />
    </SectionCard>
  );
}

function OutboxView({ actions }: { actions: ConduitActions }) {
  const [status, setStatus] = useState<OutboxEvent["status"] | "">("FAILED");
  const [page, setPage] = useState(1);
  const outbox = useOutboxEvents({
    ...(status ? { status } : {}),
    page,
    pageSize: 20,
  });
  const data = outbox.data?.data ?? [];
  return (
    <SectionCard
      title="Avisos de reservas hacia WhatsApp"
      description="Eventos que el sistema le pasa al asistente cuando una reserva se crea, se confirma o se cancela."
    >
      <select
        aria-label="Estado"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as OutboxEvent["status"] | "");
          setPage(1);
        }}
        className={`${INPUT_CLASS} h-10 w-44`}
      >
        <option value="">Todos</option>
        <option value="FAILED">Fallidos</option>
        <option value="PENDING">Pendientes</option>
        <option value="SENT">Entregados</option>
      </select>
      {outbox.isError ? (
        <ErrorPanel
          error={outbox.error}
          onRetry={() => void outbox.refetch()}
          compact
        />
      ) : outbox.isLoading ? (
        <SkeletonRows rows={3} height="h-12" />
      ) : data.length === 0 ? (
        <EmptyState title="Nada por aquí">
          No hay eventos con ese estado.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((event) => (
            <li
              key={event.id}
              className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm text-secondary">
                  {EVENT_COPY[event.eventType] ?? event.eventType}
                </p>
                <p className="font-sans text-[11px] text-secondary/70 tabular-nums">
                  {formatDateTime(event.createdAt)} · {event.attempts}{" "}
                  {event.attempts === 1 ? "intento" : "intentos"}
                  {event.lastError &&
                    ` · ${event.lastError === "fetch failed" ? "No hubo conexión con el servicio de WhatsApp" : event.lastError}`}
                </p>
              </div>
              <StatusPill
                tone={
                  event.status === "SENT"
                    ? "green"
                    : event.status === "FAILED"
                      ? "red"
                      : "gray"
                }
              >
                {event.status === "SENT"
                  ? "Entregado"
                  : event.status === "FAILED"
                    ? "Fallido"
                    : "Pendiente"}
              </StatusPill>
              {event.status === "FAILED" && (
                <button
                  type="button"
                  className={`${SECONDARY_BUTTON} h-9 px-3`}
                  disabled={actions.busy.has(`outbox:${event.id}`)}
                  onClick={() => void actions.retryOutbox(event.id)}
                >
                  <RotateCcw className="size-4" />
                  Reintentar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Pager
        page={page}
        total={outbox.data?.meta.total ?? 0}
        size={20}
        onChange={setPage}
      />
    </SectionCard>
  );
}

function ConfirmationsView() {
  const [status, setStatus] = useState("");
  const events = useDeliveryEvents(status ? { status } : {});
  const data = events.data ?? [];
  return (
    <SectionCard
      title="Confirmaciones de entrega"
      description="Lo que el servicio de WhatsApp le reportó al sistema sobre cada mensaje."
    >
      <select
        aria-label="Estado"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={`${INPUT_CLASS} h-10 w-44`}
      >
        <option value="">Todos</option>
        <option value="SENT">Enviados</option>
        <option value="DEAD">Fallidos</option>
        <option value="CANCELLED">Cancelados</option>
      </select>
      {events.isError ? (
        <ErrorPanel
          error={events.error}
          onRetry={() => void events.refetch()}
          compact
        />
      ) : events.isLoading ? (
        <SkeletonRows rows={3} height="h-10" />
      ) : data.length === 0 ? (
        <EmptyState title="Sin confirmaciones">
          Aún no hay confirmaciones con ese estado.
        </EmptyState>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[36rem] font-sans text-sm">
            <thead>
              <tr className="border-b border-tertiary/25 text-left text-xs uppercase tracking-[0.12em] text-secondary/70">
                <th scope="col" className="py-2 pr-3 font-normal">
                  Para
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Estado
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Recibido
                </th>
                <th scope="col" className="py-2 font-normal">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 100).map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-tertiary/15 last:border-b-0"
                >
                  <td className="py-2.5 pr-3 text-secondary tabular-nums">
                    {formatWhatsappPhone(event.recipient)}
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusPill
                      tone={
                        event.status === "SENT"
                          ? "green"
                          : event.status === "DEAD"
                            ? "red"
                            : "gray"
                      }
                    >
                      {event.status === "SENT"
                        ? "Enviado"
                        : event.status === "DEAD"
                          ? "Fallido"
                          : event.status === "CANCELLED"
                            ? "Cancelado"
                            : event.status}
                    </StatusPill>
                  </td>
                  <td className="py-2.5 pr-3 text-secondary/80">
                    {formatDateTime(event.receivedAt)}
                  </td>
                  <td className="py-2.5 text-xs text-secondary/75">
                    {event.errorMessage ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

export function DeliveriesSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("vista");
  const view: ViewId = VIEWS.some((v) => v.id === raw)
    ? (raw as ViewId)
    : "mensajes";
  const actions = useConduitActions();
  const failed = useDeadLetters({ requeued: false, page: 1, limit: 1 });
  const failedCount = failed.data?.meta.total ?? 0;

  const select = (id: ViewId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "mensajes") params.delete("vista");
    else params.set("vista", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Vistas de envíos"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {VIEWS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={view === option.id}
            onClick={() => select(option.id)}
            className={cn(
              "inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
              view === option.id
                ? "border-secondary bg-secondary text-primary"
                : "border-secondary/15 bg-white text-secondary/75 hover:bg-quaternary/20",
            )}
          >
            {option.label}
            {option.id === "fallidos" && failedCount > 0 && (
              <span className="rounded-full bg-red-700 px-1.5 text-[11px] font-semibold text-white tabular-nums">
                {failedCount}
              </span>
            )}
          </button>
        ))}
      </div>
      {view === "mensajes" && <MessagesView actions={actions} />}
      {view === "fallidos" && <DeadLettersView actions={actions} />}
      {view === "eventos" && <OutboxView actions={actions} />}
      {view === "confirmaciones" && <ConfirmationsView />}
    </div>
  );
}
