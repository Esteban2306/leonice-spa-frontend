import type {
  AcceptReservationHandler,
  PendingReservation,
} from "@/src/features/admin/types/dashboard.types";

import { PendingReservationCard } from "./pendingReservationCard";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

interface PendingReservationsProps {
  reservations: PendingReservation[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;

  isCancellingReservation: boolean;
  cancellingReservationId: string | null;

  onAccept: AcceptReservationHandler;
  onReschedule: (reservationId: string) => void;
  onContactClient: (phone: string) => void;
  onViewClient: (clientId: string) => void;
  onCancel: (reservationId: string) => void;
  onViewProof: (reservationId: string, proofUrl: string) => void;

  onPageChange: (page: number) => void;
}

type PaginationItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function PendingReservations({
  reservations,
  pagination,
  isLoading,
  isError,
  onRetry,
  onAccept,
  onReschedule,
  onContactClient,
  onViewClient,
  onCancel,
  onViewProof,
  onPageChange,
  isCancellingReservation,
  cancellingReservationId,
}: PendingReservationsProps) {
  const { page, total, totalPages, pageSize } = pagination;

  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  const paginationItems = getPaginationItems(page, totalPages);

  const hasReservations = reservations.length > 0;
  const isInitialLoad = isLoading && !hasReservations;
  const showError = isError && !hasReservations;
  const isEmpty = !isLoading && !isError && !hasReservations;
  const isRefreshing = isLoading && hasReservations;

  return (
    <section
      aria-labelledby="pending-reservations-title"
      className="flex flex-col gap-5 bg-[#F7F1E3] p-4 rounded-2xl"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2
              id="pending-reservations-title"
              className="font-heading text-4xl text-secondary"
            >
              Reservas pendientes
            </h2>

            <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-sans text-sm text-primary">
              {total}
            </span>
          </div>

          <p className="mt-2 font-sans text-lg text-secondary/60">
            Revisa el comprobante, acepta o gestiona cada reserva desde
            Opciones.
          </p>
        </div>
      </header>

      <div
        aria-busy={isLoading}
        className={`flex flex-col gap-5 transition-opacity ${
          isRefreshing ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {isInitialLoad && (
          <p
            role="status"
            className="py-10 text-center font-sans text-secondary/60"
          >
            Cargando reservas pendientes…
          </p>
        )}

        {showError && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 py-10 text-center font-sans text-secondary"
          >
            <p>No se pudieron cargar las reservas pendientes.</p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full bg-secondary px-5 py-2 text-sm text-primary"
            >
              Reintentar
            </button>
          </div>
        )}

        {isEmpty && (
          <p className="py-10 text-center font-sans text-secondary/60">
            No hay reservas pendientes por confirmar.
          </p>
        )}

        {reservations.map((reservation) => (
          <PendingReservationCard
            key={reservation.items[0].reservationId}
            reservation={reservation}
            onAccept={onAccept}
            onReschedule={onReschedule}
            onContactClient={onContactClient}
            onViewClient={onViewClient}
            onCancel={onCancel}
            onViewProof={onViewProof}
            isCancellingReservation={isCancellingReservation}
            cancellingReservationId={cancellingReservationId}
          />
        ))}
      </div>

      {total > 0 && (
        <footer className="flex flex-col gap-5 border-t border-tertiary/30 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-secondary/60">
            Mostrando {firstItem}–{lastItem} de {total} reservas
          </p>

          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Anterior"
                  onClick={(event) => {
                    event.preventDefault();

                    if (page > 1) {
                      onPageChange(page - 1);
                    }
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>

              {paginationItems.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === page}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Siguiente"
                  onClick={(event) => {
                    event.preventDefault();

                    if (page < totalPages) {
                      onPageChange(page + 1);
                    }
                  }}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-40" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </footer>
      )}
    </section>
  );
}
