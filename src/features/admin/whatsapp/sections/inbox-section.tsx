"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
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
import { MutedContactsDialog } from "../inbox/muted-contacts-dialog";
import { needsAttention, sortForInbox } from "../lib/whatsapp-format";

const PENDING_PARAMS = { limit: 100 } as const;
const PAGE = 50;
const subscribeNoop = () => () => undefined;

export function InboxSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nowMs = useMinuteClock();
  const selectedId = searchParams.get("chat");
  const lookup = (searchParams.get("buscar") ?? "").replace(/\D/g, "");
  const [tab, setTab] = useState<InboxTab>(lookup ? "all" : "pending");
  const [search, setSearch] = useState(lookup);
  const [mutedOpen, setMutedOpen] = useState(false);
  const digits = search.replace(/\D/g, "");
  const debouncedDigits = useDebouncedValue(digits, 350, digits);

  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const pendingQuery = useConversations(PENDING_PARAMS);
  const pendingData = hydrated ? pendingQuery.data : undefined;
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
  const listData = hydrated ? listQuery.data : undefined;
  const overview = useConduitOverview();
  const actions = useConduitActions();

  const pendingConversations = useMemo(
    () => sortForInbox((pendingData?.data ?? []).filter(needsAttention)),
    [pendingData],
  );
  const visible = useMemo(() => {
    if (tab === "pending") {
      return debouncedDigits
        ? pendingConversations.filter((c) =>
            c.phoneNumber.includes(debouncedDigits),
          )
        : pendingConversations;
    }
    return sortForInbox(listData?.data ?? []);
  }, [tab, debouncedDigits, pendingConversations, listData]);

  const selected =
    [...(pendingData?.data ?? []), ...(listData?.data ?? [])].find(
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
    <div className="grid h-[calc(100dvh-12.5rem-var(--admin-dock-space))] min-h-[30rem] grid-cols-1 sm:h-[calc(100dvh-15rem-var(--admin-dock-space))] desk:h-[calc(100dvh-15rem)] sm:min-h-[34rem] gap-4 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
      <div
        className={cn(
          "min-h-0",
          selected ? "hidden lg:flex lg:flex-col" : "flex flex-col",
        )}
      >
        {hydrated && activeQuery.isError ? (
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
            isLoading={!hydrated || activeQuery.isLoading}
            nowMs={nowMs}
            pendingCount={pendingConversations.length}
            onTabChange={setTab}
            onSearchChange={setSearch}
            onSelect={select}
            onManageMuted={() => setMutedOpen(true)}
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
      <MutedContactsDialog
        open={mutedOpen}
        onOpenChange={setMutedOpen}
        actions={actions}
      />
    </div>
  );
}
