"use client";

import { useState, type FormEvent } from "react";
import { Copy, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { useBaseSchedule } from "@/src/features/admin/hooks/use-schedule";
import type { ScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";
import type { BaseScheduleWindow } from "@/src/features/admin/types/schedule.types";
import { cn } from "@/lib/utils";

import {
  MAX_WINDOWS_PER_DAY,
  WEEK_ORDER,
  draftFromBase,
  draftToRequest,
  isSameSchedule,
  newWindowKey,
  suggestNextWindow,
  totalWeeklyHours,
  validateWeeklyDraft,
  type WeeklyDraft,
} from "../../lib/weekly-schedule";
import type { ScheduleDialogMode } from "./schedule-exception-dialog";

export type CalendarScheduleDialog = ScheduleDialogMode | "weekly";

interface WeeklyScheduleDialogProps {
  actions: ScheduleActions;
  onClose: () => void;
}

const ICON_BUTTON =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/60 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-40";

function WeeklyScheduleForm({
  base,
  actions,
  onClose,
}: {
  base: readonly BaseScheduleWindow[];
  actions: ScheduleActions;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<WeeklyDraft>(() => draftFromBase(base));
  const [isSaving, setIsSaving] = useState(false);

  const errors = validateWeeklyDraft(draft);
  const hasErrors = Object.keys(errors).length > 0;
  const isUnchanged = isSameSchedule(draft, base);
  const openDays = WEEK_ORDER.filter(
    ({ dayOfWeek }) => draft[dayOfWeek].length > 0,
  ).length;

  const setDay = (dayOfWeek: number, windows: WeeklyDraft[number]) =>
    setDraft((current) => ({ ...current, [dayOfWeek]: windows }));

  const copyToOthers = (source: number) =>
    setDraft((current) => {
      const next: WeeklyDraft = { ...current };
      for (const { dayOfWeek } of WEEK_ORDER) {
        if (dayOfWeek === source) continue;
        next[dayOfWeek] = current[source].map((w) => ({
          ...w,
          key: newWindowKey(),
        }));
      }
      return next;
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasErrors || isUnchanged || isSaving) return;
    setIsSaving(true);
    const ok = await actions.updateBaseSchedule(draftToRequest(draft));
    setIsSaving(false);
    if (ok) onClose();
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="flex min-h-0 flex-col"
    >
      <p className="px-6 font-sans text-sm text-secondary/70">
        {openDays} {openDays === 1 ? "día abierto" : "días abiertos"} ·{" "}
        {totalWeeklyHours(draft)} h a la semana
      </p>

      <ul className="mt-4 flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-6 pb-2">
        {WEEK_ORDER.map(({ dayOfWeek, label }) => {
          const windows = draft[dayOfWeek];
          const isClosed = windows.length === 0;
          return (
            <li
              key={dayOfWeek}
              className={cn(
                "flex flex-col gap-2 rounded-2xl border p-3 sm:flex-row sm:items-start",
                errors[dayOfWeek]
                  ? "border-red-300 bg-red-50/60"
                  : "border-secondary/10 bg-white/70",
              )}
            >
              <div className="flex items-center justify-between gap-2 sm:w-32 sm:pt-2">
                <span className="font-sans text-sm font-semibold text-secondary">
                  {label}
                </span>
                {isClosed && (
                  <span className="rounded-full bg-secondary/5 px-2.5 py-0.5 font-sans text-[11px] text-secondary/70 sm:hidden">
                    Cerrado
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {isClosed && (
                  <p className="hidden pt-2 font-sans text-sm text-secondary/60 sm:block">
                    Cerrado
                  </p>
                )}
                {windows.map((window, index) => (
                  <div key={window.key} className="flex items-center gap-2">
                    <input
                      type="time"
                      step={900}
                      aria-label={`${label}: inicio de la franja ${index + 1}`}
                      value={window.startTime}
                      onChange={(event) =>
                        setDay(
                          dayOfWeek,
                          windows.map((w) =>
                            w.key === window.key
                              ? { ...w, startTime: event.target.value }
                              : w,
                          ),
                        )
                      }
                      className={`${INPUT_CLASS} h-10 min-w-0 flex-1 tabular-nums`}
                    />
                    <span
                      aria-hidden="true"
                      className="font-sans text-secondary/50"
                    >
                      –
                    </span>
                    <input
                      type="time"
                      step={900}
                      aria-label={`${label}: fin de la franja ${index + 1}`}
                      value={window.endTime}
                      onChange={(event) =>
                        setDay(
                          dayOfWeek,
                          windows.map((w) =>
                            w.key === window.key
                              ? { ...w, endTime: event.target.value }
                              : w,
                          ),
                        )
                      }
                      className={`${INPUT_CLASS} h-10 min-w-0 flex-1 tabular-nums`}
                    />
                    <button
                      type="button"
                      aria-label={`Quitar la franja ${index + 1} del ${label.toLowerCase()}`}
                      onClick={() =>
                        setDay(
                          dayOfWeek,
                          windows.filter((w) => w.key !== window.key),
                        )
                      }
                      className={ICON_BUTTON}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {errors[dayOfWeek] && (
                  <p role="alert" className="font-sans text-xs text-red-700">
                    {errors[dayOfWeek]}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 sm:pt-0.5">
                <button
                  type="button"
                  aria-label={`Agregar una franja al ${label.toLowerCase()}`}
                  disabled={windows.length >= MAX_WINDOWS_PER_DAY}
                  onClick={() =>
                    setDay(dayOfWeek, [
                      ...windows,
                      { key: newWindowKey(), ...suggestNextWindow(windows) },
                    ])
                  }
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/50 px-3 font-sans text-xs text-secondary transition-colors hover:bg-quaternary/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-3.5" strokeWidth={2} />
                  {isClosed ? "Abrir" : "Franja"}
                </button>
                <button
                  type="button"
                  aria-label={`Copiar el horario del ${label.toLowerCase()} a los demás días`}
                  title="Copiar a los demás días"
                  onClick={() => copyToOthers(dayOfWeek)}
                  className={ICON_BUTTON}
                >
                  <Copy className="size-4" strokeWidth={1.8} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {errors[-1] && (
        <p role="alert" className="px-6 pt-2 font-sans text-sm text-red-700">
          {errors[-1]}
        </p>
      )}

      <div className="mt-4 flex flex-col-reverse gap-2 border-t border-tertiary/25 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs text-secondary/70 sm:max-w-xs">
          Si una reserva quedaría fuera del nuevo horario, no se guarda y te
          mostramos cuál.
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="h-11 cursor-pointer rounded-full px-5 font-sans text-sm text-secondary/70 transition-colors hover:bg-secondary/5 disabled:opacity-50"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={hasErrors || isUnchanged || isSaving}
            className="h-11 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Guardar horario"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function WeeklyScheduleDialog({
  actions,
  onClose,
}: WeeklyScheduleDialogProps) {
  const baseQuery = useBaseSchedule();

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-0 sm:max-w-2xl">
        <div className="flex flex-col gap-2 p-6 pb-3">
          <DialogTitle className="font-heading text-2xl text-secondary">
            Horario semanal
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-secondary/70">
            Cuándo abre el spa cada día. Los bloqueos y horarios extra de días
            puntuales se aplican encima, y los plazos de depósito se cuentan con
            este horario.
          </DialogDescription>
        </div>

        {baseQuery.isLoading && (
          <p className="px-6 pb-6 font-sans text-sm text-secondary/70">
            Cargando horario…
          </p>
        )}
        {baseQuery.isError && (
          <div
            role="alert"
            className="mx-6 mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudo cargar el horario.
            <button
              type="button"
              onClick={() => void baseQuery.refetch()}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}
        {baseQuery.data && (
          <WeeklyScheduleForm
            base={baseQuery.data}
            actions={actions}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
