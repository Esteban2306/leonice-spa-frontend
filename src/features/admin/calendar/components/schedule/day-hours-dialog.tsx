"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";
import type { DayOverride } from "@/src/features/admin/types/schedule.types";

import { toDateKey } from "../../lib/calendar-dates";
import {
  toDayOverrideRequest,
  validateDayOverrideDraft,
  type DayOverrideDraft,
} from "../../lib/day-override-draft";

interface DayHoursDialogProps {
  date: Date;
  current: DayOverride | null;
  actions: ScheduleActions;
  onClose: () => void;
}

const SMALL_BUTTON =
  "inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-secondary/15 bg-white px-3 font-sans text-xs text-secondary hover:bg-quaternary/20";
const REMOVE_BUTTON =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5";

function initialDraft(
  date: Date,
  current: DayOverride | null,
): DayOverrideDraft {
  const key = toDateKey(date);
  return {
    from: key,
    to: key,
    closed: current?.isClosed ?? false,
    windows:
      current && current.windows.length > 0
        ? current.windows
        : [{ startTime: "07:00", endTime: "19:00" }],
    fixedStarts: (current?.startTimes.length ?? 0) > 0,
    startTimes:
      current && current.startTimes.length > 0
        ? current.startTimes
        : ["07:00", "10:00", "14:00"],
    reason: current?.reason ?? "",
  };
}

export function DayHoursDialog({
  date,
  current,
  actions,
  onClose,
}: DayHoursDialogProps) {
  const [draft, setDraft] = useState(() => initialDraft(date, current));
  const errors = validateDayOverrideDraft(draft);
  const update = (patch: Partial<DayOverrideDraft>) =>
    setDraft((previous) => ({ ...previous, ...patch }));

  return (
    <ActionDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Horario de una fecha"
      description="Reemplaza el horario semanal en las fechas que elijas (por ejemplo, diciembre). Si solo atienden a horas fijas, márcalas y el asistente y la web solo ofrecerán esas horas. Las citas que queden por fuera deben moverse antes."
      submitLabel="Guardar horario"
      submittingLabel="Guardando…"
      canSubmit={errors.length === 0}
      onSubmit={() => actions.setDayOverride(toDayOverrideRequest(draft))}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desde" htmlFor="day-hours-from">
          <input
            id="day-hours-from"
            type="date"
            value={draft.from}
            onChange={(e) => update({ from: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Hasta" htmlFor="day-hours-to">
          <input
            id="day-hours-to"
            type="date"
            value={draft.to}
            min={draft.from}
            onChange={(e) => update({ to: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-secondary">
        <input
          type="checkbox"
          checked={draft.closed}
          onChange={(e) => update({ closed: e.target.checked })}
          className="size-4 accent-secondary"
        />
        Cerrado esas fechas
      </label>

      {!draft.closed && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-sans text-sm font-semibold text-secondary">
            Franjas abiertas
          </legend>
          {draft.windows.map((window, index) => (
            <div key={index} className="flex items-end gap-2">
              <Field label="Desde" htmlFor={`day-hours-start-${index}`}>
                <input
                  id={`day-hours-start-${index}`}
                  type="time"
                  step={900}
                  value={window.startTime}
                  onChange={(e) =>
                    update({
                      windows: draft.windows.map((w, i) =>
                        i === index ? { ...w, startTime: e.target.value } : w,
                      ),
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Hasta" htmlFor={`day-hours-end-${index}`}>
                <input
                  id={`day-hours-end-${index}`}
                  type="time"
                  step={900}
                  value={window.endTime}
                  onChange={(e) =>
                    update({
                      windows: draft.windows.map((w, i) =>
                        i === index ? { ...w, endTime: e.target.value } : w,
                      ),
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              {draft.windows.length > 1 && (
                <button
                  type="button"
                  aria-label="Quitar franja"
                  onClick={() =>
                    update({
                      windows: draft.windows.filter((_, i) => i !== index),
                    })
                  }
                  className={REMOVE_BUTTON}
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          ))}
          {draft.windows.length < 6 && (
            <button
              type="button"
              onClick={() =>
                update({
                  windows: [
                    ...draft.windows,
                    { startTime: "14:00", endTime: "18:00" },
                  ],
                })
              }
              className={SMALL_BUTTON}
            >
              <Plus className="size-3.5" />
              Agregar franja
            </button>
          )}
        </fieldset>
      )}

      {!draft.closed && (
        <fieldset className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-secondary">
            <input
              type="checkbox"
              checked={draft.fixedStarts}
              onChange={(e) => update({ fixedStarts: e.target.checked })}
              className="size-4 accent-secondary"
            />
            Solo estas horas de inicio
          </label>
          {draft.fixedStarts && (
            <>
              <p className="font-sans text-xs text-secondary/70">
                Las citas solo pueden empezar a estas horas. En una cita de
                varios servicios, solo el primero empieza a una hora fija.
              </p>
              <div className="flex flex-wrap gap-2">
                {draft.startTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <input
                      aria-label={`Hora de inicio ${index + 1}`}
                      type="time"
                      step={900}
                      value={time}
                      onChange={(e) =>
                        update({
                          startTimes: draft.startTimes.map((t, i) =>
                            i === index ? e.target.value : t,
                          ),
                        })
                      }
                      className={`${INPUT_CLASS} w-32`}
                    />
                    <button
                      type="button"
                      aria-label={`Quitar ${time}`}
                      onClick={() =>
                        update({
                          startTimes: draft.startTimes.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                      className={REMOVE_BUTTON}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              {draft.startTimes.length < 24 && (
                <button
                  type="button"
                  onClick={() =>
                    update({ startTimes: [...draft.startTimes, "16:00"] })
                  }
                  className={SMALL_BUTTON}
                >
                  <Plus className="size-3.5" />
                  Agregar hora
                </button>
              )}
            </>
          )}
        </fieldset>
      )}

      <Field label="Motivo (opcional)" htmlFor="day-hours-reason">
        <TextArea
          id="day-hours-reason"
          value={draft.reason}
          maxLength={200}
          placeholder="Ej. Horarios de diciembre."
          onChange={(e) => update({ reason: e.target.value })}
        />
      </Field>

      {errors.length > 0 && (
        <ul role="alert" className="flex flex-col gap-1">
          {errors.map((error) => (
            <li key={error} className="font-sans text-xs text-red-700">
              {error}
            </li>
          ))}
        </ul>
      )}
    </ActionDialog>
  );
}
