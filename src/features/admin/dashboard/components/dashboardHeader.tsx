"use client";

import { Bell, CalendarPlus, Moon, Sunrise, Sun, Sunset } from "lucide-react";

import { BUSINESS_TIME_ZONE } from "@/src/lib/date/bogota";

import type {
  DashboardHeaderActions,
  DashboardHeaderData,
} from "@/src/features/admin/types/dashboard.types";

interface DashboardHeaderProps
  extends DashboardHeaderData, DashboardHeaderActions {}

interface TimePresentation {
  greeting: string;
  Icon: typeof Sun;
}

function getTimePresentation(hour: number): TimePresentation {
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Buenos días",
      Icon: Sunrise,
    };
  }

  if (hour >= 12 && hour < 18) {
    return {
      greeting: "Buenas tardes",
      Icon: Sun,
    };
  }

  if (hour >= 18 && hour < 22) {
    return {
      greeting: "Buenas noches",
      Icon: Sunset,
    };
  }

  return {
    greeting: "Buenas noches",
    Icon: Moon,
  };
}

const BUSINESS_DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  timeZone: BUSINESS_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const BUSINESS_HOUR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  hour: "numeric",
  hourCycle: "h23",
});

function formatDate(date: Date): string {
  return BUSINESS_DATE_FORMATTER.format(date);
}

function getBusinessHour(date: Date): number {
  return Number(BUSINESS_HOUR_FORMATTER.format(date));
}

export function DashboardHeader({
  locationName,
  summary,
  onViewNotifications,
  onCreateReservation,
}: DashboardHeaderProps) {
  const now = new Date();

  const { greeting, Icon } = getTimePresentation(getBusinessHour(now));

  const formattedDate = formatDate(now);

  return (
    <header className="w-full overflow-hidden rounded-2xl border border-secondary/10 bg-[#FCF6EB] shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-8 p-7 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-sm text-secondary/60">
              <span className="inline-flex items-center gap-2">
                <Icon className="size-4 text-tertiary" strokeWidth={1.7} />

                <span className="capitalize">{formattedDate}</span>
              </span>

              <span className="hidden size-1 rounded-full bg-tertiary/60 sm:block" />

              <span>{locationName}</span>
            </div>

            <h1 className="mt-5 font-heading text-4xl leading-tight text-secondary ">
              {greeting}, Leonice
            </h1>

            <div className="mt-5">
              <span className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-tertiary">
                Resumen de hoy
              </span>

              <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-secondary/65">
                Tienes{" "}
                <strong className="font-semibold text-secondary">
                  {summary.todayAppointments}
                </strong>{" "}
                {summary.todayAppointments === 1
                  ? "cita programada"
                  : "citas programadas"}{" "}
                para hoy y{" "}
                <strong className="font-semibold text-secondary">
                  {summary.pendingConfirmations}
                </strong>{" "}
                pendientes por confirmar.
              </p>
            </div>
          </div>
        </div>

        <DashboardHeaderActions
          pendingConfirmations={summary.pendingConfirmations}
          onViewNotifications={onViewNotifications}
          onCreateReservation={onCreateReservation}
        />
      </div>
    </header>
  );
}

interface DashboardHeaderActionsProps {
  pendingConfirmations: number;
  onViewNotifications: () => void;
  onCreateReservation: () => void;
}

function DashboardHeaderActions({
  pendingConfirmations,
  onViewNotifications,
  onCreateReservation,
}: DashboardHeaderActionsProps) {
  const hasPendingConfirmations = pendingConfirmations > 0;

  return (
    <div className="flex w-full flex-col justify-between gap-5 border-t border-secondary/10 bg-secondary p-6 text-primary lg:w-88 lg:border-l lg:border-t-0 lg:p-5">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bell className="size-4.5 text-quaternary" strokeWidth={1.7} />
          </div>

          {hasPendingConfirmations && (
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-tertiary px-2 py-1 font-sans text-xs font-semibold text-secondary">
              {pendingConfirmations}
            </span>
          )}
        </div>

        <p className="mt-3 font-heading text-2xl">
          {hasPendingConfirmations
            ? "Tienes avisos pendientes"
            : "Todo está al día"}
        </p>

        <p className="mt-2 font-sans text-sm leading-6 text-primary/60">
          {hasPendingConfirmations
            ? "Hay reservas que necesitan tu confirmación antes de la cita."
            : "No hay reservas pendientes de confirmación por ahora."}
        </p>
      </div>

      <div className="flex flex-row gap-2.5">
        <button
          type="button"
          onClick={onViewNotifications}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/15 px-4 font-sans text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Bell className="size-4" strokeWidth={1.8} />
          Ver avisos
        </button>

        <button
          type="button"
          onClick={onCreateReservation}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-tertiary px-4 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary"
        >
          <CalendarPlus className="size-4" strokeWidth={1.8} />
          Nueva reserva
        </button>
      </div>
    </div>
  );
}
