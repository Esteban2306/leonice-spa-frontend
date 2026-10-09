"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck2,
  CalendarDays,
  ClipboardPen,
  Scissors,
  Sparkles,
  UserPlus,
  Wallet,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { formatBogotaTime } from "@/src/lib/date/bogota";
import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { DailyReport } from "@/src/features/admin/types/reports.types";

interface DailyReportDialogProps {
  open: boolean;
  report: DailyReport | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onClose: () => void;
}

const DAY_LABEL = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  weekday: "long",
  day: "numeric",
  month: "long",
});

function dayLabel(dayKey: string): string {
  return DAY_LABEL.format(new Date(`${dayKey}T12:00:00-05:00`));
}

function Stat({
  icon,
  value,
  label,
  detail,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[1.5rem] border border-tertiary/25 bg-white/70 p-4">
      <span className="text-tertiary">{icon}</span>
      <span className="font-sans text-3xl leading-none font-light text-secondary tabular-nums">
        {value}
      </span>
      <span className="font-sans text-sm text-secondary">{label}</span>
      {detail && (
        <span className="font-sans text-xs text-secondary/70">{detail}</span>
      )}
    </div>
  );
}

function TodayRow({
  icon,
  text,
  href,
  cta,
  onNavigate,
}: {
  icon: ReactNode;
  text: string;
  href: string;
  cta: string;
  onNavigate: () => void;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-quaternary">
        {icon}
      </span>
      <span className="min-w-0 flex-1 font-sans text-sm text-primary">
        {text}
      </span>
      <Link
        href={href}
        onClick={onNavigate}
        className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 font-sans text-xs text-quaternary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
      >
        {cta}
        <ArrowUpRight className="size-3.5" />
      </Link>
    </li>
  );
}

