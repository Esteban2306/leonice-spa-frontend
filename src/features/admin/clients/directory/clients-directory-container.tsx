"use client";

import { useDeferredValue, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useClientActions } from "@/src/features/admin/hooks/use-client-actions";
import {
  useClients,
  useClientTagCatalog,
} from "@/src/features/admin/hooks/use-clients";
import { parseTagParam, toggleTagKey } from "../lib/client-tags";

import { ClientsDirectoryView } from "./clients-directory-view";

const PAGE_SIZE = 12;
const MIN_NAME_QUERY = 2;
const MIN_PHONE_DIGITS = 4;

function isSearchable(term: string): boolean {
  const digits = term.replace(/\D/g, "").length;
  const isNumeric = /^[\d\s+()-]+$/.test(term);
  return isNumeric ? digits >= MIN_PHONE_DIGITS : term.length >= MIN_NAME_QUERY;
}

function parsePage(raw: string | null): number {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

export function ClientsDirectoryContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const page = parsePage(searchParams.get("page"));
  const selectedTags = parseTagParam(searchParams.get("tags"));
  const term = useDeferredValue(query.trim());
  const searchable = isSearchable(term);

  const clientsQuery = useClients({
    q: searchable ? term : undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const tagCatalogQuery = useClientTagCatalog();
  const clientActions = useClientActions();

  const replaceParams = (next: {
    q?: string;
    page?: number;
    tags?: readonly string[];
  }) => {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    const tags = next.tags ?? selectedTags;
    if (tags.length > 0) params.set("tags", tags.join(","));
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    replaceParams({ q: value.trim() || undefined, page: 1 });
  };

  return (
    <ClientsDirectoryView
      query={query}
      clients={clientsQuery.data?.data ?? []}
      pagination={
        clientsQuery.data?.pagination ?? {
          page,
          pageSize: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        }
      }
      isLoading={clientsQuery.isLoading || clientsQuery.isPlaceholderData}
      isError={clientsQuery.isError}
      isQueryTooShort={term.length > 0 && !searchable}
      onQueryChange={handleQueryChange}
      tagCatalog={tagCatalogQuery.data ?? []}
      selectedTags={selectedTags}
      onToggleTag={(key) =>
        replaceParams({
          q: term || undefined,
          page: 1,
          tags: toggleTagKey(selectedTags, key),
        })
      }
      onClearTags={() => replaceParams({ q: term || undefined, page: 1, tags: [] })}
      onPageChange={(next) => replaceParams({ q: term || undefined, page: next })}
      onRetry={() => void clientsQuery.refetch()}
      onOpenClient={(clientId) => router.push(`/admin/clients/${clientId}`)}
      onCreateClient={async (data) => {
        const created = await clientActions.create(data);
        if (created) router.push(`/admin/clients/${created.id}`);
        return created !== null;
      }}
    />
  );
}
