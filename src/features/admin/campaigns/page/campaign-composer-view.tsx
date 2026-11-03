import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type {
  AudienceFilter,
  AudiencePreview,
  BroadcastTemplate,
  CampaignEstimate,
  PaceProfile,
} from "@/src/features/admin/types/campaigns.types";
import type { Promotion } from "@/src/features/admin/types/promotions.types";

import { AudienceBuilder } from "../components/audience-builder";
import { NumberStatus } from "../components/number-status";
import {
  PACE_OPTIONS,
  formatDateTime,
  formatDuration,
} from "../lib/campaign-format";

export interface CampaignComposerViewProps {
  name: string;
  templates: readonly BroadcastTemplate[];
  templateCode: string;
  promotions: readonly Promotion[];
  promotionId: string;
  filter: AudienceFilter;
  pace: PaceProfile;
  startMode: "now" | "later";
  startLocal: string;
  preview: AudiencePreview | undefined;
  isPreviewLoading: boolean;
  isPreviewError: boolean;
  estimate: CampaignEstimate | undefined;
  estimateError: string | null;
  canLaunch: boolean;
  onNameChange: (value: string) => void;
  onTemplateChange: (code: string) => void;
  onPromotionChange: (id: string) => void;
  onFilterChange: (filter: AudienceFilter) => void;
  onPaceChange: (pace: PaceProfile) => void;
  onStartModeChange: (mode: "now" | "later") => void;
  onStartLocalChange: (value: string) => void;
  onLaunch: () => void;
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-[2rem] bg-[#F7F1E3] p-5 sm:p-6">
      <h2 className="flex items-center gap-3 font-heading text-2xl text-secondary">
        <span className="grid size-8 place-items-center rounded-full bg-secondary font-sans text-sm text-primary">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CampaignComposerView(props: CampaignComposerViewProps) {
  const template = props.templates.find(
    (item) => item.code === props.templateCode,
  );

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <Link
          href="/admin/campaigns"
          className="inline-flex w-fit items-center gap-2 font-sans text-sm text-secondary/75 hover:text-secondary"
        >
          <ArrowLeft className="size-4" />
          Campañas
        </Link>

        <header className="rounded-[2rem] bg-secondary p-6 text-primary sm:p-8">
          <h1 className="font-heading text-4xl sm:text-5xl">Nueva campaña</h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
            Elige el mensaje, a quiénes va y el ritmo. Antes de lanzar verás
            cuántas clientas lo recibirán y cuánto tardará.
          </p>
        </header>

        <NumberStatus />

        <Section step={1} title="Mensaje">
          <Field label="Nombre de la campaña" htmlFor="campaign-name">
            <input
              id="campaign-name"
              value={props.name}
              maxLength={80}
              placeholder="Ej. Promoción de noviembre"
              onChange={(event) => props.onNameChange(event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>

          <div
            role="radiogroup"
            aria-label="Mensaje"
            className="grid gap-3 md:grid-cols-3"
          >
            {props.templates.map((item) => {
              const selected = item.code === props.templateCode;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => props.onTemplateChange(item.code)}
                  className={`flex cursor-pointer flex-col gap-2 rounded-[1.25rem] border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                    selected
                      ? "border-secondary bg-white shadow-[0_12px_30px_-22px_rgba(6,33,18,0.6)]"
                      : "border-tertiary/30 bg-white/60 hover:bg-white"
                  }`}
                >
                  <span className="font-sans text-sm font-semibold text-secondary">
                    {item.description}
                  </span>
                  {!item.configured && (
                    <span className="w-fit rounded-full bg-amber-100 px-2.5 py-0.5 font-sans text-[11px] text-amber-900">
                      Falta crearla en Conduit
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {template && (
            <pre className="whitespace-pre-wrap rounded-2xl bg-white p-4 font-sans text-sm leading-relaxed text-secondary/85">
              {template.body}
            </pre>
          )}

          {template?.needsPromotion && (
            <Field label="Promoción que anuncia" htmlFor="campaign-promotion">
              <select
                id="campaign-promotion"
                value={props.promotionId}
                onChange={(event) =>
                  props.onPromotionChange(event.target.value)
                }
                className={INPUT_CLASS}
              >
                <option value="">
                  Elige una promoción vigente o programada
                </option>
                {props.promotions.map((promotion) => (
                  <option key={promotion.id} value={promotion.id}>
                    {promotion.name} · {Number(promotion.discountPercentage)}%
                  </option>
                ))}
              </select>
              {props.promotions.length === 0 && (
                <p className="mt-1 font-sans text-xs text-secondary/70">
                  Aún no hay promociones activas.{" "}
                  <Link href="/admin/promotions" className="underline">
                    Crea una
                  </Link>
                  .
                </p>
              )}
            </Field>
          )}
        </Section>

        <Section step={2} title="Audiencia">
          <AudienceBuilder
            value={props.filter}
            onChange={props.onFilterChange}
            preview={props.preview}
            isLoading={props.isPreviewLoading}
            isError={props.isPreviewError}
            marketing
          />
        </Section>

        <Section step={3} title="Ritmo y horario">
          <div
            role="radiogroup"
            aria-label="Ritmo de envío"
            className="grid gap-3 md:grid-cols-3"
          >
            {PACE_OPTIONS.map((option) => {
              const selected = option.value === props.pace;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => props.onPaceChange(option.value)}
                  className={`flex cursor-pointer flex-col gap-1.5 rounded-[1.25rem] border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                    selected
                      ? "border-secondary bg-white shadow-[0_12px_30px_-22px_rgba(6,33,18,0.6)]"
                      : "border-tertiary/30 bg-white/60 hover:bg-white"
                  }`}
                >
                  <span className="font-sans text-sm font-semibold text-secondary">
                    {option.label}
                  </span>
                  <span className="font-sans text-xs text-secondary/75">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div
              role="radiogroup"
              aria-label="Cuándo empezar"
              className="flex gap-2"
            >
              {(["now", "later"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={props.startMode === mode}
                  onClick={() => props.onStartModeChange(mode)}
                  className={`h-10 cursor-pointer rounded-full border px-4 font-sans text-sm transition-colors ${
                    props.startMode === mode
                      ? "border-secondary bg-secondary text-primary"
                      : "border-tertiary/40 bg-white text-secondary hover:bg-quaternary/25"
                  }`}
                >
                  {mode === "now" ? "Empezar ahora" : "Programar inicio"}
                </button>
              ))}
            </div>
            {props.startMode === "later" && (
              <Field label="Empieza el" htmlFor="campaign-start">
                <input
                  id="campaign-start"
                  type="datetime-local"
                  value={props.startLocal}
                  onChange={(event) =>
                    props.onStartLocalChange(event.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </Field>
            )}
          </div>

          <div
            aria-live="polite"
            className="rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB] p-4 font-sans text-sm text-secondary"
          >
            {props.estimateError ? (
              <p role="alert" className="text-red-800">
                {props.estimateError}
              </p>
            ) : props.estimate && props.estimate.schedule.count > 0 ? (
              <p>
                Se enviarán <strong>{props.estimate.schedule.count}</strong>{" "}
                mensajes, del{" "}
                <strong>
                  {formatDateTime(props.estimate.schedule.firstAt)}
                </strong>{" "}
                al{" "}
                <strong>
                  {formatDateTime(props.estimate.schedule.lastAt)}
                </strong>{" "}
                ({formatDuration(props.estimate.schedule.days)}), solo entre{" "}
                {props.estimate.settings.sendWindows
                  .map(
                    (window) =>
                      `${Math.floor(window.startMinute / 60)}:${String(window.startMinute % 60).padStart(2, "0")}–${Math.floor(window.endMinute / 60)}:${String(window.endMinute % 60).padStart(2, "0")}`,
                  )
                  .join(" y ")}{" "}
                y con un máximo de {props.estimate.settings.maxPerDay} por día.
              </p>
            ) : (
              <p className="text-secondary/70">
                Elige el mensaje y la audiencia para ver cuánto tardará.
              </p>
            )}
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!props.canLaunch}
            onClick={props.onLaunch}
            className="inline-flex h-12 cursor-pointer items-center rounded-full bg-secondary px-8 font-sans text-sm font-semibold text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
          >
            Revisar y lanzar
          </button>
        </div>
      </div>
    </main>
  );
}
