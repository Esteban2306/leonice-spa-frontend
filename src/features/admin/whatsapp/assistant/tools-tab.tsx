"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";

import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import type { BotTool } from "@/src/features/admin/types/conduit.types";

import { SECONDARY_BUTTON, SectionCard } from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import { reviewTools } from "../lib/whatsapp-format";

function toolPath(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/api\/v1/, "");
  } catch {
    return url;
  }
}

export function ToolsTab({
  tools,
  actions,
}: {
  tools: readonly BotTool[];
  actions: ConduitActions;
}) {
  const [showReview, setShowReview] = useState(false);
  const review = reviewTools(tools);
  const issues = review.filter((r) => r.issues.length > 0);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Herramientas"
        description="Lo que el asistente puede consultar o hacer en el sistema del spa. La edición avanzada se hace en el servicio de WhatsApp."
        aside={
          <button
            type="button"
            className={`${SECONDARY_BUTTON} h-10`}
            aria-expanded={showReview}
            onClick={() => setShowReview(!showReview)}
          >
            <ListChecks className="size-4" />
            Revisar configuración recomendada
          </button>
        }
      >
        {showReview && (
          <div
            className={`rounded-[1.25rem] border p-4 ${issues.length ? "border-amber-300 bg-amber-50" : "border-green-300 bg-green-50"}`}
          >
            <p className="font-sans text-sm font-semibold text-secondary">
              {issues.length
                ? `${issues.length} de ${review.length} herramientas recomendadas necesitan revisión`
                : "Todo coincide con la configuración recomendada."}
            </p>
            {issues.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 font-sans text-sm text-secondary/85">
                {issues.map((item) => (
                  <li key={item.recommended.name}>
                    <span className="font-mono text-xs">
                      {item.recommended.name}
                    </span>
                    : {item.issues.join(" · ")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <ul className="flex flex-col gap-2">
          {tools.map((tool) => (
            <li
              key={tool.id}
              className="flex flex-wrap items-start gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-secondary">{tool.name}</p>
                <p className="mt-0.5 font-sans text-sm text-secondary/75">
                  {tool.description}
                </p>
                <p className="mt-1 font-mono text-[11px] text-secondary/60">
                  {tool.httpMethod} {toolPath(tool.endpointUrl)}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tool.injectPhoneParamName && (
                    <StatusPill tone="gray">
                      Usa el número verificado del chat
                    </StatusPill>
                  )}
                  {tool.pausesBotMinutes ? (
                    <StatusPill tone="amber">Pasa a una persona</StatusPill>
                  ) : null}
                  {tool.requiresImageAttachment && (
                    <StatusPill tone="gray">Necesita una imagen</StatusPill>
                  )}
                </div>
              </div>
              <CatalogSwitch
                checked={tool.isActive}
                disabled={actions.busy.has(`tool:${tool.id}`)}
                label={
                  tool.isActive
                    ? `Desactivar ${tool.name}`
                    : `Activar ${tool.name}`
                }
                onChange={(next) => void actions.setToolActive(tool.id, next)}
              />
            </li>
          ))}
          {tools.length === 0 && (
            <li className="py-6 text-center font-sans text-sm text-secondary/70">
              El asistente no tiene herramientas configuradas.
            </li>
          )}
        </ul>
      </SectionCard>
    </div>
  );
}
