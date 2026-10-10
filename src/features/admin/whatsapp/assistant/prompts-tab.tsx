"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { TextArea } from "@/src/features/admin/components/reservation-actions/form-controls";
import { useConduitPrompt } from "@/src/features/admin/hooks/use-conduit";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type { PromptType } from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import {
  PRIMARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "../components/section-card";

const TYPES: ReadonlyArray<{ value: PromptType; label: string }> = [
  { value: "CONVERSATION", label: "Conversación" },
  { value: "APPOINTMENT", label: "Citas" },
  { value: "SALES", label: "Ventas" },
  { value: "SUPPORT", label: "Soporte" },
  { value: "SUMMARY", label: "Resúmenes" },
  { value: "IMAGE_ANALYSIS", label: "Imágenes" },
];

function PromptEditor({
  type,
  actions,
}: {
  type: PromptType;
  actions: ConduitActions;
}) {
  const prompt = useConduitPrompt(type);
  const [draft, setDraft] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const original = prompt.data?.content ?? "";
  const value = draft ?? original;

  if (prompt.isLoading) return <SkeletonRows rows={1} height="h-64" />;
  if (prompt.isError && (prompt.error as { status?: number })?.status !== 404) {
    return (
      <ErrorPanel error={prompt.error} onRetry={() => void prompt.refetch()} />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={`prompt-${type}`} className="sr-only">
        Instrucciones
      </label>
      <TextArea
        id={`prompt-${type}`}
        value={value}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Sin instrucciones propias: el asistente usa las generadas desde Personalidad."
        className="min-h-80 font-mono text-xs leading-relaxed"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-xs text-secondary/70 tabular-nums">
          {value.length} caracteres
        </p>
        <button
          type="button"
          className={PRIMARY_BUTTON}
          disabled={
            draft === null ||
            draft === original ||
            actions.busy.has(`prompt:${type}`)
          }
          onClick={() => setConfirm(true)}
        >
          Guardar instrucciones
        </button>
      </div>
      <ActionDialog
        open={confirm}
        onOpenChange={setConfirm}
        tone="danger"
        title="¿Guardar instrucciones avanzadas?"
        description="Cambia cómo responde el asistente a todas las clientas desde el próximo mensaje."
        submitLabel="Guardar"
        submittingLabel="Guardando…"
        onSubmit={async () => {
          const ok = await actions.updatePrompt(type, value);
          if (ok) setDraft(null);
          return ok;
        }}
      />
    </div>
  );
}

export function PromptsTab({ actions }: { actions: ConduitActions }) {
  const [type, setType] = useState<PromptType>("CONVERSATION");
  return (
    <SectionCard
      title="Instrucciones avanzadas"
      description="Cambios aquí afectan cómo responde el asistente a todas las clientas. Las reglas de seguridad las agrega el sistema y no se pueden quitar."
    >
      <div
        role="tablist"
        aria-label="Tipo de instrucciones"
        className="flex flex-wrap gap-1.5"
      >
        {TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={type === option.value}
            onClick={() => setType(option.value)}
            className={`h-9 cursor-pointer rounded-full border px-3 font-sans text-sm transition-colors ${type === option.value ? "border-secondary bg-secondary text-primary" : "border-secondary/15 bg-white text-secondary/75 hover:bg-quaternary/20"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <PromptEditor key={type} type={type} actions={actions} />
    </SectionCard>
  );
}
