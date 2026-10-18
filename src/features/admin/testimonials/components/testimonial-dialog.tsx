"use client";

import { useEffect, useMemo, useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  CheckboxField,
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { TestimonialActions } from "@/src/features/admin/hooks/use-testimonial-actions";
import type {
  AdminTestimonial,
  TestimonialPhotoSlot,
} from "@/src/features/admin/types/testimonials.types";

import {
  normalizeTestimonialValues,
  PHOTO_SLOT_LABELS,
  TESTIMONIAL_LIMITS,
  TESTIMONIAL_PHOTO,
  validateTestimonial,
  type TestimonialFormValues,
} from "../lib/testimonial-form";
import { PhotoField } from "./photo-field";

export type TestimonialDialogTarget = "new" | AdminTestimonial;

interface TestimonialDialogProps {
  target: TestimonialDialogTarget | null;
  actions: TestimonialActions;
  onClose: () => void;
}

const SLOTS: TestimonialPhotoSlot[] = ["before", "after"];

export function TestimonialDialog({
  target,
  actions,
  onClose,
}: TestimonialDialogProps) {
  const existing = target !== null && target !== "new" ? target : null;
  const isCreate = target === "new";

  const [values, setValues] = useState<TestimonialFormValues>({
    authorName: existing?.authorName ?? "",
    quote: existing?.quote ?? "",
    treatmentName: existing?.treatmentName ?? "",
  });
  const [isPublished, setIsPublished] = useState(existing?.isPublished ?? true);
  const [consent, setConsent] = useState(false);
  const [staged, setStaged] = useState<
    Partial<Record<TestimonialPhotoSlot, File>>
  >({});
  const [busySlots, setBusySlots] = useState<ReadonlySet<TestimonialPhotoSlot>>(
    new Set(),
  );
  const [touched, setTouched] = useState<Set<keyof TestimonialFormValues>>(
    new Set(),
  );

  const previews = useMemo(
    () => ({
      before: staged.before ? URL.createObjectURL(staged.before) : null,
      after: staged.after ? URL.createObjectURL(staged.after) : null,
    }),
    [staged],
  );
  useEffect(
    () => () => {
      for (const url of Object.values(previews)) {
        if (url) URL.revokeObjectURL(url);
      }
    },
    [previews],
  );

  const errors = validateTestimonial(values);
  const visible = (field: keyof TestimonialFormValues) =>
    touched.has(field) ? (errors[field] ?? null) : null;
  const touch = (field: keyof TestimonialFormValues) =>
    setTouched((prev) => new Set(prev).add(field));
  const hasErrors = Object.keys(errors).length > 0;
  const canSubmit = !hasErrors && (!isCreate || consent);

  const set = (patch: Partial<TestimonialFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const submit = () => {
    const clean = normalizeTestimonialValues(values);
    if (isCreate) {
      return actions.create(
        { ...clean, isPublished, consentConfirmed: true },
        staged,
      );
    }
    if (!existing) return Promise.resolve(false);
    return actions.update(existing.id, { ...clean, isPublished });
  };

  const runSlot = async (
    slot: TestimonialPhotoSlot,
    run: () => Promise<boolean>,
  ) => {
    setBusySlots((prev) => new Set(prev).add(slot));
    try {
      await run();
    } finally {
      setBusySlots((prev) => {
        const next = new Set(prev);
        next.delete(slot);
        return next;
      });
    }
  };

  const photoUrl = (slot: TestimonialPhotoSlot) =>
    existing
      ? slot === "before"
        ? existing.beforeImageUrl
        : existing.afterImageUrl
      : previews[slot];

  return (
    <ActionDialog
      open={target !== null}
      onOpenChange={(open) => !open && onClose()}
      title={isCreate ? "Nuevo testimonio" : "Editar testimonio"}
      description={
        isCreate
          ? "Se publica en la sección de historias de la web. Las fotos son opcionales y se pueden subir después."
          : "Los cambios de texto se guardan al presionar Guardar; las fotos se guardan apenas las subes."
      }
      submitLabel={isCreate ? "Crear testimonio" : "Guardar cambios"}
      submittingLabel={isCreate ? "Creando…" : "Guardando…"}
      canSubmit={canSubmit}
      contentClassName="sm:max-w-2xl max-h-[92svh] overflow-y-auto"
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombre a mostrar"
          htmlFor="testimonial-author"
          hint="Mejor solo iniciales, por ejemplo M.R."
          error={visible("authorName")}
        >
          <input
            id="testimonial-author"
            value={values.authorName}
            maxLength={TESTIMONIAL_LIMITS.authorMax}
            onChange={(event) => set({ authorName: event.target.value })}
            onBlur={() => touch("authorName")}
            className={INPUT_CLASS}
          />
        </Field>
        <Field
          label="Tratamiento"
          htmlFor="testimonial-treatment"
          error={visible("treatmentName")}
        >
          <input
            id="testimonial-treatment"
            value={values.treatmentName}
            maxLength={TESTIMONIAL_LIMITS.treatmentMax}
            onChange={(event) => set({ treatmentName: event.target.value })}
            onBlur={() => touch("treatmentName")}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <Field
        label="Lo que dijo la clienta"
        htmlFor="testimonial-quote"
        hint={`${values.quote.trim().length}/${TESTIMONIAL_LIMITS.quoteMax} caracteres`}
        error={visible("quote")}
      >
        <TextArea
          id="testimonial-quote"
          value={values.quote}
          maxLength={TESTIMONIAL_LIMITS.quoteMax + 100}
          rows={4}
          onChange={(event) => set({ quote: event.target.value })}
          onBlur={() => touch("quote")}
        />
      </Field>

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-dashed border-tertiary/50 p-4">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-sm font-semibold text-secondary">
            Fotos de antes y después
          </p>
          <p className="font-sans text-xs text-secondary/75">
            Usa fotos verticales de proporción {TESTIMONIAL_PHOTO.ratioLabel}{" "}
            (ideal {TESTIMONIAL_PHOTO.width} × {TESTIMONIAL_PHOTO.height} px) y
            con el cabello centrado. Si tu foto tiene otra proporción, se
            recorta sola al centro para que todas se vean iguales en la web.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SLOTS.map((slot) => (
            <PhotoField
              key={slot}
              label={PHOTO_SLOT_LABELS[slot]}
              imageUrl={photoUrl(slot)}
              isBusy={busySlots.has(slot)}
              onPick={(file) =>
                existing
                  ? void runSlot(slot, () =>
                      actions.uploadImage(existing.id, slot, file),
                    )
                  : setStaged((prev) => ({ ...prev, [slot]: file }))
              }
              onRemove={() =>
                existing
                  ? void runSlot(slot, () =>
                      actions.removeImage(existing.id, slot),
                    )
                  : setStaged((prev) => {
                      const next = { ...prev };
                      delete next[slot];
                      return next;
                    })
              }
            />
          ))}
        </div>
      </div>

      <CheckboxField
        id="testimonial-published"
        checked={isPublished}
        onChange={setIsPublished}
        label="Mostrar en la web"
        description="Puedes ocultarlo en cualquier momento sin borrarlo."
      />

      {isCreate && (
        <CheckboxField
          id="testimonial-consent"
          checked={consent}
          onChange={setConsent}
          label="La clienta autorizó publicar su testimonio y sus fotos"
          description="Es obligatorio: son datos personales y deben tener su autorización."
        />
      )}
    </ActionDialog>
  );
}
