import { ChevronLeft, ChevronRight, Search, UserPlus, Users, X } from "lucide-react";

import type {
  ClientListItem,
  CreateClientRequest,
  PaginatedClients,
} from "@/src/features/admin/types/clients.types";

import { ClientDirectoryCard } from "./client-directory-card";
import { CreateClientDialog } from "./create-client-dialog";

interface ClientsDirectoryViewProps {
  query: string;
  clients: readonly ClientListItem[];
  pagination: PaginatedClients["pagination"];
  isLoading: boolean;
  isError: boolean;
  isQueryTooShort: boolean;
  onQueryChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onOpenClient: (clientId: string) => void;
  onCreateClient: (data: CreateClientRequest) => Promise<boolean>;
}

const PAGE_BUTTON =
  "grid size-10 cursor-pointer place-items-center rounded-full border border-secondary/15 bg-white text-secondary transition-colors hover:bg-quaternary/25 disabled:cursor-not-allowed disabled:opacity-40";

export function ClientsDirectoryView({
  query,
  clients,
  pagination,
  isLoading,
  isError,
  isQueryTooShort,
  onQueryChange,
  onPageChange,
  onRetry,
  onOpenClient,
  onCreateClient,
}: ClientsDirectoryViewProps) {
  const { page, totalPages, total } = pagination;

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 overflow-hidden rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-quaternary">
              Clientes · CRM
            </p>
            <h1 className="mt-2 font-heading text-4xl">Directorio de clientes</h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-primary/65">
              Busca por nombre o teléfono y abre la ficha para gestionar perfil, salud, citas y pagos.
            </p>
          </div>

          <CreateClientDialog
            onCreate={onCreateClient}
            trigger={
              <button
                type="button"
                className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary"
              >
                <UserPlus className="size-4" strokeWidth={1.8} />
                Nuevo cliente
              </button>
            }
          />
        </header>

        <section className="flex flex-col gap-4 rounded-[2rem] bg-[#F7F1E3] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-secondary/45" />
              <input
                type="search"
                value={query}
                autoFocus
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Buscar por nombre o teléfono"
                aria-label="Buscar clientes"
                className="h-12 w-full rounded-full border border-secondary/15 bg-white pl-11 pr-10 font-sans text-sm text-secondary outline-none placeholder:text-secondary/40 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-secondary/50 hover:bg-secondary/5"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <p className="inline-flex items-center gap-2 font-sans text-sm text-secondary/60">
              <Users className="size-4" />
              {total} {total === 1 ? "cliente" : "clientes"}
            </p>
          </div>

          {isQueryTooShort && (
            <p className="font-sans text-xs text-secondary/55">
              Escribe al menos 2 letras o 4 dígitos para filtrar.
            </p>
          )}

          {isError && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
              No se pudo cargar el directorio.
              <button type="button" onClick={onRetry} className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white">
                Reintentar
              </button>
            </div>
          )}

          <div
            aria-busy={isLoading}
            className={`grid grid-cols-1 gap-3 transition-opacity lg:grid-cols-2 ${isLoading ? "opacity-60" : ""}`}
          >
            {clients.map((client) => (
              <ClientDirectoryCard key={client.id} client={client} onOpen={onOpenClient} />
            ))}
          </div>

          {!isLoading && !isError && clients.length === 0 && (
            <p className="py-12 text-center font-sans text-secondary/60">
              {query ? "No hay clientes que coincidan con la búsqueda." : "Aún no hay clientes registrados."}
            </p>
          )}

          {totalPages > 1 && (
            <footer className="flex items-center justify-end gap-3 border-t border-tertiary/25 pt-4">
              <span className="font-sans text-sm text-secondary/60">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                aria-label="Página anterior"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className={PAGE_BUTTON}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className={PAGE_BUTTON}
              >
                <ChevronRight className="size-4" />
              </button>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}
