"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  FileWarning,
  Inbox,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import {
  useConduitOverview,
  useDeadLetters,
} from "@/src/features/admin/hooks/use-conduit";

import { ErrorPanel } from "../components/error-panel";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import { useInboxCounts } from "../lib/use-inbox-counts";
import { connectionCopy, riskCopy } from "../lib/whatsapp-format";

function QuickLink({
  href,
  label,
  value,
  tone,
}: {
  href: string;
  label: string;
  value: number | string;
  tone?: "alert";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-[1.25rem] border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
        tone === "alert"
          ? "border-red-200 bg-red-50/70 hover:bg-red-50"
          : "border-tertiary/30 bg-white/70 hover:bg-quaternary/20",
      )}
    >
      <span className="font-sans text-sm text-secondary">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "font-sans text-2xl font-light tabular-nums",
            tone === "alert" ? "text-red-800" : "text-secondary",
          )}
        >
          {value}
        </span>
        <ArrowUpRight className="size-4 text-secondary/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function OverviewSection() {
  const overview = useConduitOverview();
  const counts = useInboxCounts();
  const deadLetters = useDeadLetters(
    { requeued: false, page: 1, limit: 1 },
    { live: true },
  );
  const actions = useConduitActions();

  if (overview.isLoading) return <SkeletonRows rows={4} height="h-40" />;
  if (overview.isError || !overview.data)
    return (
      <ErrorPanel
        error={overview.error}
        onRetry={() => void overview.refetch()}
      />
    );

  const { reachable, connection, connectionHealth, bot, templates, health } =
    overview.data;
  const copy = connectionCopy(
    connection?.status,
    reachable,
    connection?.phoneNumber,
  );
  const risk = connectionHealth?.rateLimiter.riskLevel ?? 1;
  const riskInfo = riskCopy(risk);
  const missingTemplates = templates.filter((t) => !t.configured);
  const botOn = bot?.status === "ACTIVE";
  const degradedServices = Object.entries(health?.service ?? {})
    .filter(
      ([name, value]) =>
        name !== "whatsapp" &&
        value &&
        (value as { status: string }).status !== "ok",
    )
    .map(([name]) =>
      name === "redis"
        ? "cola de mensajes"
        : name === "database"
          ? "base de datos"
          : name,
    );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <SectionCard
        className="xl:col-span-2"
        title="WhatsApp del spa"
        icon={<Smartphone className="size-5" strokeWidth={1.7} />}
        aside={
          <StatusPill tone={copy.tone} size="md">
            {copy.label}
          </StatusPill>
        }
      >
        <p className="font-sans text-base text-secondary">{copy.description}</p>
        {reachable && degradedServices.length > 0 && (
          <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900">
            El servicio de WhatsApp reporta fallas internas (
            {degradedServices.join(", ")}). Algunos envíos pueden demorarse.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {copy.action === "connect" && (
            <button
              type="button"
              className={PRIMARY_BUTTON}
              onClick={() => void actions.connect()}
            >
              Conectar
            </button>
          )}
          {(copy.action === "relink" || copy.action === "qr") && (
            <Link
              href="/admin/whatsapp/connection?vincular=1"
              className={PRIMARY_BUTTON}
            >
              Vincular con QR
            </Link>
          )}
          {copy.action !== "support" && (
            <Link
              href="/admin/whatsapp/connection"
              className={SECONDARY_BUTTON}
            >
              Ver conexión
            </Link>
          )}
        </div>
        {connection?.connectedAt && copy.tone === "green" && (
          <p className="font-sans text-xs text-secondary/70">
            Activo desde{" "}
            {new Date(connection.connectedAt).toLocaleString("es-CO", {
              timeZone: "America/Bogota",
            })}
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Asistente"
        icon={<Bot className="size-5" strokeWidth={1.7} />}
        aside={
          bot && (
            <label className="flex items-center gap-2 font-sans text-sm text-secondary">
              {botOn ? "Encendido" : "Apagado"}
              <CatalogSwitch
                checked={botOn}
                disabled={actions.busy.has("bot")}
                label={botOn ? "Apagar el asistente" : "Encender el asistente"}
                onChange={(next) => void actions.toggleBot(next)}
              />
            </label>
          )
        }
      >
        {bot ? (
          botOn ? (
            <p className="font-sans text-sm text-secondary/80">
              Responde a las clientas a cualquier hora. Tras una respuesta del
              equipo se calla {bot.humanTakeoverMinutes} min en ese chat.
            </p>
          ) : (
            <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900">
              Las clientas no reciben respuestas automáticas; los recordatorios
              sí se envían.
            </p>
          )
        ) : (
          <p className="font-sans text-sm text-secondary/70">
            No se pudo leer el asistente.
          </p>
        )}
        <Link href="/admin/whatsapp/assistant" className={SECONDARY_BUTTON}>
          Configurar asistente
        </Link>
      </SectionCard>

      <SectionCard
        title="Riesgo anti-bloqueo"
        icon={<ShieldCheck className="size-5" strokeWidth={1.7} />}
        aside={<StatusPill tone={riskInfo.tone}>{riskInfo.label}</StatusPill>}
      >
        <div>
          <div
            className="flex gap-1"
            role="meter"
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={risk}
            aria-label="Nivel de riesgo"
          >
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-2.5 flex-1 rounded-full",
                  step <= risk
                    ? risk >= 4
                      ? "bg-red-600"
                      : risk >= 3
                        ? "bg-amber-500"
                        : "bg-green-600"
                    : "bg-secondary/10",
                )}
              />
            ))}
          </div>
          <p className="mt-3 font-sans text-sm text-secondary/80">
            {riskInfo.description}
          </p>
        </div>
        {connectionHealth && (
          <p className="font-sans text-sm text-secondary/75 tabular-nums">
            {connectionHealth.rateLimiter.lanes.conversation} respuestas en
            espera · {connectionHealth.rateLimiter.lanes.campaign} avisos en
            espera
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Plantillas"
        icon={<FileWarning className="size-5" strokeWidth={1.7} />}
        aside={
          <StatusPill tone={missingTemplates.length ? "red" : "green"}>
            {missingTemplates.length
              ? `Faltan ${missingTemplates.length}`
              : "Completas"}
          </StatusPill>
        }
      >
        {missingTemplates.length > 0 ? (
          <p className="font-sans text-sm text-secondary/80">
            Faltan {missingTemplates.length} de {templates.length} plantillas:
            algunos avisos no se enviarán.
          </p>
        ) : (
          <p className="font-sans text-sm text-secondary/80">
            Todas las plantillas que usa el sistema están configuradas.
          </p>
        )}
        <Link href="/admin/whatsapp/templates" className={SECONDARY_BUTTON}>
          Revisar plantillas
        </Link>
      </SectionCard>

      <SectionCard
        title="Para atender"
        icon={<Inbox className="size-5" strokeWidth={1.7} />}
      >
        <div className="flex flex-col gap-2">
          <QuickLink
            href="/admin/whatsapp/inbox"
            label="Esperando respuesta"
            value={counts.isError ? "—" : counts.awaiting}
            tone={counts.awaiting ? "alert" : undefined}
          />
          <QuickLink
            href="/admin/whatsapp/inbox"
            label="Asistente en pausa"
            value={counts.isError ? "—" : counts.paused}
          />
          <QuickLink
            href="/admin/whatsapp/deliveries?vista=fallidos"
            label="Mensajes fallidos"
            value={deadLetters.data?.meta.total ?? "—"}
            tone={deadLetters.data?.meta.total ? "alert" : undefined}
          />
        </div>
      </SectionCard>
    </div>
  );
}
