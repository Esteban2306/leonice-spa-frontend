"use client";

import { useState } from "react";
import {
  CalendarCog,
  CalendarOff,
  ChevronDown,
  Clock,
  Trash2,
} from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import type {
  ScheduleDay,
  ScheduleException,
} from "@/src/features/admin/types/schedule.types";
import { BrandLoader } from "@/src/components/brand/brand-loader";

interface DayScheduleSectionProps {
  schedule: ScheduleDay | null;
  isLoading: boolean;
  isSaving: boolean;
  onRemoveException: (exceptionId: string) => Promise<boolean>;
  onRemoveDayOverride: (date: string) => Promise<boolean>;
}

function describeOverride(override: NonNullable<ScheduleDay["override"]>) {
  if (override.isClosed) return "Horario especial: cerrado";
  const windows = override.windows
    .map((w) => `${w.startTime}–${w.endTime}`)
    .join(" · ");
  const starts =
    override.startTimes.length > 0
      ? ` · Citas solo a las ${override.startTimes.join(", ")}`
      : "";
  return `Horario especial: ${windows}${starts}`;
}

function describeException(exception: ScheduleException): string {
  const scope = exception.categoryName ? exception.categoryName : "Todo el spa";
  const span = exception.allDay
    ? "todo el día"
    : `${exception.startTime}–${exception.endTime}`;
  const kind = exception.type === "BLOCK" ? "Bloqueo" : "Horario extra";
  return `${kind} · ${scope} · ${span}`;
}

export function DayScheduleSection({
  schedule,
  isLoading,
  isSaving,
  onRemoveException,
  onRemoveDayOverride,
}: DayScheduleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [removal, setRemoval] = useState<{
    label: string;
    run: () => Promise<boolean>;
  } | null>(null);

  if (isLoading || !schedule) {
    return isLoading ? (
      <BrandLoader
        variant="compact"
        label="Cargando horario del día…"
        className="px-1"
      />
    ) : (
      <p className="px-1" />
    );
  }

  const changes =
    schedule.exceptions.length + (schedule.override === null ? 0 : 1);

  return (
    <section
      aria-label="Horario del día"
      className="flex flex-col gap-2 rounded-2xl border border-secondary/15 bg-white/60 px-3 py-1"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        disabled={changes === 0}
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 text-left font-sans text-sm text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-default"
      >
        {schedule.isClosed ? (
          <>
            <CalendarOff className="size-4 text-red-700" aria-hidden="true" />
            <span className="flex-1 font-bold text-red-800">
              Spa cerrado este día
            </span>
          </>
        ) : (
          <>
            <Clock className="size-4 text-secondary/70" aria-hidden="true" />
            <span className="flex-1">
              Horario:{" "}
              {schedule.windows
                .map((window) => `${window.startTime}–${window.endTime}`)
                .join(" · ")}
            </span>
          </>
        )}
        {changes > 0 && (
          <span className="flex items-center gap-1 font-bold">
            {changes === 1 ? "1 cambio" : `${changes} cambios`}
            <ChevronDown
              className={`size-4 ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        )}
      </button>

      {isOpen && schedule.override && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-tertiary/15 px-3 py-1">
          <span className="flex gap-2 font-sans text-sm text-secondary">
            <CalendarCog
              className="mt-0.5 size-4 shrink-0 text-secondary/70"
              aria-hidden="true"
            />
            <span>
              {describeOverride(schedule.override)}
              {schedule.override.reason && (
                <span className="block text-secondary/80">
                  {schedule.override.reason}
                </span>
              )}
            </span>
          </span>
          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              setRemoval({
                label: "el horario especial de esta fecha",
                run: () => onRemoveDayOverride(schedule.date),
              })
            }
            aria-label="Quitar el horario especial de esta fecha"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {isOpen &&
        schedule.exceptions.map((exception) => (
          <div
            key={exception.id}
            className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-quaternary/20 px-3 py-1"
          >
            <span className="font-sans text-sm text-secondary">
              {describeException(exception)}
              {exception.reason && (
                <span className="block text-secondary/80">
                  {exception.reason}
                </span>
              )}
            </span>

            <button
              type="button"
              disabled={isSaving}
              onClick={() =>
                setRemoval({
                  label: describeException(exception),
                  run: () => onRemoveException(exception.id),
                })
              }
              aria-label={`Quitar ${describeException(exception)}`}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}

      {removal && (
        <ActionDialog
          open
          onOpenChange={(open) => !open && setRemoval(null)}
          title="¿Quitar este cambio de horario?"
          description={`Se quitará ${removal.label}. La disponibilidad vuelve a la normal.`}
          submitLabel="Sí, quitar"
          submittingLabel="Quitando…"
          tone="danger"
          onSubmit={removal.run}
        />
      )}
    </section>
  );
}
