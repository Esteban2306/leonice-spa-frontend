"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCheck,
  CircleSlash,
  ImageIcon,
  PlayCircle,
  SendHorizontal,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type {
  ConversationMessage,
  ConversationSummary,
} from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import { SECONDARY_BUTTON } from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import {
  AUTHOR_LABELS,
  formatDay,
  formatTime,
  formatWhatsappPhone,
  isHandoff,
  isHiddenNumber,
} from "../lib/whatsapp-format";
import { PauseMenu } from "./pause-menu";

const MAX_TEXT = 4000;

interface PendingReply {
  key: number;
  text: string;
  state: "sending" | "failed";
}

interface ConversationThreadProps {
  conversation: ConversationSummary;
  messages: readonly ConversationMessage[];
  isLoading: boolean;
  error: unknown;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  canSend: boolean;
  nowMs: number;
  actions: ConduitActions;
  onLoadOlder: () => void;
  onRetry: () => void;
  onBack: () => void;
}

function Bubble({ message }: { message: ConversationMessage }) {
  const inbound = message.direction === "INBOUND";
  const author = message.processedBy;
  return (
    <li className={cn("flex", inbound ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-[1.25rem] px-4 py-2.5 font-sans text-sm shadow-[0_6px_16px_-14px_rgba(6,33,18,0.5)] sm:max-w-[70%]",
          inbound &&
            "rounded-bl-md border border-secondary/10 bg-white text-secondary",
          !inbound &&
            author === "human" &&
            "rounded-br-md bg-secondary text-primary",
          !inbound &&
            author === "bot" &&
            "rounded-br-md border border-tertiary/40 bg-quaternary/35 text-secondary",
          !inbound &&
            author === "system" &&
            "rounded-br-md border border-dashed border-secondary/25 bg-primary text-secondary/85",
        )}
      >
        {!inbound && (
          <p
            className={cn(
              "mb-1 font-sans text-[11px] font-semibold",
              author === "human" ? "text-quaternary" : "text-secondary/70",
            )}
          >
            {AUTHOR_LABELS[author]}
          </p>
        )}
        {message.hasImage ? (
          <p className="flex items-center gap-1.5 italic">
            <ImageIcon className="size-4" strokeWidth={1.8} />
            Imagen enviada
          </p>
        ) : (
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        )}
        <p
          className={cn(
            "mt-1 text-right font-sans text-[11px]",
            !inbound && author === "human"
              ? "text-primary/70"
              : "text-secondary/70",
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </li>
  );
}

export function ConversationThread({
  conversation,
  messages,
  isLoading,
  error,
  hasOlder,
  isLoadingOlder,
  canSend,
  nowMs,
  actions,
  onLoadOlder,
  onRetry,
  onBack,
}: ConversationThreadProps) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<PendingReply[]>([]);
  const [confirmResume, setConfirmResume] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<string | null>(null);
  const keyRef = useRef(0);

  const lastId = messages.at(-1)?.id ?? null;
  useLayoutEffect(() => {
    if (lastId && lastId !== lastIdRef.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    lastIdRef.current = lastId;
  }, [lastId]);

  useEffect(() => {
    if (pending.length && listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [pending.length]);

  const send = async (body: string, retryKey?: number) => {
    const value = body.trim();
    if (!value || !canSend) return;
    const key = retryKey ?? ++keyRef.current;
    setPending((current) => [
      ...current.filter((p) => p.key !== key),
      { key, text: value, state: "sending" },
    ]);
    if (retryKey === undefined) setText("");
    const ok = await actions.reply(conversation.id, value);
    setPending((current) =>
      ok
        ? current.filter((p) => p.key !== key)
        : current.map((p) => (p.key === key ? { ...p, state: "failed" } : p)),
    );
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void send(text);
    }
  };

  const handoff =
    conversation.botPaused && isHandoff(conversation.botPauseReason);
  const phoneDigits = conversation.phoneNumber.replace(/\D/g, "");

  return (
    <section
      aria-label={`Conversación con ${formatWhatsappPhone(conversation.phoneNumber)}`}
      className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB]"
    >
      <header className="flex flex-col gap-2.5 border-b border-tertiary/25 bg-secondary p-3 text-primary sm:gap-3 sm:p-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la lista"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-primary/20 hover:bg-primary/10 lg:hidden"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-lg leading-tight font-semibold tabular-nums sm:text-xl">
              {formatWhatsappPhone(conversation.phoneNumber)}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {handoff && <StatusPill tone="red">Pidió una persona</StatusPill>}
              {conversation.botPaused ? (
                <StatusPill tone="amber">
                  Asistente en pausa
                  {conversation.botPausedUntil
                    ? ` hasta ${formatTime(conversation.botPausedUntil)}`
                    : ""}
                </StatusPill>
              ) : (
                <StatusPill tone="green">Asistente activo</StatusPill>
              )}
              {conversation.status === "COMPLETED" && (
                <StatusPill tone="gray">Cerrada</StatusPill>
              )}
            </div>
          </div>
          {!isHiddenNumber(conversation.phoneNumber) && (
            <Link
              href={`/admin/clients?q=${phoneDigits.slice(-10)}`}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-primary/25 px-3 font-sans text-xs text-primary hover:bg-primary/10"
            >
              <UserRound className="size-3.5" />
              Ver clienta
            </Link>
          )}
        </div>
        {conversation.summary && (
          <p className="line-clamp-3 rounded-2xl bg-primary/10 px-3 py-2 font-sans text-sm text-primary/85 sm:line-clamp-none">
            <span className="font-semibold text-quaternary">Resumen: </span>
            {conversation.summary}
          </p>
        )}
        {conversation.botPaused && conversation.botPauseReason && (
          <p className="font-sans text-xs text-primary/70">
            Motivo de la pausa: {conversation.botPauseReason}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {conversation.botPaused ? (
            <button
              type="button"
              onClick={() => setConfirmResume(true)}
              className={`${SECONDARY_BUTTON} h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm`}
            >
              <PlayCircle className="size-4" strokeWidth={1.8} />
              Reanudar asistente
            </button>
          ) : (
            <PauseMenu
              nowMs={nowMs}
              onPause={(minutes, reason) =>
                void actions.pause(conversation.id, minutes, reason)
              }
            />
          )}
          {conversation.status !== "COMPLETED" && (
            <button
              type="button"
              disabled={actions.busy.has(`close:${conversation.id}`)}
              onClick={() => void actions.close(conversation.id)}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3 font-sans text-xs text-primary/85 hover:bg-primary/10 disabled:opacity-50 sm:h-10 sm:px-4 sm:text-sm"
            >
              <CheckCheck className="size-4" strokeWidth={1.8} />
              Cerrar conversación
            </button>
          )}
        </div>
      </header>

      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto bg-primary/40 px-3 py-4 sm:px-5"
      >
        {hasOlder && (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              onClick={onLoadOlder}
              disabled={isLoadingOlder}
              className="h-9 cursor-pointer rounded-full border border-secondary/15 bg-white px-4 font-sans text-xs text-secondary/80 hover:bg-quaternary/25 disabled:opacity-50"
            >
              {isLoadingOlder ? "Cargando…" : "Ver mensajes anteriores"}
            </button>
          </div>
        )}
        {isLoading && (
          <p className="py-10 text-center font-sans text-sm text-secondary/70">
            Cargando la conversación…
          </p>
        )}
        {Boolean(error) && !isLoading && (
          <ErrorPanel error={error} onRetry={onRetry} compact />
        )}
        <ol
          aria-live="polite"
          aria-relevant="additions"
          className="flex flex-col gap-2"
        >
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const dayChanged =
              !previous ||
              new Date(previous.createdAt).toDateString() !==
                new Date(message.createdAt).toDateString();
            return (
              <MessageWithDivider
                key={message.id}
                message={message}
                showDivider={dayChanged}
              />
            );
          })}
          {pending.map((reply) => (
            <li key={reply.key} className="flex justify-end">
              <div className="max-w-[85%] rounded-[1.25rem] rounded-br-md bg-secondary/80 px-4 py-2.5 font-sans text-sm text-primary sm:max-w-[70%]">
                <p className="break-words whitespace-pre-wrap">{reply.text}</p>
                {reply.state === "sending" ? (
                  <p className="mt-1 text-right text-[11px] text-primary/70">
                    Enviando…
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => void send(reply.text, reply.key)}
                    className="mt-1 flex w-full cursor-pointer items-center justify-end gap-1 text-[11px] text-quaternary underline"
                  >
                    <CircleSlash className="size-3" />
                    No se envió · Reintentar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(text);
        }}
        className="flex flex-col gap-2 border-t border-tertiary/25 bg-[#FCF6EB] p-3 sm:p-4"
      >
        {!canSend && (
          <p className="rounded-xl bg-red-50 px-3 py-2 font-sans text-xs text-red-800">
            WhatsApp está desconectado: no se pueden enviar mensajes hasta
            volver a vincular el número.
          </p>
        )}
        <div className="flex items-end gap-2">
          <label htmlFor="reply-text" className="sr-only">
            Responder como equipo
          </label>
          <textarea
            id="reply-text"
            rows={2}
            value={text}
            maxLength={MAX_TEXT}
            disabled={!canSend}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe como equipo del spa…"
            className="max-h-40 min-h-12 flex-1 resize-none rounded-2xl border border-secondary/15 bg-white px-4 py-3 font-sans text-sm text-secondary outline-none placeholder:text-secondary/55 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40 disabled:bg-secondary/5"
          />
          <button
            type="submit"
            disabled={!canSend || !text.trim()}
            aria-label="Enviar mensaje"
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-secondary text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal className="size-5" strokeWidth={1.8} />
          </button>
        </div>
        <p className="hidden font-sans text-[11px] text-secondary/65 sm:block">
          Enter envía · Shift + Enter salto de línea · Al responder, el
          asistente se pausa en este chat. El asistente atiende 24/7; los
          recordatorios salen de 8:00 a. m. a 9:00 p. m.
        </p>
      </form>

      <ActionDialog
        open={confirmResume}
        onOpenChange={setConfirmResume}
        title="¿Reanudar el asistente?"
        description="Responderá los mensajes que la clienta escribió durante la pausa."
        submitLabel="Reanudar"
        submittingLabel="Reanudando…"
        onSubmit={() => actions.resume(conversation.id)}
      />
    </section>
  );
}

function MessageWithDivider({
  message,
  showDivider,
}: {
  message: ConversationMessage;
  showDivider: boolean;
}) {
  return (
    <>
      {showDivider && (
        <li className="my-2 flex justify-center">
          <span className="inline-block rounded-full bg-[#FCF6EB] px-3 py-1 font-sans text-[11px] text-secondary/70 first-letter:uppercase">
            {formatDay(message.createdAt)}
          </span>
        </li>
      )}
      <Bubble message={message} />
    </>
  );
}
