"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { HttpError } from "@/src/lib/api/http-error";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import {
  toastError,
  toastSuccess,
} from "@/src/features/admin/feedback/admin-toast";
import { useClientActions } from "@/src/features/admin/hooks/use-client-actions";
import { useClient } from "@/src/features/admin/hooks/use-clients";
import {
  useClientCredits,
  useDeposits,
} from "@/src/features/admin/hooks/use-deposits";
import { useReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import { useReservations } from "@/src/features/admin/hooks/use-reservations";
import { mapGroupedReservationToDashboard } from "@/src/features/admin/mapper/grouped-reservation.mapper";
import type { UpdateClientRequest } from "@/src/features/admin/types/clients.types";
import type { ReservationStatus } from "@/src/features/admin/types/enums";

import type { HistoryStatusFilter } from "../lib/client-crm";
import { isClientTab, type ClientTab } from "../detail/components/client-tabs";
import { ClientDetailView } from "./client-detail-view";

const LIVE_STATUSES: readonly ReservationStatus[] = [
  "PENDIENTE_VALORACION",
  "PENDIENTE_DEPOSITO",
  "CONFIRMADA",
  "CITA_EN_CURSO",
];

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function ClientDetailContainer({ clientId }: { clientId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));

  const rawTab = searchParams.get("tab");
  const tab: ClientTab = isClientTab(rawTab) ? rawTab : "upcoming";
  const [historyStatus, setHistoryStatus] =
    useState<HistoryStatusFilter>("ALL");
  const [historyQuery, setHistoryQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const clientQuery = useClient(clientId);
  const upcomingQuery = useReservations({
    clientId,
    from: todayKey,
    page: 1,
    pageSize: 50,
  });
  const depositsQuery = useDeposits({ clientId, page: 1, pageSize: 50 });
  const creditsQuery = useClientCredits(clientId);
  const reservationActions = useReservationActions();
  const clientActions = useClientActions();

  const client = clientQuery.data;
  const phone = client?.phone;

  useEffect(() => {
    if (!phone) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(event.target)
      )
        return;
      if (document.querySelector("[data-slot=dialog-content]")) return;
      const key = event.key.toLowerCase();
      if (key === "e") {
        event.preventDefault();
        setIsEditOpen(true);
      }
      if (key === "w") {
        event.preventDefault();
        window.open(
          `https://wa.me/${phone.replace(/\D/g, "")}`,
          "_blank",
          "noopener,noreferrer",
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phone]);

  const upcoming = useMemo(() => {
    const now = new Date(nowMs);
    return (upcomingQuery.data?.data ?? [])
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          LIVE_STATUSES.includes(item.status),
        ),
      }))
      .filter((group) => group.items.length > 0)
      .map((group) => mapGroupedReservationToDashboard(group, now));
  }, [upcomingQuery.data, nowMs]);

  const credits = creditsQuery.data?.credits ?? [];
  const creditThousands = credits.reduce(
    (sum, credit) => sum + Number(credit.amount),
    0,
  );

  const changeTab = (next: ClientTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "upcoming") params.delete("tab");
    else params.set("tab", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const showHistory = (status: HistoryStatusFilter) => {
    setHistoryStatus(status);
    changeTab("history");
  };

  const update = (data: UpdateClientRequest) =>
    clientActions.update(clientId, data);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toastSuccess(`${label} copiado.`);
    } catch (error) {
      toastError(`No se pudo copiar ${label.toLowerCase()}`, error);
    }
  };

  if (clientQuery.isLoading) {
    return (
      <main className="grid min-h-full place-items-center bg-primary p-10 font-sans text-secondary/80" role="status">
        Cargando ficha del cliente…
      </main>
    );
  }

  if (!client) {
    const notFound =
      !clientQuery.isError ||
      (clientQuery.error instanceof HttpError && clientQuery.error.status === 404);
    return (
      <main className="grid min-h-full place-items-center bg-primary p-10 text-center">
        <div className="flex flex-col items-center gap-3 font-sans text-secondary">
          <p>
            {notFound
              ? "Este cliente no existe o fue eliminado."
              : "No pudimos cargar este cliente."}
          </p>
          <div className="flex gap-2">
            {!notFound && (
              <button
                type="button"
                onClick={() => void clientQuery.refetch()}
                className="cursor-pointer rounded-full bg-secondary px-5 py-2 text-sm text-primary"
              >
                Reintentar
              </button>
            )}
            <Link
              href="/admin/clients"
              className="rounded-full border border-secondary/20 px-5 py-2 text-sm"
            >
              Volver al directorio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ClientDetailView
      client={client}
      todayKey={todayKey}
      nowMs={nowMs}
      creditThousands={creditThousands}
      credits={credits}
      deposits={depositsQuery.data?.data ?? []}
      isPaymentsLoading={depositsQuery.isLoading || creditsQuery.isLoading}
      upcoming={upcoming}
      isUpcomingLoading={upcomingQuery.isLoading}
      tab={tab}
      historyStatus={historyStatus}
      historyQuery={historyQuery}
      isEditOpen={isEditOpen}
      reservationActions={reservationActions}
      clientActions={clientActions}
      onTabChange={changeTab}
      onShowHistory={showHistory}
      onHistoryQueryChange={setHistoryQuery}
      onEditOpenChange={setIsEditOpen}
      onUpdate={update}
      onCopy={(text, label) => void copy(text, label)}
      onNewReservation={() =>
        router.push(`/admin/calendar?new=true&clientId=${clientId}`)
      }
      onOpenInCalendar={(reservationId) =>
        router.push(`/admin/calendar?reservationId=${reservationId}`)
      }
      onReschedule={(reservationId) =>
        router.push(`/admin/calendar?reschedule=${reservationId}`)
      }
      onViewClient={(id) => router.push(`/admin/clients/${id}`)}
    />
  );
}
