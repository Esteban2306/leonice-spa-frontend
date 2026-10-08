"use client";

import { useDeferredValue, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useClientActions } from "@/src/features/admin/hooks/use-client-actions";
import { useClients } from "@/src/features/admin/hooks/use-clients";

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
  const term = useDeferredValue(query.trim());
  const searchable = isSearchable(term);

  const clientsQuery = useClients({
    q: searchable ? term : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const clientActions = useClientActions();

  const replaceParams = (next: { q?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
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
