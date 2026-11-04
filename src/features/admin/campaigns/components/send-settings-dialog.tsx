"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { CampaignSettings } from "@/src/features/admin/types/campaigns.types";

import {
  minuteToTime,
  timeToMinute,
  windowsAreValid,
} from "../lib/campaign-format";

interface SendSettingsDialogProps {
  open: boolean;
  settings: CampaignSettings | undefined;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: CampaignSettings) => Promise<boolean>;
}

interface WindowDraft {
  start: string;
  end: string;
}

export function SendSettingsDialog({
  open,
  settings,
  onOpenChange,
  onSave,
}: SendSettingsDialogProps) {
  const [windows, setWindows] = useState<WindowDraft[]>(() =>
    (settings?.sendWindows ?? []).map((window) => ({
      start: minuteToTime(window.startMinute),
      end: minuteToTime(window.endMinute),
    })),
  );
  const [maxPerDay, setMaxPerDay] = useState(String(settings?.maxPerDay ?? 90));
  const [cooldown, setCooldown] = useState(
    String(settings?.marketingCooldownDays ?? 30),
  );

  const parsed = windows.flatMap((window) => {
    const startMinute = timeToMinute(window.start);
    const endMinute = timeToMinute(window.end);
    return startMinute === null || endMinute === null
      ? []
      : [{ startMinute, endMinute }];
  });
  const limit = Number(maxPerDay);
  const gap = Number(cooldown);
  const valid =
    parsed.length === windows.length &&
    windowsAreValid(parsed) &&
    Number.isInteger(limit) &&
    limit >= 10 &&
    limit <= 300 &&
    cooldown !== "" &&
    Number.isInteger(gap) &&
    gap >= 0 &&
    gap <= 365;

  const update = (index: number, patch: Partial<WindowDraft>) =>
    setWindows((current) =>
      current.map((window, i) =>
        i === index ? { ...window, ...patch } : window,
      ),
    );

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ajustes de envío"
      description="Valen para las campañas y para los mensajes automáticos. Los mensajes solo salen dentro de estas franjas (entre las 6:00 y las 23:00). Deja libre la hora en que el bot atiende más gente."
      submitLabel="Guardar ajustes"
      submittingLabel="Guardando…"
      canSubmit={valid}
      onSubmit={() => onSave({
          sendWindows: parsed,
          maxPerDay: limit,
          marketingCooldownDays: gap,
        })}
    >
      {windows.map((window, index) => (
        <div key={index} className="grid grid-cols-2 gap-3">
          <Field
            label={`Franja ${index + 1}: desde`}
            htmlFor={`window-start-${index}`}
          >
            <input
              id={`window-start-${index}`}
              type="time"
              value={window.start}
              onChange={(event) => update(index, { start: event.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Hasta" htmlFor={`window-end-${index}`}>
            <input
              id={`window-end-${index}`}
              type="time"
              value={window.end}
              onChange={(event) => update(index, { end: event.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
        </div>
      ))}
      {windows.length < 3 && (
        <button
          type="button"
          onClick={() =>
            setWindows((current) => [
              ...current,
              { start: "18:00", end: "20:00" },
            ])
          }
          className="w-fit cursor-pointer font-sans text-sm text-secondary underline underline-offset-4"
        >
          Añadir otra franja
        </button>
      )}
      {windows.length > 1 && (
        <button
          type="button"
          onClick={() => setWindows((current) => current.slice(0, -1))}
          className="w-fit cursor-pointer font-sans text-sm text-secondary/70 underline underline-offset-4"
        >
          Quitar la última franja
        </button>
      )}
      <Field
        label="Máximo de mensajes por día"
        htmlFor="max-per-day"
        hint="Entre 10 y 300 en total, sumando todas las campañas. Con un número muy usado, mantenlo bajo."
      >
        <input
          id="max-per-day"
          inputMode="numeric"
          value={maxPerDay}
          onChange={(event) => setMaxPerDay(event.target.value)}
          className={`${INPUT_CLASS} tabular-nums`}
        />
      </Field>
      <Field
        label="Días entre mensajes de marketing a una misma clienta"
        htmlFor="marketing-cooldown"
        hint="Cuenta campañas y mensajes automáticos de seguimiento. Quien recibió uno hace menos días se omite y se muestra el motivo. Usa 0 para no limitar."
      >
        <input
          id="marketing-cooldown"
          inputMode="numeric"
          value={cooldown}
          onChange={(event) =>
            setCooldown(event.target.value.replace(/\D/g, ""))
          }
          className={`${INPUT_CLASS} tabular-nums`}
        />
      </Field>
      {!valid && (
        <p role="alert" className="font-sans text-xs text-red-700">
          Revisa las horas: entre 6:00 y 23:00 y al menos 30 minutos por franja.
        </p>
      )}
    </ActionDialog>
  );
}