function ReportBody({
  report,
  onClose,
}: {
  report: DailyReport;
  onClose: () => void;
}) {
  const { appointments, revenue, bookings, today } = report;
  const maxCategory = Math.max(1, ...report.categories.map((c) => c.scheduled));
  const isQuietDay = appointments.scheduled === 0 && bookings.created === 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {isQuietDay ? (
        <p className="rounded-2xl border border-tertiary/25 bg-white/70 p-4 font-sans text-sm text-secondary/75">
          Ayer no hubo citas ni reservas nuevas.
        </p>
      ) : (
        <>
          <section
            aria-label="Resultado del día"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            <Stat
              icon={<CalendarCheck2 className="size-4.5" strokeWidth={1.8} />}
              value={`${appointments.completed}/${appointments.scheduled}`}
              label="Citas completadas"
              detail={`${appointments.noShow} no asistió · ${appointments.cancelled} canceladas`}
            />
            <Stat
              icon={<Sparkles className="size-4.5" strokeWidth={1.8} />}
              value={formatCopFromThousands(revenue.completedServices)}
              label="Servicios realizados"
              detail="Valor de las citas completadas"
            />
            <Stat
              icon={<Wallet className="size-4.5" strokeWidth={1.8} />}
              value={formatCopFromThousands(revenue.depositsApproved.amount)}
              label={`${revenue.depositsApproved.count} anticipos aprobados`}
              detail={
                revenue.depositsRejected > 0
                  ? `${revenue.depositsRejected} comprobantes rechazados`
                  : undefined
              }
            />
            <Stat
              icon={<UserPlus className="size-4.5" strokeWidth={1.8} />}
              value={String(bookings.created)}
              label="Reservas nuevas"
              detail={`WhatsApp ${bookings.byChannel.WHATSAPP} · Web ${bookings.byChannel.WEB} · ${report.newClients} clientas nuevas`}
            />
          </section>

          {appointments.cancelled > 0 && (
            <p className="font-sans text-sm text-secondary/75">
              Cancelaciones: {appointments.cancelledBy.CLIENT} por la clienta ·{" "}
              {appointments.cancelledBy.ADMIN} desde el panel ·{" "}
              {appointments.cancelledBy.TIMEOUT} por depósito vencido.
              {appointments.leftOpen > 0 &&
                ` ${appointments.leftOpen} citas quedaron sin cerrar.`}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <section
              aria-labelledby="report-top"
              className="flex flex-col gap-3"
            >
              <h3
                id="report-top"
                className="font-heading text-xl text-secondary"
              >
                Servicios más agendados
              </h3>
              {report.topTreatments.length === 0 ? (
                <p className="font-sans text-sm text-secondary/70">
                  Sin servicios agendados.
                </p>
              ) : (
                <ol className="flex flex-col gap-2">
                  {report.topTreatments.map((treatment, index) => (
                    <li
                      key={treatment.treatmentId}
                      className="flex items-center gap-3"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-quaternary/35 font-sans text-xs font-semibold text-secondary tabular-nums">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-sans text-sm text-secondary">
                          {treatment.name}
                        </span>
                        <span className="block font-sans text-xs text-secondary/70">
                          {treatment.category}
                        </span>
                      </span>
                      <span className="font-sans text-sm font-semibold text-secondary tabular-nums">
                        {treatment.count}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section
              aria-labelledby="report-categories"
              className="flex flex-col gap-3"
            >
              <h3
                id="report-categories"
                className="font-heading text-xl text-secondary"
              >
                Por estación
              </h3>
              <ul className="flex flex-col gap-3">
                {report.categories.map((category) => (
                  <li key={category.categoryId} className="flex flex-col gap-1">
                    <span className="flex justify-between font-sans text-sm text-secondary">
                      {category.name}
                      <span className="tabular-nums text-secondary/75">
                        {category.completed} de {category.scheduled}
                      </span>
                    </span>
                    <span className="relative h-2 overflow-hidden rounded-full bg-secondary/10">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-quaternary"
                        style={{
                          width: `${(category.scheduled / maxCategory) * 100}%`,
                        }}
                      />
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-secondary"
                        style={{
                          width: `${(category.completed / maxCategory) * 100}%`,
                        }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}

      <section
        aria-labelledby="report-today"
        className="rounded-[1.75rem] bg-secondary p-5 text-primary"
      >
        <h3 id="report-today" className="font-heading text-2xl">
          Para hoy
        </h3>
        <ul className="mt-2 divide-y divide-primary/10">
          <TodayRow
            icon={<CalendarDays className="size-4" strokeWidth={1.8} />}
            text={
              today.appointments === 0
                ? "No hay citas agendadas hoy."
                : `${today.appointments} ${today.appointments === 1 ? "cita" : "citas"} hoy${
                    today.firstAppointmentAt
                      ? `, la primera a las ${formatBogotaTime(today.firstAppointmentAt)}`
                      : ""
                  }.`
            }
            href={`/admin/calendar?date=${today.date}`}
            cta="Calendario"
            onNavigate={onClose}
          />
          <TodayRow
            icon={<BadgeCheck className="size-4" strokeWidth={1.8} />}
            text={`${today.pendingDeposits} ${today.pendingDeposits === 1 ? "reserva espera" : "reservas esperan"} depósito.`}
            href="/admin?view=pending"
            cta="Revisar"
            onNavigate={onClose}
          />
          {today.pendingAssessments > 0 && (
            <TodayRow
              icon={<ClipboardPen className="size-4" strokeWidth={1.8} />}
              text={`${today.pendingAssessments} ${today.pendingAssessments === 1 ? "cita de hoy necesita" : "citas de hoy necesitan"} valoración.`}
              href={`/admin/calendar?date=${today.date}`}
              cta="Valorar"
              onNavigate={onClose}
            />
          )}
          {today.hairProfilesToRenew > 0 && (
            <TodayRow
              icon={<Scissors className="size-4" strokeWidth={1.8} />}
              text={`${today.hairProfilesToRenew} ${today.hairProfilesToRenew === 1 ? "perfil capilar" : "perfiles capilares"} por renovar antes de sus citas.`}
              href="/admin#perfiles-por-renovar"
              cta="Ver"
              onNavigate={onClose}
            />
          )}
        </ul>
      </section>
    </div>
  );
}

export function DailyReportDialog({
  open,
  report,
  isLoading,
  isError,
  onRetry,
  onClose,
}: DailyReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-0 sm:max-w-3xl">
        <header className="bg-secondary px-6 pt-7 pb-6 text-primary">
          <DialogTitle className="font-heading text-3xl leading-tight text-primary sm:text-4xl">
            {report
              ? `Así cerró el ${dayLabel(report.date)}`
              : "Reporte de ayer"}
          </DialogTitle>
          <DialogDescription className="mt-2 font-sans text-sm text-primary/70">
            Resumen del día anterior y lo que conviene atender hoy. Montos en
            pesos colombianos.
          </DialogDescription>
        </header>

        {isLoading && (
          <div className="grid grid-cols-2 gap-3 p-6 lg:grid-cols-4">
            {[0, 1, 2, 3].map((key) => (
              <div
                key={key}
                className="h-32 animate-pulse rounded-[1.5rem] bg-secondary/5"
              />
            ))}
          </div>
        )}

        {isError && !report && (
          <div
            role="alert"
            className="m-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudo cargar el reporte.
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {report && <ReportBody report={report} onClose={onClose} />}

        <div className="flex justify-end border-t border-tertiary/25 p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90"
          >
            Empezar el día
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
