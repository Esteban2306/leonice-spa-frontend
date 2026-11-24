"use client";

import { useState } from "react";
import Link from "@/src/features/admin/components/admin-link";
import { KeyRound, MessageCircle, RotateCcw } from "lucide-react";

import { chatHref } from "@/src/features/admin/orders/lib/orders-page";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { HairPhotoActions } from "@/src/features/admin/hooks/use-hair-photo-actions";
import type {
  HairPhotoStatus,
  VerificationMode,
} from "@/src/features/admin/types/verification.types";
import type { ConduitAiModel } from "@/src/features/admin/types/conduit.types";

import { SECONDARY_BUTTON, SectionCard } from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import { formatDateTime } from "../lib/whatsapp-format";
import { AI_MODEL_ROLE_LABELS } from "../lib/ai-model-labels";

export const HAIR_MODE_OPTIONS: ReadonlyArray<{
  mode: VerificationMode;
  label: string;
  description: string;
}> = [
  {
    mode: "OFF",
    label: "Apagada",
    description: "Las fotos no se revisan.",
  },
  {
    mode: "SHADOW",
    label: "Solo observar",
    description:
      "Se revisa cada foto y ves el resultado aquí, pero no se avisa a nadie.",
  },
  {
    mode: "ACTIVE",
    label: "Activa",
    description:
      "Si es una foto del cabello, se avisa al equipo para que atienda el chat.",
  },
];

const VERDICT_TEXT: Record<string, string> = {
  VALID: "Foto del cabello",
  NEEDS_REVIEW: "Parece del cabello",
  INVALID: "No es del cabello",
  NOT_APPLICABLE: "No es del cabello",
  UNREADABLE: "No se ve bien",
  ERROR: "No se pudo revisar",
};

const MIN_KEY = 20;

