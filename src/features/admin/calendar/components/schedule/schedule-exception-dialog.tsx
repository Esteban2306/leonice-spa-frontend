"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";
import type { Category } from "@/src/features/admin/types/categories.types";

import { toDateKey } from "../../lib/calendar-dates";

export type ScheduleDialogMode = "block-day" | "block-hours" | "open-hours";

interface ScheduleExceptionDialogProps {
  mode: ScheduleDialogMode;
  date: Date;
  categories: readonly Category[];
  actions: ScheduleActions;
  onClose: () => void;
}

const COPY: Record<
  ScheduleDialogMode,
  { title: string; description: string; submit: string; submitting: string }
> = {
  "block-day": {
    title: "Bloquear día",
    description:
      "Nadie podrá reservar ese día. Si ya hay citas, el sistema te dirá cuáles debes reprogramar o cancelar primero.",
    submit: "Bloquear día",
    submitting: "Bloqueando…",
  },
  "block-hours": {
    title: "Bloquear horas",
    description:
      "Cierra una franja del día. Las citas que ya estén dentro deben moverse antes.",
    submit: "Bloquear horas",
    submitting: "Bloqueando…",
  },
  "open-hours": {
    title: "Abrir horario extra",
    description:
      "Habilita una franja adicional para reservas ese día (por ejemplo, al mediodía).",
    submit: "Abrir horario",
    submitting: "Guardando…",
  },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function ScheduleExceptionDialog({
  mode,
  date,
  categories,
  actions,
  onClose,
}: ScheduleExceptionDialogProps) {
  const [categoryId, setCategoryId] = useState("");
  const [startTime, setStartTime] = useState(mode === "open-hours" ? "12:00" : "08:00");
  const [endTime, setEndTime] = useState(mode === "open-hours" ? "14:00" : "10:00");
  const [reason, setReason] = useState("");

  const copy = COPY[mode];
  const needsHours = mode !== "block-day";
  const hasValidHours = !needsHours || (startTime !== "" && endTime !== "" && startTime < endTime);

  const submit = () => {
    const input = {
      date: toDateKey(date),
      categoryId: categoryId || undefined,
      startTime: needsHours ? startTime : undefined,
      endTime: needsHours ? endTime : undefined,
      reason: reason.trim() || undefined,
    };
    return mode === "open-hours"
      ? actions.openExtraHours(input)
      : actions.block(input);
  };

  return (
    <ActionDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={copy.title}
      description={`${DATE_FORMATTER.format(date)}. ${copy.description}`}
      submitLabel={copy.submit}
      submittingLabel={copy.submitting}
      tone={mode === "open-hours" ? "default" : "danger"}
      canSubmit={hasValidHours}
      onSubmit={submit}
    >
      <Field label="Aplica a" htmlFor="schedule-category">
        <select
          id="schedule-category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">Todo el spa</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              Solo {category.name}
            </option>
          ))}
        </select>
      </Field>

      {needsHours && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Desde" htmlFor="schedule-start">
            <input
              id="schedule-start"
              type="time"
              step={900}
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Hasta" htmlFor="schedule-end">
            <input
              id="schedule-end"
              type="time"
              step={900}
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>
      )}

      {needsHours && !hasValidHours && (
        <p role="alert" className="font-sans text-xs text-red-700">
          La hora de inicio debe ser anterior a la de fin.
        </p>
      )}

      <Field label="Motivo (opcional)" htmlFor="schedule-reason">
        <TextArea
          id="schedule-reason"
          value={reason}
          maxLength={200}
          placeholder="Ej. Capacitación del equipo."
          onChange={(event) => setReason(event.target.value)}
        />
      </Field>
    </ActionDialog>
  );
}
