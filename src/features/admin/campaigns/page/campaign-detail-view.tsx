import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import type {
  Campaign,
  CampaignRecipientStatus,
  PaginatedCampaignRecipients,
} from "@/src/features/admin/types/campaigns.types";

import { ClientTagChips } from "../../clients/components/client-tag-chips";
import { CampaignProgress } from "../components/campaign-progress";
import { CampaignStatusChip } from "../components/campaign-status-chip";
import {
  RECIPIENT_STATUS_LABELS,
  formatDateTime,
  paceLabel,
} from "../lib/campaign-format";

export type RecipientFilter = CampaignRecipientStatus | "ALL";

interface CampaignDetailViewProps {
  campaign: Campaign;
  recipients: PaginatedCampaignRecipients | undefined;
  recipientsLoading: boolean;
  filter: RecipientFilter;
  busy: boolean;
  onFilterChange: (filter: RecipientFilter) => void;
  onPageChange: (page: number) => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

const FILTERS: ReadonlyArray<{ value: RecipientFilter; label: string }> = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "SENT", label: "Enviadas" },
  { value: "FAILED", label: "Fallaron" },
  { value: "SKIPPED", label: "Omitidas" },
];

const ACTION =
  "h-10 cursor-pointer rounded-full border border-primary/30 px-5 font-sans text-sm text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[1.25rem] border border-tertiary/30 bg-[#FCF6EB] px-4 py-3">
      <p className="font-sans text-3xl font-bold tabular-nums text-secondary">
        {value}
      </p>
      <p className="font-sans text-xs text-secondary/75">{label}</p>
    </div>
  );
}

export function CampaignDetailView(props: CampaignDetailViewProps) {
  const { campaign } = props;
  const open = campaign.status === "RUNNING" || campaign.status === "PAUSED";
  const audienceTags = [
    ...(campaign.audience.tags ?? []).map((key) => ({ key, detail: "" })),
  ];

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <Link
          href="/admin/campaigns"
          className="inline-flex w-fit items-center gap-2 font-sans text-sm text-secondary/75 hover:text-secondary"
        >
          <ArrowLeft className="size-4" />
          Campañas
        </Link>

        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-heading text-4xl sm:text-5xl">
                {campaign.name}
              </h1>
              <p className="mt-2 font-sans text-sm text-primary/70">
                {campaign.templateName} · ritmo{" "}
                {paceLabel(campaign.pace).toLowerCase()} · creada{" "}
                {formatDateTime(campaign.createdAt)}
              </p>
            </div>
            <CampaignStatusChip status={campaign.status} />
          </div>

          <div className="rounded-2xl bg-primary/10 p-4">
            <CampaignProgress campaign={campaign} large onDark />
          </div>

          {campaign.status === "PAUSED" && campaign.pausedReason && (
            <p
              role="status"
              className="rounded-xl bg-amber-100 px-4 py-3 font-sans text-sm text-amber-900"
            >
              {campaign.pausedReason}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-sans text-sm text-primary/75">
              {campaign.status === "RUNNING" && campaign.nextSendAt
                ? `Próximo envío: ${formatDateTime(campaign.nextSendAt)} · termina aprox. ${formatDateTime(campaign.estimatedEndAt)}`
                : campaign.finishedAt
                  ? `Finalizó: ${formatDateTime(campaign.finishedAt)}`
                  : ""}
            </p>
            {open && (
              <div className="flex flex-wrap gap-2">
                {campaign.status === "RUNNING" ? (
                  <button
                    type="button"
                    disabled={props.busy}
                    onClick={props.onPause}
                    className={ACTION}
                  >
                    Pausar
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={props.busy}
                    onClick={props.onResume}
                    className={ACTION}
                  >
                    Reanudar
                  </button>
                )}
                <button
                  type="button"
                  disabled={props.busy}
                  onClick={props.onCancel}
                  className={ACTION}
                >
                  Cancelar campaña
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat value={campaign.sent} label="Enviados" />
          <Stat value={campaign.pending} label="Pendientes" />
          <Stat value={campaign.failed} label="Fallaron" />
          <Stat value={campaign.skipped} label="Omitidas" />
        </div>

        {audienceTags.length > 0 && (
          <section className="flex flex-col gap-2 rounded-[1.5rem] bg-[#F7F1E3] p-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-secondary/70">
              Audiencia
            </p>
            <ClientTagChips tags={audienceTags} />
          </section>
        )}

        <section className="flex flex-col gap-4 rounded-[2rem] bg-[#F7F1E3] p-5 sm:p-6">
          <div
            role="tablist"
            aria-label="Estado del envío"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={props.filter === option.value}
                onClick={() => props.onFilterChange(option.value)}
                className={`h-9 cursor-pointer rounded-full border px-4 font-sans text-sm transition-colors ${
                  props.filter === option.value
                    ? "border-secondary bg-secondary text-primary"
                    : "border-tertiary/40 bg-white text-secondary hover:bg-quaternary/25"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ul
            aria-busy={props.recipientsLoading}
            className="flex flex-col divide-y divide-tertiary/20"
          >
            {props.recipients?.data.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/clients/${row.clientId}`}
                    className="font-sans text-sm text-secondary underline-offset-4 hover:underline"
                  >
                    {row.name}
                  </Link>
                  <p className="font-sans text-xs text-secondary/70">
                    {row.phone}
                  </p>
                </div>
                <div className="text-right font-sans text-xs text-secondary/75">
                  <p className="font-semibold text-secondary">
                    {RECIPIENT_STATUS_LABELS[row.status]}
                  </p>
                  <p>
                    {row.status === "SENT"
                      ? formatDateTime(row.sentAt)
                      : row.status === "PENDING"
                        ? `Sale ${formatDateTime(row.scheduledAt)}`
                        : (row.errorMessage ?? "")}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {props.recipients && props.recipients.data.length === 0 && (
            <p className="py-6 text-center font-sans text-sm text-secondary/70">
              No hay clientas en este estado.
            </p>
          )}

          {props.recipients && props.recipients.pagination.totalPages > 1 && (
            <footer className="flex items-center justify-end gap-3 border-t border-tertiary/25 pt-4">
              <span className="font-sans text-sm text-secondary/70">
                Página {props.recipients.pagination.page} de{" "}
                {props.recipients.pagination.totalPages}
              </span>
              <button
                type="button"
                aria-label="Página anterior"
                disabled={props.recipients.pagination.page <= 1}
                onClick={() =>
                  props.onPageChange(props.recipients!.pagination.page - 1)
                }
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-secondary/15 bg-white text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={
                  props.recipients.pagination.page >=
                  props.recipients.pagination.totalPages
                }
                onClick={() =>
                  props.onPageChange(props.recipients!.pagination.page + 1)
                }
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-secondary/15 bg-white text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}
