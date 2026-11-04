"use client";

import { Loader2, Users } from "lucide-react";

import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { useAdminCategories } from "@/src/features/admin/hooks/use-categories";
import { useClientTagCatalog } from "@/src/features/admin/hooks/use-clients";
import type {
  AudienceFilter,
  AudiencePreview,
} from "@/src/features/admin/types/campaigns.types";
import type { ClientTagKey } from "@/src/features/admin/types/clients.types";

import {
  CLIENT_TAG_META,
  CLIENT_TAG_ORDER,
  toggleTagKey,
} from "../../clients/lib/client-tags";

interface AudienceBuilderProps {
  value: AudienceFilter;
  onChange: (next: AudienceFilter) => void;
  preview: AudiencePreview | undefined;
  isLoading: boolean;
  isError: boolean;
  marketing: boolean;
}

const PRESETS: ReadonlyArray<{
  label: string;
  hint: string;
  filter: AudienceFilter;
}> = [
  {
    label: "Apta para promociones",
    hint: "Asistió en el último año y no falla a sus citas. La lista más segura.",
    filter: { tags: ["APTA_PROMOCION"] },
  },
  {
    label: "Recurrentes",
    hint: "Vienen con frecuencia: las que más compran.",
    filter: { tags: ["RECURRENTE", "APTA_PROMOCION"] },
  },
  {
    label: "Para reactivar",
    hint: "Llevan entre 3 y 12 meses sin venir.",
    filter: { tags: ["EN_PAUSA"] },
  },
  {
    label: "Nuevas",
    hint: "Su primera cita fue hace menos de 60 días.",
    filter: { tags: ["NUEVA"] },
  },
];

const VISITED_OPTIONS = [30, 90, 180, 365];
const ABSENT_OPTIONS = [30, 60, 90, 180];

const EXCLUDE_OPTIONS: readonly ClientTagKey[] = [
  "NO_SHOW_REITERADO",
  "CON_CITA_PROXIMA",
  "RESERVA_PENDIENTE",
  "INACTIVA",
];

const sameFilter = (a: AudienceFilter, b: AudienceFilter) =>
  JSON.stringify(a) === JSON.stringify(b);

export function AudienceBuilder({
  value,
  onChange,
  preview,
  isLoading,
  isError,
  marketing,
}: AudienceBuilderProps) {
  const catalog = useClientTagCatalog();
  const categories = useAdminCategories({ status: "ALL" });
  const counts = new Map(
    (catalog.data ?? []).map((entry) => [entry.key, entry.clients]),
  );

  const set = (patch: Partial<AudienceFilter>) =>
    onChange({ ...value, ...patch });
  const selected = value.tags ?? [];
  const excluded = value.excludeTags ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            title={preset.hint}
            aria-pressed={sameFilter(value, preset.filter)}
            onClick={() => onChange(preset.filter)}
            className={`h-9 cursor-pointer rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
              sameFilter(value, preset.filter)
                ? "border-secondary bg-secondary text-primary"
                : "border-tertiary/40 bg-white text-secondary hover:bg-quaternary/25"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({})}
          className="h-9 cursor-pointer rounded-full px-3 font-sans text-sm text-secondary/70 hover:bg-secondary/5"
        >
          Limpiar
        </button>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-secondary/70">
          Debe tener estas etiquetas
        </legend>
        <div className="flex flex-wrap gap-2">
          {CLIENT_TAG_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selected.includes(key)}
              title={CLIENT_TAG_META[key].description}
              onClick={() => set({ tags: toggleTagKey(selected, key) })}
              className={`inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border px-3 font-sans text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                selected.includes(key)
                  ? "border-secondary bg-secondary text-primary"
                  : "border-tertiary/40 bg-white text-secondary hover:bg-quaternary/25"
              }`}
            >
              {CLIENT_TAG_META[key].label}
              <span className="tabular-nums opacity-70">
                {counts.get(key) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-secondary/70">
          No debe tener
        </legend>
        <div className="flex flex-wrap gap-2">
          {EXCLUDE_OPTIONS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={excluded.includes(key)}
              title={CLIENT_TAG_META[key].description}
              onClick={() => set({ excludeTags: toggleTagKey(excluded, key) })}
              className={`h-8 cursor-pointer rounded-full border px-3 font-sans text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                excluded.includes(key)
                  ? "border-red-700 bg-red-700 text-white"
                  : "border-tertiary/40 bg-white text-secondary hover:bg-red-50"
              }`}
            >
              {CLIENT_TAG_META[key].label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 font-sans text-sm text-secondary">
          Categoría que ha tomado
          <select
            value={value.categoryId ?? ""}
            onChange={(event) =>
              set({ categoryId: event.target.value || undefined })
            }
            className={INPUT_CLASS}
          >
            <option value="">Cualquiera</option>
            {(categories.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 font-sans text-sm text-secondary">
          Vino en los últimos
          <select
            value={value.visitedWithinDays ?? ""}
            onChange={(event) =>
              set({
                visitedWithinDays: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            className={INPUT_CLASS}
          >
            <option value="">Sin límite</option>
            {VISITED_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {days} días
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 font-sans text-sm text-secondary">
          No viene hace más de
          <select
            value={value.notVisitedForDays ?? ""}
            onChange={(event) =>
              set({
                notVisitedForDays: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            className={INPUT_CLASS}
          >
            <option value="">Sin límite</option>
            {ABSENT_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {days} días
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        aria-live="polite"
        className="rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB] p-4"
      >
        {isError ? (
          <p role="alert" className="font-sans text-sm text-red-800">
            No se pudo calcular la audiencia.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-quaternary/40 text-secondary">
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Users className="size-5" />
                )}
              </span>
              <div>
                <p className="font-sans text-3xl font-bold tabular-nums text-secondary">
                  {preview?.total ?? "—"}
                </p>
                <p className="font-sans text-xs text-secondary/75">
                  clientas recibirán el mensaje
                </p>
              </div>
            </div>
            {preview && (
              <ul className="flex flex-col gap-1 font-sans text-xs text-secondary/75">
                {preview.excluded.withoutWhatsapp > 0 && (
                  <li>
                    {preview.excluded.withoutWhatsapp} no han escrito por
                    WhatsApp, así que no se les envía.
                  </li>
                )}
                {marketing && preview.excluded.recentlyMessaged > 0 && (
                  <li>
                    {preview.excluded.recentlyMessaged} recibieron otro mensaje
                    de marketing hace poco y se omiten.
                  </li>
                )}
                {marketing && preview.excluded.withoutConsent > 0 && (
                  <li>
                    {preview.excluded.withoutConsent} no aceptaron recibir
                    promociones.
                  </li>
                )}
              </ul>
            )}
            {preview && preview.sample.length > 0 && (
              <p className="font-sans text-xs text-secondary/70">
                Por ejemplo:{" "}
                {preview.sample.map((item) => item.name).join(", ")}
                {preview.total > preview.sample.length ? "…" : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
