"use client";

import { useState, type ReactNode } from "react";
import { BadgePercent, Scissors, Stethoscope, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/components/ui/sheet";
import type { HairPricingInput } from "@/src/features/admin/hooks/use-catalog-actions";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";
import type { Promotion } from "@/src/features/admin/types/promotions.types";
import type {
  AdminTreatment,
  UpdateTreatmentRequest,
} from "@/src/features/admin/types/treatments.types";

import {
  formatDurationRange,
  formatPriceRange,
  hairPriceRange,
} from "../lib/catalog";
import {
  draftFromTreatment,
  isDraftDirty,
  validateTreatmentDraft,
  type TreatmentDraftErrors,
} from "../lib/treatment-draft";
import { CatalogChip } from "./catalog-chip";
import { CatalogSwitch } from "./catalog-switch";
import { HairPricingEditor } from "./hair-pricing-editor";
import { PromotionsSection } from "./promotions-section";
import { TreatmentFields } from "./treatment-fields";
import { TreatmentVideoSlot } from "./treatment-video-slot";

export type DrawerFocus = "details" | "hair";

interface TreatmentDrawerProps {
  treatment: AdminTreatment | null;
  focus: DrawerFocus;
  categories: readonly AdminCategory[];
  promotions: readonly Promotion[];
  isPromotionsLoading: boolean;
  isSaving: boolean;
  isVideoUploading: boolean;
  nowMs: number;
  onClose: () => void;
  onSave: (
    treatmentId: string,
    data: UpdateTreatmentRequest,
  ) => Promise<boolean>;
  onToggleActive: (treatment: AdminTreatment, isActive: boolean) => void;
  onSaveHairPricing: (
    treatmentId: string,
    input: HairPricingInput,
  ) => Promise<boolean>;
  onUploadVideo: (treatmentId: string, file: File) => Promise<boolean>;
  onRemoveVideo: (treatmentId: string) => Promise<boolean>;
  onCreatePromotion: (treatment: AdminTreatment) => void;
  onEditPromotion: (promotion: Promotion) => void;
  onDeactivatePromotion: (promotion: Promotion) => void;
}

function hairPricingKey(treatment: AdminTreatment): string {
  return [
    ...treatment.hairLengthPricing.map(
      (row) => `${row.hairLength}:${row.price}:${row.durationMinutes}`,
    ),
    ...treatment.hairColorSurcharges.map(
      (row) => `${row.hairColor}:${row.surcharge}:${row.extraDurationMinutes}`,
    ),
  ].join("|");
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-4 border-t border-tertiary/25 px-6 py-6"
    >
      <h3 id={id} className="font-heading text-xl text-secondary">
        {title}
      </h3>
      {children}
    </section>
  );
}

