import type {
  DashboardPagination,
  DashboardReservation,
  DashboardView,
} from "@/src/features/admin/types/dashboard.types";

import { getDashboardViewConfig } from "../lib/dashboard-views";
import type { ReservationPanelHandlers } from "./panelHandlers";
import { ReservationPanelCard } from "./reservationPanelCard";
import { ReservationsViewToggle } from "./reservationsViewToggle";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

export const RESERVATIONS_PANEL_ID = "reservations-panel";

interface ReservationsPanelProps extends ReservationPanelHandlers {
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  reservations: DashboardReservation[];
  pagination: DashboardPagination;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

type PageToken = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PageToken[] {
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

export function ReservationsPanel({
  view,
  onViewChange,
  reservations,
  pagination,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  actions,
  onOpenInCalendar,
  onReschedule,
  onViewClient,
}: ReservationsPanelProps) {
  const config = getDashboardViewConfig(view);
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
      id={RESERVATIONS_PANEL_ID}
      aria-labelledby="reservations-panel-title"
      className="flex scroll-mt-6 flex-col gap-5 rounded-2xl bg-[#F7F1E3] p-4"
    >
      <header className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2
              id="reservations-panel-title"
              className="font-heading text-4xl text-secondary"
            >
              {config.title}
            </h2>

            <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-sans text-sm text-primary">
              {total}
            </span>
          </div>

          <p className="mt-2 max-w-2xl font-sans text-lg text-secondary/70">
            {config.description}
          </p>
        </div>

        <ReservationsViewToggle view={view} onViewChange={onViewChange} />
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
            className="py-10 text-center font-sans text-secondary/70"
          >
            Cargando reservas…
          </p>
        )}

        {showError && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 py-10 text-center font-sans text-secondary"
          >
            <p>No se pudieron cargar las reservas. Revisa tu conexión.</p>
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
          <p className="py-10 text-center font-sans text-secondary/70">
            {config.emptyMessage}
          </p>
        )}

        {reservations.map((reservation) => (
          <ReservationPanelCard
            key={reservation.groupKey}
            reservation={reservation}
            actions={actions}
            onOpenInCalendar={onOpenInCalendar}
            onReschedule={onReschedule}
            onViewClient={onViewClient}
          />
        ))}
      </div>

      {total > 0 && (
        <footer className="flex flex-col gap-5 border-t border-tertiary/30 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-secondary/70">
            Mostrando {firstItem}–{lastItem} de {total}{" "}
            {total === 1 ? "cliente" : "clientes"}
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
