import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/src/features/admin/types/conduit.types";

import { StatusPill } from "../components/status-pill";
import {
  formatTime,
  isHandoff,
  maskWhatsappPhone,
  relativeTime,
} from "../lib/whatsapp-format";

export type InboxTab = "pending" | "all" | "closed";

const TABS: ReadonlyArray<{ value: InboxTab; label: string }> = [
  { value: "pending", label: "Pendientes" },
  { value: "all", label: "Todas" },
  { value: "closed", label: "Cerradas" },
];

interface ConversationListProps {
  tab: InboxTab;
  search: string;
  conversations: readonly ConversationSummary[];
  selectedId: string | null;
  isLoading: boolean;
  nowMs: number;
  pendingCount: number;
  onTabChange: (tab: InboxTab) => void;
  onSearchChange: (search: string) => void;
  onSelect: (id: string) => void;
}

export function ConversationList({
  tab,
  search,
  conversations,
  selectedId,
  isLoading,
  nowMs,
  pendingCount,
  onTabChange,
  onSearchChange,
  onSelect,
}: ConversationListProps) {
  return (
    <section
      aria-label="Conversaciones"
      className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB]"
    >
      <div className="flex flex-col gap-3 border-b border-tertiary/25 p-4">
        <div
          role="tablist"
          aria-label="Filtrar conversaciones"
          className="flex gap-1 rounded-full border border-secondary/15 bg-white p-1"
        >
          {TABS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={tab === option.value}
              onClick={() => onTabChange(option.value)}
              className={cn(
                "inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
                tab === option.value
                  ? "bg-secondary text-primary"
                  : "text-secondary/70 hover:bg-secondary/5",
              )}
            >
              {option.label}
              {option.value === "pending" && pendingCount > 0 && (
                <span className="rounded-full bg-red-700 px-1.5 font-sans text-[11px] font-semibold text-white tabular-nums">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/70"
          />
          <input
            type="search"
            inputMode="tel"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por número"
            aria-label="Buscar conversación por número"
            className="h-11 w-full rounded-full border border-secondary/15 bg-white pr-10 pl-10 font-sans text-sm text-secondary outline-none placeholder:text-secondary/60 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {search && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <ul
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        aria-busy={isLoading}
      >
        {isLoading &&
          [0, 1, 2, 3].map((key) => (
            <li
              key={key}
              className="m-3 h-16 animate-pulse rounded-2xl bg-secondary/5"
            />
          ))}
        {!isLoading && conversations.length === 0 && (
          <li className="px-6 py-12 text-center font-sans text-sm text-secondary/70">
            {tab === "pending"
              ? "Nadie está esperando respuesta. Todo al día."
              : search
                ? "Ningún chat coincide con ese número."
                : "Aún no hay conversaciones. Cuando una clienta escriba al WhatsApp del spa aparecerá aquí."}
          </li>
        )}
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedId;
          const handoff =
            conversation.botPaused && isHandoff(conversation.botPauseReason);
          const last = conversation.lastMessage;
          return (
            <li
              key={conversation.id}
              className="border-b border-tertiary/15 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "flex w-full cursor-pointer flex-col gap-1.5 px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tertiary",
                  isSelected ? "bg-quaternary/35" : "hover:bg-quaternary/15",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-sans text-sm font-semibold text-secondary tabular-nums">
                    {conversation.awaitingReply && (
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-red-600"
                      />
                    )}
                    {maskWhatsappPhone(conversation.phoneNumber)}
                  </span>
                  <span className="shrink-0 font-sans text-xs text-secondary/65">
                    {relativeTime(conversation.lastMessageAt, nowMs)}
                  </span>
                </span>
                {last && (
                  <span className="truncate font-sans text-sm text-secondary/75">
                    {last.processedBy === "bot"
                      ? "Asistente: "
                      : last.processedBy === "human"
                        ? "Equipo: "
                        : ""}
                    {last.content}
                  </span>
                )}
                {(conversation.awaitingReply || conversation.botPaused) && (
                  <span className="flex flex-wrap gap-1.5">
                    {handoff && (
                      <StatusPill tone="red">Pidió una persona</StatusPill>
                    )}
                    {conversation.awaitingReply && !handoff && (
                      <StatusPill tone="amber">Esperando respuesta</StatusPill>
                    )}
                    {conversation.botPaused && conversation.botPausedUntil && (
                      <span title={conversation.botPauseReason ?? undefined}>
                        <StatusPill tone="gray">
                          Asistente en pausa hasta{" "}
                          {formatTime(conversation.botPausedUntil)}
                        </StatusPill>
                      </span>
                    )}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