const DATE_FORMAT = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function DrawerBody({
  treatment,
  focus,
  categories,
  promotions,
  isPromotionsLoading,
  isSaving,
  isVideoUploading,
  nowMs,
  onSave,
  onToggleActive,
  onSaveHairPricing,
  onUploadVideo,
  onRemoveVideo,
  onCreatePromotion,
  onEditPromotion,
  onDeactivatePromotion,
}: Omit<TreatmentDrawerProps, "treatment" | "onClose"> & {
  treatment: AdminTreatment;
}) {
  const original = draftFromTreatment(treatment);
  const [draft, setDraft] = useState(original);
  const [errors, setErrors] = useState<TreatmentDraftErrors>({});
  const [showHairEditor, setShowHairEditor] = useState(
    treatment.hasHairVariablePricing || focus === "hair",
  );
  const isDirty = isDraftDirty(original, draft);

  const hair = hairPriceRange(treatment);
  const price = hair
    ? formatPriceRange(hair.priceMin, hair.priceMax)
    : formatPriceRange(treatment.basePriceMin, treatment.basePriceMax);
  const duration = hair
    ? formatDurationRange(hair.minutesMin, hair.minutesMax)
    : formatDurationRange(
        treatment.baseDurationMinMinutes,
        treatment.baseDurationMaxMinutes,
      );

  const save = async () => {
    const result = validateTreatmentDraft(draft);
    setErrors(result.errors);
    if (!result.data) return;
    await onSave(treatment.id, result.data);
  };

  return (
    <>
      <header className="flex flex-col gap-4 bg-secondary px-6 pt-6 pb-5 text-primary">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="min-w-0">
            <SheetTitle className="font-heading text-3xl leading-tight text-primary">
              {treatment.name}
            </SheetTitle>
            <SheetDescription className="mt-1 font-sans text-sm text-primary/65">
              {treatment.category.name} · {treatment.reservationCount}{" "}
              {treatment.reservationCount === 1
                ? "reserva registrada"
                : "reservas registradas"}
            </SheetDescription>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.06] p-3">
            <dt className="font-sans text-xs text-primary/70">
              {hair ? "Precio según cabello" : "Precio publicado"}
            </dt>
            <dd className="mt-1 font-sans text-2xl leading-tight font-light text-quaternary tabular-nums">
              {price ?? "Sin precio"}
            </dd>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.06] p-3">
            <dt className="font-sans text-xs text-primary/70">
              {hair ? "Duración según cabello" : "Duración"}
            </dt>
            <dd className="mt-1 font-sans text-2xl leading-tight font-light text-quaternary tabular-nums">
              {duration ?? "Sin duración"}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {treatment.activePromotion && (
              <CatalogChip
                tone="onDark"
                icon={<BadgePercent className="size-3" strokeWidth={2} />}
              >
                {treatment.activePromotion.name} · −
                {Number(treatment.activePromotion.discountPercentage)} %
              </CatalogChip>
            )}
            {treatment.requiresPriorAssessment && (
              <CatalogChip
                tone="onDark"
                icon={<Stethoscope className="size-3" strokeWidth={2} />}
              >
                Valoración previa
              </CatalogChip>
            )}
            {treatment.hasHairVariablePricing && (
              <CatalogChip
                tone="onDark"
                icon={<Scissors className="size-3" strokeWidth={2} />}
              >
                Precio por cabello
              </CatalogChip>
            )}
          </div>
          <label className="flex items-center gap-2 font-sans text-sm text-primary/80">
            {treatment.isActive ? "Activo" : "Inactivo"}
            <CatalogSwitch
              tone="dark"
              checked={treatment.isActive}
              label={
                treatment.isActive ? "Desactivar servicio" : "Activar servicio"
              }
              onChange={(next) => onToggleActive(treatment, next)}
            />
          </label>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Section id="drawer-details" title="Datos del servicio">
          <TreatmentFields
            idPrefix={`edit-${treatment.id}`}
            draft={draft}
            errors={errors}
            categories={categories}
            onChange={setDraft}
          />
        </Section>

        <Section id="drawer-video" title="Video del procedimiento">
          <TreatmentVideoSlot
            treatmentName={treatment.name}
            videoUrl={treatment.videoUrl ?? null}
            posterUrl={treatment.posterUrl ?? null}
            isUploading={isVideoUploading}
            onUpload={(file) => void onUploadVideo(treatment.id, file)}
            onRemove={() => void onRemoveVideo(treatment.id)}
          />
        </Section>

        <Section id="drawer-hair" title="Precios por cabello">
          {showHairEditor ? (
            <HairPricingEditor
              key={hairPricingKey(treatment)}
              treatment={treatment}
              isSaving={isSaving}
              onSave={(input) => onSaveHairPricing(treatment.id, input)}
            />
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="font-sans text-sm text-secondary/65">
                Este servicio cobra el precio publicado sin importar el cabello.
              </p>
              <button
                type="button"
                onClick={() => setShowHairEditor(true)}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25"
              >
                <Scissors className="size-4" strokeWidth={1.8} />
                Configurar precios por cabello
              </button>
            </div>
          )}
        </Section>

        <Section id="drawer-promotions" title="Promociones">
          <PromotionsSection
            promotions={promotions}
            isLoading={isPromotionsLoading}
            nowMs={nowMs}
            onCreate={() => onCreatePromotion(treatment)}
            onEdit={onEditPromotion}
            onDeactivate={onDeactivatePromotion}
          />
        </Section>

        <p className="border-t border-tertiary/25 px-6 py-5 font-sans text-xs text-secondary/70">
          Creado el {DATE_FORMAT.format(new Date(treatment.createdAt))} · Última
          edición el {DATE_FORMAT.format(new Date(treatment.updatedAt))}
        </p>
      </div>

      {isDirty && (
        <footer className="flex items-center justify-end gap-2 border-t border-tertiary/30 bg-primary px-6 py-4">
          <button
            type="button"
            onClick={() => {
              setDraft(original);
              setErrors({});
            }}
            className="h-11 cursor-pointer rounded-full px-5 font-sans text-sm text-secondary/70 transition-colors hover:bg-secondary/5"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void save()}
            className="h-11 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Guardar cambios"}
          </button>
        </footer>
      )}
    </>
  );
}

export function TreatmentDrawer(props: TreatmentDrawerProps) {
  const { treatment, onClose } = props;

  return (
    <Sheet
      open={treatment !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden border-l border-tertiary/30 bg-[#FCF6EB] p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        {treatment && (
          <DrawerBody
            key={`${treatment.id}-${treatment.updatedAt}`}
            {...props}
            treatment={treatment}
          />
        )}
        <SheetClose
          render={
            <button
              type="button"
              aria-label="Cerrar detalle"
              className="absolute top-5 right-5 grid size-9 cursor-pointer place-items-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            />
          }
        >
          <X className="size-4.5" />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
