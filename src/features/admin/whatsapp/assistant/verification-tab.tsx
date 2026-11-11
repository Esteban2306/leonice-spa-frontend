"use client";

import { useState } from "react";
import { Check, CircleHelp, KeyRound, RotateCcw, X } from "lucide-react";

import { formatCop } from "@/src/lib/money/cop";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { VerificationActions } from "@/src/features/admin/hooks/use-verification-actions";
import type {
  ChecklistKey,
  VerificationMode,
  VerificationStatus,
} from "@/src/features/admin/types/verification.types";
import type { ConduitAiModel } from "@/src/features/admin/types/conduit.types";

import { SECONDARY_BUTTON, SectionCard } from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import { formatDateTime } from "../lib/whatsapp-format";
import {
  MODE_OPTIONS,
  VERDICT_LABELS,
  checklistView,
  reasonsText,
} from "../lib/verification-labels";

const ROLE_LABELS: Record<ConduitAiModel["role"], string> = {
  CONVERSATION: "Conversación",
  IMAGE_ANALYSIS: "Imágenes",
  FALLBACK: "Respaldo",
};

const CHECK_ICONS = {
  ok: <Check className="size-4 text-green-700" aria-hidden />,
  fail: <X className="size-4 text-red-700" aria-hidden />,
  unknown: <CircleHelp className="size-4 text-amber-700" aria-hidden />,
} as const;

const CHECK_SR = {
  ok: "Correcto",
  fail: "Falta",
  unknown: "Sin comprobar",
} as const;

