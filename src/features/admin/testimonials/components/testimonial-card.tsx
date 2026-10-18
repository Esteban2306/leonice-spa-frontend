"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImageOff, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type { AdminTestimonial } from "@/src/features/admin/types/testimonials.types";

import { isOptimizableImage } from "../../products/lib/product-catalog";
import { TESTIMONIAL_PHOTO } from "../lib/testimonial-form";

export interface TestimonialCardHandlers {
  onEdit: (testimonial: AdminTestimonial) => void;
  onDelete: (testimonial: AdminTestimonial) => void;
  onTogglePublished: (testimonial: AdminTestimonial, next: boolean) => void;
  onMove: (testimonial: AdminTestimonial, delta: -1 | 1) => void;
}

interface TestimonialCardProps extends TestimonialCardHandlers {
  testimonial: AdminTestimonial;
  isFirst: boolean;
  isLast: boolean;
  isBusy: boolean;
}

function Thumb({
  url,
  label,
  alt,
}: {
  url: string | null;
  label: string;
  alt: string;
}) {
  return (
    <div
      style={{ aspectRatio: TESTIMONIAL_PHOTO.ratio }}
      className="relative w-24 shrink-0 overflow-hidden rounded-xl border border-tertiary/30 bg-white sm:w-28"
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes="112px"
          unoptimized={!isOptimizableImage(url)}
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center border border-dashed border-tertiary/50 bg-quaternary/15 text-[#7A5A2C]">
          <span className="flex flex-col items-center gap-1 text-center">
            <ImageOff aria-hidden="true" className="size-4" strokeWidth={1.6} />
            <span className="font-sans text-[11px] leading-tight">
              Sin foto
            </span>
          </span>
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute left-1.5 top-1.5 rounded-full bg-secondary/85 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-primary"
      >
        {label}
      </span>
    </div>
  );
}

const ICON_BUTTON =
  "grid size-10 cursor-pointer place-items-center rounded-full text-secondary/75 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";

export function TestimonialCard({
  testimonial,
  isFirst,
  isLast,
  isBusy,
  onEdit,
  onDelete,
  onTogglePublished,
  onMove,
}: TestimonialCardProps) {
  const missingPhoto =
    !testimonial.beforeImageUrl || !testimonial.afterImageUrl;
  const name = testimonial.authorName;

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-[1.5rem] border p-4 transition-colors sm:flex-row sm:items-center sm:p-5",
        testimonial.isPublished
          ? "border-tertiary/30 bg-white/80"
          : "border-dashed border-secondary/25 bg-primary/40",
      )}
    >
      <div className="flex gap-3">
        <Thumb
          url={testimonial.beforeImageUrl}
          label="Antes"
          alt={`Foto del antes de ${name}`}
        />
        <Thumb
          url={testimonial.afterImageUrl}
          label="Después"
          alt={`Foto del después de ${name}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-sans text-[15px] font-semibold text-secondary">
            {name}
          </p>
          <span className="font-sans text-sm text-secondary/75">
            · {testimonial.treatmentName}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-sans text-xs font-medium",
              testimonial.isPublished
                ? "bg-emerald-100 text-emerald-900"
                : "bg-secondary/10 text-secondary/80",
            )}
          >
            {testimonial.isPublished ? "Publicado" : "Oculto"}
          </span>
          {missingPhoto && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-sans text-xs font-medium text-amber-900">
              Falta una foto
            </span>
          )}
        </div>
        <p className="mt-1.5 line-clamp-3 font-sans text-sm leading-relaxed text-secondary/80">
          “{testimonial.quote}”
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
        <div className="flex items-center gap-2">
          <CatalogSwitch
            checked={testimonial.isPublished}
            disabled={isBusy}
            label={
              testimonial.isPublished
                ? `Ocultar el testimonio de ${name}`
                : `Publicar el testimonio de ${name}`
            }
            onChange={(next) => onTogglePublished(testimonial, next)}
          />
        </div>
        <div className="flex items-center">
          <button
            type="button"
            disabled={isFirst || isBusy}
            onClick={() => onMove(testimonial, -1)}
            aria-label={`Subir el testimonio de ${name}`}
            className={ICON_BUTTON}
          >
            <ArrowUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={isLast || isBusy}
            onClick={() => onMove(testimonial, 1)}
            aria-label={`Bajar el testimonio de ${name}`}
            className={ICON_BUTTON}
          >
            <ArrowDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(testimonial)}
            aria-label={`Editar el testimonio de ${name}`}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onDelete(testimonial)}
            aria-label={`Eliminar el testimonio de ${name}`}
            className={cn(ICON_BUTTON, "hover:text-red-700")}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
