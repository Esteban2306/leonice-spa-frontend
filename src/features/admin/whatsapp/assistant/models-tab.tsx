"use client";

import { useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type {
  ConduitAiModel,
  CreateAiModelRequest,
} from "@/src/features/admin/types/conduit.types";

import { SECONDARY_BUTTON, SectionCard } from "../components/section-card";
import { StatusPill } from "../components/status-pill";

const PROVIDERS = [
  "ANTHROPIC",
  "OPENAI",
  "GEMINI",
  "OPENROUTER",
  "DEEPSEEK",
  "GROQ",
  "MISTRAL",
  "CUSTOM",
] as const;
const ROLE_LABELS: Record<ConduitAiModel["role"], string> = {
  CONVERSATION: "Conversación",
  IMAGE_ANALYSIS: "Imágenes",
  FALLBACK: "Respaldo",
};
const EMPTY: CreateAiModelRequest = {
  provider: "ANTHROPIC",
  model: "",
  apiKey: "",
  role: "CONVERSATION",
  tier: "PAID",
  priority: 1,
};

export function ModelsTab({
  models,
  actions,
}: {
  models: readonly ConduitAiModel[];
  actions: ConduitActions;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<CreateAiModelRequest>(EMPTY);
  const [removing, setRemoving] = useState<ConduitAiModel | null>(null);
  const activeConversation = models.some(
    (m) => m.role === "CONVERSATION" && m.isActive,
  );
  const canAdd =
    draft.model.trim().length > 1 &&
    draft.apiKey.trim().length > 8 &&
    (draft.provider !== "CUSTOM" || Boolean(draft.baseUrl));

  return (
    <SectionCard
      title="Modelos de IA"
      description="El asistente usa el modelo activo de mayor prioridad y cae al siguiente si falla."
      aside={
        <button
          type="button"
          className={`${SECONDARY_BUTTON} h-10`}
          onClick={() => setAdding(true)}
        >
          <Plus className="size-4" />
          Agregar modelo
        </button>
      }
    >
      {!activeConversation && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-900"
        >
          El asistente no puede responder: agrega un modelo de IA de
          conversación. Mientras tanto, las clientas reciben un aviso de que una
          persona les responderá.
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {[...models]
          .sort((a, b) => a.priority - b.priority)
          .map((model) => (
            <li
              key={model.id}
              className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-semibold text-secondary">
                  {model.model}{" "}
                  <span className="font-normal text-secondary/70">
                    · {model.provider}
                  </span>
                </p>
                <p className="font-sans text-xs text-secondary/70 tabular-nums">
                  {ROLE_LABELS[model.role]} · Prioridad {model.priority} ·{" "}
                  {model.tier === "FREE" ? "Gratis" : "Pago"}
                  {model.dailyTokenLimit
                    ? ` · ${model.tokensUsedToday.toLocaleString("es-CO")} / ${model.dailyTokenLimit.toLocaleString("es-CO")} tokens hoy`
                    : ""}
                </p>
              </div>
              <StatusPill tone={model.isActive ? "green" : "red"}>
                {model.isActive ? "Disponible" : "No disponible"}
              </StatusPill>
              {!model.isActive && (
                <button
                  type="button"
                  className={`${SECONDARY_BUTTON} h-9 px-3`}
                  disabled={actions.busy.has(`model:${model.id}`)}
                  onClick={() => void actions.resetModel(model.id)}
                >
                  <RotateCcw className="size-4" />
                  Reactivar
                </button>
              )}
              <button
                type="button"
                aria-label={`Quitar ${model.model}`}
                className="grid size-9 cursor-pointer place-items-center rounded-full text-red-700 hover:bg-red-50"
                onClick={() => setRemoving(model)}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
      </ul>

      <ActionDialog
        open={adding}
        onOpenChange={(open) => {
          setAdding(open);
          if (!open) setDraft(EMPTY);
        }}
        title="Agregar modelo de IA"
        description="La clave se guarda cifrada en el servicio de WhatsApp y no se vuelve a mostrar."
        submitLabel="Agregar"
        submittingLabel="Agregando…"
        canSubmit={canAdd}
        onSubmit={() =>
          actions.addModel({
            ...draft,
            model: draft.model.trim(),
            apiKey: draft.apiKey.trim(),
          })
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Proveedor" htmlFor="m-provider">
            <select
              id="m-provider"
              value={draft.provider}
              onChange={(e) => setDraft({ ...draft, provider: e.target.value })}
              className={INPUT_CLASS}
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Uso" htmlFor="m-role">
            <select
              id="m-role"
              value={draft.role}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  role: e.target.value as CreateAiModelRequest["role"],
                })
              }
              className={INPUT_CLASS}
            >
              <option value="CONVERSATION">Conversación</option>
              <option value="IMAGE_ANALYSIS">Imágenes</option>
              <option value="FALLBACK">Respaldo</option>
            </select>
          </Field>
        </div>
        <Field
          label="Modelo"
          htmlFor="m-model"
          hint="Nombre exacto, por ejemplo claude-haiku-5-5."
        >
          <input
            id="m-model"
            value={draft.model}
            onChange={(e) => setDraft({ ...draft, model: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Clave de API" htmlFor="m-key">
          <input
            id="m-key"
            type="password"
            autoComplete="off"
            value={draft.apiKey}
            onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prioridad" htmlFor="m-priority" hint="1 = primero.">
            <input
              id="m-priority"
              type="number"
              min={1}
              value={draft.priority}
              onChange={(e) =>
                setDraft({ ...draft, priority: Number(e.target.value) || 1 })
              }
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Plan" htmlFor="m-tier">
            <select
              id="m-tier"
              value={draft.tier}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  tier: e.target.value as CreateAiModelRequest["tier"],
                })
              }
              className={INPUT_CLASS}
            >
              <option value="PAID">Pago</option>
              <option value="FREE">Gratis</option>
            </select>
          </Field>
        </div>
        {draft.provider === "CUSTOM" && (
          <Field label="URL base" htmlFor="m-base">
            <input
              id="m-base"
              value={draft.baseUrl ?? ""}
              onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
        )}
      </ActionDialog>

      <ActionDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        tone="danger"
        title={`¿Quitar ${removing?.model ?? "el modelo"}?`}
        description="Si es el único modelo de conversación, el asistente dejará de responder."
        submitLabel="Quitar modelo"
        submittingLabel="Quitando…"
        onSubmit={() =>
          removing ? actions.removeModel(removing.id) : Promise.resolve(false)
        }
      />
    </SectionCard>
  );
}