export function VerificationTab({
  status,
  actions,
}: {
  status: VerificationStatus;
  actions: VerificationActions;
}) {
  const [keyFor, setKeyFor] = useState<ConduitAiModel | null>(null);
  const [apiKey, setApiKey] = useState("");

  const currentMode = status.binding?.mode ?? "OFF";
  const failing = new Set<ChecklistKey>(
    status.checklist.filter((i) => i.ok === false).map((i) => i.key),
  );

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Verificación de comprobantes"
        description="Cada comprobante de anticipo se revisa antes de que el asistente responda: monto mínimo, cuenta del spa y que sea reciente."
        aside={
          <StatusPill tone={status.ready ? "green" : "amber"} size="md">
            {status.ready ? "Lista" : "Falta configurar"}
          </StatusPill>
        }
      >
        {status.partial && (
          <p
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900"
          >
            Algunos datos no se pudieron cargar. Lo que ves puede estar
            incompleto.
          </p>
        )}
        <ul className="flex flex-col gap-2">
          {status.checklist.map((item) => {
            const view = checklistView(item);
            return (
              <li
                key={item.key}
                className="flex items-start gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
              >
                <span className="mt-0.5">{CHECK_ICONS[view.state]}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-secondary">
                    {view.title}
                    <span className="sr-only"> — {CHECK_SR[view.state]}</span>
                  </p>
                  {view.hint && (
                    <p className="font-sans text-xs text-secondary/75">
                      {view.hint}
                    </p>
                  )}
                </div>
                {item.key === "images" && item.ok === false && (
                  <button
                    type="button"
                    className={`${SECONDARY_BUTTON} h-9 px-3`}
                    disabled={actions.busy.has("verification:images")}
                    onClick={() => void actions.setImageAnalysis(true)}
                  >
                    Activar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard
        title="Modo"
        description="Elige qué hace el asistente con el resultado."
      >
        <div
          role="radiogroup"
          aria-label="Modo de verificación"
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {MODE_OPTIONS.map((option) => {
            const selected = currentMode === option.mode;
            return (
              <button
                key={option.mode}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={
                  selected ||
                  actions.busy.has("verification:mode") ||
                  status.specialist === null
                }
                onClick={() =>
                  void actions.setMode(option.mode as VerificationMode)
                }
                className={
                  selected
                    ? "flex cursor-default flex-col gap-1 rounded-[1.25rem] border border-secondary bg-secondary p-4 text-left text-primary"
                    : "flex cursor-pointer flex-col gap-1 rounded-[1.25rem] border border-secondary/15 bg-white p-4 text-left text-secondary hover:bg-quaternary/20 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                <span className="font-sans text-sm font-semibold">
                  {option.label}
                </span>
                <span className="font-sans text-xs opacity-80">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
        {status.specialist === null && (
          <p className="font-sans text-xs text-secondary/75">
            Todavía no existe el especialista de comprobantes. Se crea una vez
            desde el servicio de WhatsApp.
          </p>
        )}
        {failing.has("model") && currentMode !== "OFF" && (
          <p className="font-sans text-xs text-red-800">
            Sin un modelo disponible no se puede dejar activa la verificación.
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Qué se revisa"
        description="Los datos salen de la pestaña Negocio, así que no hay que tocar nada más aquí."
      >
        <ul className="list-disc space-y-1 pl-5 font-sans text-sm text-secondary/85">
          <li>El monto es igual o mayor al anticipo configurado en Negocio.</li>
          <li>
            La cuenta del comprobante aparece en las instrucciones de pago de
            Negocio.
          </li>
          <li>La fecha del comprobante es de los últimos 2 días.</li>
        </ul>
      </SectionCard>

      <SectionCard
        title="Modelos para leer imágenes"
        description="Se usa primero el de menor prioridad; el de respaldo entra si falla."
      >
        {status.models.length === 0 ? (
          <p className="font-sans text-sm text-secondary/75">
            No hay modelos. Se agregan al crear el especialista.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {[...status.models]
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
                      {ROLE_LABELS[model.role]} · Prioridad {model.priority}
                      {model.apiKeyLast4
                        ? ` · Clave ••••${model.apiKeyLast4}`
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
                      disabled={actions.busy.has(
                        `verification:model:${model.id}`,
                      )}
                      onClick={() => void actions.reactivateModel(model.id)}
                    >
                      <RotateCcw className="size-4" />
                      Reactivar
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${SECONDARY_BUTTON} h-9 px-3`}
                    onClick={() => setKeyFor(model)}
                  >
                    <KeyRound className="size-4" />
                    Cambiar clave
                  </button>
                </li>
              ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Últimos comprobantes"
        description={
          status.pendingReview > 0
            ? `${status.pendingReview} por revisar.`
            : "Los diez más recientes."
        }
      >
        {status.recent.length === 0 ? (
          <p className="font-sans text-sm text-secondary/75">
            Todavía no se ha revisado ningún comprobante.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {status.recent.map((item) => {
              const verdict = VERDICT_LABELS[item.verdict] ?? {
                label: item.verdict,
                tone: "gray" as const,
              };
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-secondary tabular-nums">
                      {item.amount !== null
                        ? formatCop(item.amount)
                        : "Sin monto"}
                      <span className="font-normal text-secondary/70">
                        {item.destinationLast4
                          ? ` · Cuenta ••••${item.destinationLast4}`
                          : ""}
                        {item.date ? ` · Fecha ${item.date}` : ""}
                      </span>
                    </p>
                    <p className="font-sans text-xs text-secondary/70">
                      {formatDateTime(item.createdAt)} ·{" "}
                      {reasonsText(item.reasonCodes)}
                      {item.mode === "SHADOW" ? " · Solo observado" : ""}
                    </p>
                  </div>
                  <StatusPill tone={verdict.tone}>{verdict.label}</StatusPill>
                  {item.pendingReview && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`${SECONDARY_BUTTON} h-9 px-3`}
                        disabled={actions.busy.has(
                          `verification:review:${item.id}`,
                        )}
                        onClick={() => void actions.review(item.id, "APPROVED")}
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        className={`${SECONDARY_BUTTON} h-9 px-3`}
                        disabled={actions.busy.has(
                          `verification:review:${item.id}`,
                        )}
                        onClick={() => void actions.review(item.id, "REJECTED")}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                  {item.reviewDecision && (
                    <span className="font-sans text-xs text-secondary/70">
                      {item.reviewDecision === "APPROVED"
                        ? "Aprobado por el equipo"
                        : "Rechazado por el equipo"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="font-sans text-xs text-secondary/70">
          Aprobar o rechazar deja constancia de la revisión; no cambia el
          resultado ni confirma el pago.
        </p>
      </SectionCard>

      <ActionDialog
        open={keyFor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setKeyFor(null);
            setApiKey("");
          }
        }}
        title={`Cambiar la clave de ${keyFor?.model ?? "el modelo"}`}
        description="La clave se guarda cifrada y no se vuelve a mostrar."
        submitLabel="Guardar clave"
        submittingLabel="Guardando…"
        canSubmit={apiKey.trim().length >= 20}
        onSubmit={() =>
          keyFor
            ? actions.rotateKey(keyFor.id, apiKey.trim())
            : Promise.resolve(false)
        }
      >
        <Field label="Clave de API" htmlFor="v-key">
          <input
            id="v-key"
            type="password"
            autoComplete="off"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </ActionDialog>
    </div>
  );
}