export function HairPhotoTab({
  status,
  actions,
}: {
  status: HairPhotoStatus;
  actions: HairPhotoActions;
}) {
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupKey, setSetupKey] = useState("");
  const [keyFor, setKeyFor] = useState<ConduitAiModel | null>(null);
  const [apiKey, setApiKey] = useState("");

  const exists = status.specialist !== null;
  const mode = status.mode ?? "OFF";
  const working = exists && status.modelReady && mode === "ACTIVE";

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Fotos del cabello"
        description="Cuando una clienta envía una foto de su cabello, se avisa al equipo para que una persona atienda ese chat. El asistente agradece la foto y no la toma como comprobante."
        aside={
          <StatusPill tone={working ? "green" : "amber"} size="md">
            {working ? "Activa" : exists ? "Sin avisar" : "Sin activar"}
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
        {!status.imageAnalysisEnabled && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900">
            El análisis de imágenes del asistente está apagado: actívalo en la
            pestaña Comprobantes para que las fotos se revisen.
          </p>
        )}
        {exists ? (
          <p className="font-sans text-sm text-secondary/85">
            Cada imagen se revisa una vez más, en paralelo con la de
            comprobantes. Eso duplica el costo de leer imágenes (centavos al
            mes).
          </p>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="font-sans text-sm text-secondary/85">
              Para activarlo necesitas una clave de Anthropic. Empieza en «Solo
              observar» unos días y revisa abajo qué detecta antes de pasarlo a
              «Activa».
            </p>
            <button
              type="button"
              className={`${SECONDARY_BUTTON} h-10`}
              onClick={() => setSetupOpen(true)}
            >
              <KeyRound className="size-4" />
              Activar con mi clave
            </button>
          </div>
        )}
      </SectionCard>

      {exists && (
        <SectionCard title="Modo" description="Elige qué pasa con cada foto.">
          <div
            role="radiogroup"
            aria-label="Modo de las fotos del cabello"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {HAIR_MODE_OPTIONS.map((option) => {
              const selected = mode === option.mode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={
                    selected ||
                    actions.busy.has("hair:mode") ||
                    (!status.modelReady && option.mode !== "OFF")
                  }
                  onClick={() => void actions.setMode(option.mode)}
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
          {!status.modelReady && (
            <p className="font-sans text-xs text-red-800">
              Sin un modelo disponible no se puede encender. Revisa la clave
              abajo.
            </p>
          )}
        </SectionCard>
      )}

      {exists && (
        <SectionCard
          title="Modelos para leer las fotos"
          description="Se usa primero el de menor prioridad; el de respaldo entra si falla."
        >
          {status.models.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <p className="font-sans text-sm text-secondary/75">
                No hay modelos. Agrégalos con tu clave.
              </p>
              <button
                type="button"
                className={`${SECONDARY_BUTTON} h-9 px-3`}
                onClick={() => setSetupOpen(true)}
              >
                <KeyRound className="size-4" />
                Agregar con mi clave
              </button>
            </div>
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
                        {AI_MODEL_ROLE_LABELS[model.role]} · Prioridad{" "}
                        {model.priority}
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
                        disabled={actions.busy.has(`hair:model:${model.id}`)}
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
      )}

      {exists && (
        <SectionCard
          title="Últimas fotos revisadas"
          description="Las diez más recientes: de quién es, lo que se vio y un acceso a su chat para responderle."
        >
          {status.recent.length === 0 ? (
            <p className="font-sans text-sm text-secondary/75">
              Todavía no se ha revisado ninguna foto.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {status.recent.map((photo) => (
                <li
                  key={photo.id}
                  className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-secondary">
                      {photo.clientName ?? "Clienta sin registrar"}
                      <span className="font-normal text-secondary/70">
                        {" · "}
                        {photo.phone ?? "Número oculto por WhatsApp"}
                      </span>
                    </p>
                    <p className="font-sans text-xs text-secondary/70">
                      {VERDICT_TEXT[photo.verdict] ?? photo.verdict}
                      {photo.createdAt
                        ? ` · ${formatDateTime(photo.createdAt)}`
                        : ""}
                    </p>
                    {photo.description && (
                      <p className="mt-1 font-sans text-xs text-secondary/80">
                        {photo.description}
                      </p>
                    )}
                  </div>
                  {photo.mode === "SHADOW" && (
                    <StatusPill tone="amber">Solo observada</StatusPill>
                  )}
                  {chatHref(photo.phone ?? null, photo.conversationId) && (
                    <Link
                      href={chatHref(
                        photo.phone ?? null,
                        photo.conversationId,
                      )!}
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-4 font-sans text-sm font-semibold text-primary transition-colors hover:bg-secondary/90"
                    >
                      <MessageCircle className="size-4" aria-hidden />
                      Contestar
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      )}

      <ActionDialog
        open={setupOpen}
        onOpenChange={(open) => {
          setSetupOpen(open);
          if (!open) setSetupKey("");
        }}
        title="Activar las fotos del cabello"
        description="Se crea el especialista con dos modelos de Anthropic (Haiku y, de respaldo, Sonnet) y queda en «Solo observar». La clave se guarda cifrada y no se vuelve a mostrar."
        submitLabel="Activar"
        submittingLabel="Activando…"
        canSubmit={setupKey.trim().length >= MIN_KEY}
        onSubmit={() =>
          actions.setup(setupKey.trim(), exists ? mode : "SHADOW")
        }
      >
        <Field label="Clave de API de Anthropic" htmlFor="h-setup-key">
          <input
            id="h-setup-key"
            type="password"
            autoComplete="off"
            value={setupKey}
            onChange={(e) => setSetupKey(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </ActionDialog>

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
        canSubmit={apiKey.trim().length >= MIN_KEY}
        onSubmit={() =>
          keyFor
            ? actions.rotateKey(keyFor.id, apiKey.trim())
            : Promise.resolve(false)
        }
      >
        <Field label="Clave de API" htmlFor="h-key">
          <input
            id="h-key"
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
