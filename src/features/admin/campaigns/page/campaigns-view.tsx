import Link from "next/link";
import { Clock, Plus } from "lucide-react";

import type { Campaign } from "@/src/features/admin/types/campaigns.types";

import { CampaignProgress } from "../components/campaign-progress";
import { CampaignStatusChip } from "../components/campaign-status-chip";
import { NumberStatus } from "../components/number-status";
import { formatDateTime, paceLabel } from "../lib/campaign-format";

interface CampaignsViewProps {
  campaigns: readonly Campaign[];
  isLoading: boolean;
  isError: boolean;
  busyIds: ReadonlySet<string>;
  onRetry: () => void;
  onOpenSettings: () => void;
  onPause: (campaign: Campaign) => void;
  onResume: (campaign: Campaign) => void;
  onCancel: (campaign: Campaign) => void;
}

const ACTION =
  "h-9 cursor-pointer rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function CampaignsView(props: CampaignsViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">Campañas</h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
              Envía una promoción u otro mensaje solo a las clientas que eliges.
              Los mensajes salen poco a poco, en horario y a ritmo humano, para
              cuidar tu número de WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={props.onOpenSettings}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-primary/25 px-5 font-sans text-sm text-primary transition-colors hover:bg-primary/10"
            >
              <Clock className="size-4" strokeWidth={1.8} />
              Horario de envío
            </button>
            <Link
              href="/admin/campaigns/new"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            >
              <Plus className="size-4" strokeWidth={2} />
              Nueva campaña
            </Link>
          </div>
        </header>

        <NumberStatus />

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudieron cargar las campañas.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {props.isLoading && props.campaigns.length === 0 && (
          <div
            role="status"
            aria-label="Cargando campañas"
            className="flex flex-col gap-3"
          >
            {[0, 1].map((key) => (
              <div
                key={key}
                className="h-36 animate-pulse rounded-[1.5rem] bg-secondary/8"
              />
            ))}
          </div>
        )}

        {!props.isLoading && !props.isError && props.campaigns.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-tertiary/50 px-6 py-12 text-center">
            <p className="font-heading text-2xl text-secondary">
              Aún no hay campañas
            </p>
            <p className="max-w-md font-sans text-sm text-secondary/75">
              Crea la primera: elige el mensaje, a quiénes va dirigido y el
              ritmo de envío. Antes de lanzar verás cuántas clientas lo
              recibirán y cuánto tardará.
            </p>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {props.campaigns.map((campaign) => {
            const busy = props.busyIds.has(campaign.id);
            return (
              <li
                key={campaign.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-tertiary/25 bg-[#FCF6EB] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className="block truncate font-sans text-lg text-secondary underline-offset-4 hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <p className="mt-0.5 font-sans text-xs text-secondary/70">
                      {campaign.templateName} · ritmo{" "}
                      {paceLabel(campaign.pace).toLowerCase()} · creada{" "}
                      {formatDateTime(campaign.createdAt)}
                    </p>
                  </div>
                  <CampaignStatusChip status={campaign.status} />
                </div>

                <CampaignProgress campaign={campaign} />

                {campaign.status === "PAUSED" && campaign.pausedReason && (
                  <p
                    role="status"
                    className="rounded-xl bg-amber-50 px-3 py-2 font-sans text-xs text-amber-900"
                  >
                    {campaign.pausedReason}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-sans text-xs text-secondary/75">
                    {campaign.status === "RUNNING" && campaign.nextSendAt
                      ? `Próximo envío: ${formatDateTime(campaign.nextSendAt)} · termina aprox. ${formatDateTime(campaign.estimatedEndAt)}`
                      : campaign.finishedAt
                        ? `Finalizó: ${formatDateTime(campaign.finishedAt)}`
                        : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.status === "RUNNING" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => props.onPause(campaign)}
                        className={ACTION}
                      >
                        Pausar
                      </button>
                    )}
                    {campaign.status === "PAUSED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => props.onResume(campaign)}
                        className={ACTION}
                      >
                        Reanudar
                      </button>
                    )}
                    {(campaign.status === "RUNNING" ||
                      campaign.status === "PAUSED") && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => props.onCancel(campaign)}
                        className={`${ACTION} hover:bg-red-50 hover:text-red-700`}
                      >
                        Cancelar
                      </button>
                    )}
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className={`${ACTION} inline-flex items-center`}
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
