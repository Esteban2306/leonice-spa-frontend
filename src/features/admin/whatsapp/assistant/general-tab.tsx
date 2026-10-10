"use client";

import { useState } from "react";

import {
  CheckboxField,
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type { ConduitBot } from "@/src/features/admin/types/conduit.types";

import { PRIMARY_BUTTON, SectionCard } from "../components/section-card";

function NumberField({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  min: number;
  max: number;
  onChange: (value: string) => void;
}) {
  const n = Number(value);
  const invalid = value === "" || !Number.isInteger(n) || n < min || n > max;
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={invalid ? `Entre ${min} y ${max}.` : hint}
    >
      <input
        id={id}
        inputMode="numeric"
        value={value}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        className={`${INPUT_CLASS} tabular-nums`}
      />
    </Field>
  );
}

export function GeneralTab({
  bot,
  actions,
}: {
  bot: ConduitBot;
  actions: ConduitActions;
}) {
  const [delay, setDelay] = useState(String(bot.botResponseDelaySeconds));
  const [takeover, setTakeover] = useState(String(bot.humanTakeoverMinutes));
  const [history, setHistory] = useState(String(bot.maxHistoryMessages));
  const [maxAge, setMaxAge] = useState(String(bot.maxMessageAgeMinutes));
  const [images, setImages] = useState(bot.imageAnalysisEnabled);
  const on = bot.status === "ACTIVE";

  const ranges = [
    [delay, 0, 120],
    [takeover, 1, 1440],
    [history, 1, 50],
    [maxAge, 1, 10080],
  ] as const;
  const valid = ranges.every(
    ([v, min, max]) => v !== "" && Number(v) >= min && Number(v) <= max,
  );
  const dirty =
    Number(delay) !== bot.botResponseDelaySeconds ||
    Number(takeover) !== bot.humanTakeoverMinutes ||
    Number(history) !== bot.maxHistoryMessages ||
    Number(maxAge) !== bot.maxMessageAgeMinutes ||
    images !== bot.imageAnalysisEnabled;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <SectionCard
        title={on ? "Asistente encendido" : "Asistente apagado"}
        description={
          on
            ? "Responde a las clientas a cualquier hora."
            : "Las clientas no reciben respuestas automáticas; los recordatorios sí se envían."
        }
        aside={
          <CatalogSwitch
            checked={on}
            disabled={actions.busy.has("bot")}
            label={on ? "Apagar el asistente" : "Encender el asistente"}
            onChange={(next) => void actions.toggleBot(next)}
          />
        }
      >
        <p className="font-sans text-xs text-secondary/70">{bot.name}</p>
      </SectionCard>

      <SectionCard
        title="Comportamiento"
        description="Cómo espera y cuánto recuerda el asistente."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            id="bot-delay"
            label="Espera antes de responder (s)"
            hint="Junta mensajes seguidos de la clienta. Recomendado: 8."
            value={delay}
            min={0}
            max={120}
            onChange={setDelay}
          />
          <NumberField
            id="bot-takeover"
            label="Silencio tras responder el equipo (min)"
            hint="Minutos que el asistente se calla en ese chat."
            value={takeover}
            min={1}
            max={1440}
            onChange={setTakeover}
          />
          <NumberField
            id="bot-history"
            label="Mensajes que recuerda"
            hint="Recomendado 12 o más para no perder el contexto."
            value={history}
            min={1}
            max={50}
            onChange={setHistory}
          />
          <NumberField
            id="bot-age"
            label="Ignorar mensajes más viejos que (min)"
            hint="Mensajes atrasados que ya no responde."
            value={maxAge}
            min={1}
            max={10080}
            onChange={setMaxAge}
          />
        </div>
        {Number(history) < 12 && history !== "" && (
          <p className="font-sans text-xs text-amber-900">
            Con menos de 12 mensajes el asistente puede olvidar lo que la
            clienta ya dijo.
          </p>
        )}
        <CheckboxField
          id="bot-images"
          checked={images}
          onChange={setImages}
          label="Analizar imágenes"
          description="Permite leer comprobantes y fotos que envían las clientas."
        />
        <button
          type="button"
          className={`${PRIMARY_BUTTON} w-fit`}
          disabled={!dirty || !valid || actions.busy.has("bot")}
          onClick={() =>
            void actions.updateBot({
              botResponseDelaySeconds: Number(delay),
              humanTakeoverMinutes: Number(takeover),
              maxHistoryMessages: Number(history),
              maxMessageAgeMinutes: Number(maxAge),
              imageAnalysisEnabled: images,
            })
          }
        >
          Guardar comportamiento
        </button>
      </SectionCard>
    </div>
  );
}
