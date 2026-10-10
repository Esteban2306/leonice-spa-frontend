"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import {
  useConduitOverview,
  useConversationMessages,
  useConversations,
} from "@/src/features/admin/hooks/use-conduit";
import { useDebouncedValue } from "@/src/features/admin/hooks/use-debounced-value";
import type { ConversationMessage } from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import { EmptyState } from "../components/section-card";
import { ConversationList, type InboxTab } from "../inbox/conversation-list";
import { ConversationThread } from "../inbox/conversation-thread";
import { needsAttention, sortForInbox } from "../lib/whatsapp-format";

const PENDING_PARAMS = { limit: 100 } as const;
const PAGE = 50;

export function InboxSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nowMs = useMinuteClock();
  const selectedId = searchParams.get("chat");
  const [tab, setTab] = useState<InboxTab>("pending");
  const [search, setSearch] = useState("");
  const digits = search.replace(/\D/g, "");
  const debouncedDigits = useDebouncedValue(digits, 350, digits);

  const pendingQuery = useConversations(PENDING_PARAMS);
  const listParams = useMemo(
    () => ({
      limit: PAGE,
      ...(debouncedDigits ? { search: debouncedDigits } : {}),
      ...(tab === "closed" ? { status: "COMPLETED" as const } : {}),
    }),
    [tab, debouncedDigits],
  );
  const listQuery = useConversations(listParams, {
    enabled: tab !== "pending",
  });
  const overview = useConduitOverview();
  const actions = useConduitActions();

  const pendingConversations = useMemo(
    () => sortForInbox((pendingQuery.data?.data ?? []).filter(needsAttention)),
    [pendingQuery.data],
  );
  const visible = useMemo(() => {
    if (tab === "pending") {
      return debouncedDigits
        ? pendingConversations.filter((c) =>
            c.phoneNumber.includes(debouncedDigits),
          )
        : pendingConversations;
    }
    return sortForInbox(listQuery.data?.data ?? []);
  }, [tab, debouncedDigits, pendingConversations, listQuery.data]);

  const selected =
    [...(pendingQuery.data?.data ?? []), ...(listQuery.data?.data ?? [])].find(
      (c) => c.id === selectedId,
    ) ?? null;

  const messagesQuery = useConversationMessages(selected?.id ?? null);
  const messages = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    const seen = new Set<string>();
    const ordered: ConversationMessage[] = [];
    for (const page of [...pages].reverse()) {
      for (const message of page) {
        if (seen.has(message.id)) continue;
        seen.add(message.id);
        ordered.push(message);
      }
    }
    return ordered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [messagesQuery.data]);

  const select = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("chat", id);
    else params.delete("chat");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const activeQuery = tab === "pending" ? pendingQuery : listQuery;
  const canSend = overview.data?.connection?.status === "CONNECTED";

  return (
    <div className="grid h-[calc(100dvh-12.5rem)] min-h-[30rem] grid-cols-1 sm:h-[calc(100dvh-15rem)] sm:min-h-[34rem] gap-4 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
      <div
        className={cn(
          "min-h-0",
          selected ? "hidden lg:flex lg:flex-col" : "flex flex-col",
        )}
      >
        {activeQuery.isError ? (
          <ErrorPanel
            error={activeQuery.error}
            onRetry={() => void activeQuery.refetch()}
          />
        ) : (
          <ConversationList
            tab={tab}
            search={search}
            conversations={visible}
            selectedId={selected?.id ?? null}
            isLoading={activeQuery.isLoading}
            nowMs={nowMs}
            pendingCount={pendingConversations.length}
            onTabChange={setTab}
            onSearchChange={setSearch}
            onSelect={select}
          />
        )}
      </div>

      <div
        className={cn(
          "min-h-0",
          selected ? "flex flex-col" : "hidden lg:flex lg:flex-col",
        )}
      >
        {selected ? (
          <ConversationThread
            key={selected.id}
            conversation={selected}
            messages={messages}
            isLoading={messagesQuery.isLoading}
            error={messagesQuery.error}
            hasOlder={Boolean(messagesQuery.hasNextPage)}
            isLoadingOlder={messagesQuery.isFetchingNextPage}
            canSend={canSend}
            nowMs={nowMs}
            actions={actions}
            onLoadOlder={() => void messagesQuery.fetchNextPage()}
            onRetry={() => void messagesQuery.refetch()}
            onBack={() => select(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-6">
            <EmptyState title="Elige una conversación">
              Las que esperan respuesta o pidieron una persona aparecen primero
              en Pendientes.
            </EmptyState>
          </div>
        )}
      </div>
    </div>
  );
}
