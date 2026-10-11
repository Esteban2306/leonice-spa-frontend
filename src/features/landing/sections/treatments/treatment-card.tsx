"use client";

import { useState } from "react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import { MediaFrame } from "@/src/features/landing/components/media-frame";
import type { LandingTreatment } from "@/src/features/landing/content/landing-content";
import { formatDuration, formatThousandsCop } from "@/src/features/landing/lib/format";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";

interface TreatmentCardProps {
  treatment: LandingTreatment;
  featured?: boolean;
}

export function TreatmentCard({ treatment, featured = false }: TreatmentCardProps) {
  const glowRef = useSurfaceGlow<HTMLElement>();
  const [open, setOpen] = useState(false);
  const promo = treatment.promotion;
  const price = promo?.priceFromThousands ?? treatment.priceFromThousands;
  const detailId = `treatment-detail-${treatment.id}`;

  return (
    <article
      ref={glowRef}
      data-treatment-card
      data-open={open ? "" : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      className="glow lit lit-hover group/treatment flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#FDF8F1]"
    >
      <MediaFrame
        src={treatment.image}
        alt={treatment.name}
        hint={`Foto de ${treatment.name}`}
        className={featured ? "relative aspect-[16/9] desk:aspect-auto desk:min-h-[19rem] desk:flex-1" : "relative aspect-[16/11] desk:aspect-[4/4.4]"}
        imageClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/treatment:scale-[1.05]"
        sizes={featured ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
      >
        {promo && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#062112] px-3 py-1.5 font-sans text-xs font-bold text-[#E0BC87]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {promo.discountPercentage}% · {promo.name}
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-50 bg-[#BF9250] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/treatment:scale-x-100"
        />
      </MediaFrame>

      <div className={`flex flex-col gap-3 p-6 ${featured ? "desk:flex-none" : "flex-1"}`}>
        <h3 className="font-sans text-xl font-bold leading-snug text-[#062112]">{treatment.name}</h3>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-sm text-[#062112]/70 tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {formatDuration(treatment.durationMinutes)}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            desde{" "}
            <strong className="font-bold text-[#062112]">{formatThousandsCop(price)}</strong>
          </span>
          {promo && (
            <s className="text-[#062112]/45">{formatThousandsCop(treatment.priceFromThousands)}</s>
          )}
        </p>
        <p className="font-sans text-[0.95rem] leading-relaxed text-[#062112]/80">
          {treatment.copy.summary}
        </p>

        <div
          id={detailId}
          className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[open]/treatment:grid-rows-[1fr] group-data-[open]/treatment:opacity-100"
        >
          <div className="overflow-hidden">
            <p className="pb-1 font-sans text-sm leading-relaxed text-[#5c4521]">
              {treatment.copy.detail}
              {treatment.requiresAssessment && " Requiere valoración previa."}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <BookingLink
            variant="outline-ink"
            size="sm"
            arrow={false}
            message={`Hola, quiero agendar ${treatment.name} en Leonice.`}
          >
            Reservar
          </BookingLink>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-2 font-sans text-sm font-bold text-[#062112]"
          >
            {open ? "Ver menos" : "Ver más"}
            <ArrowRight
              aria-hidden="true"
              className={`size-4 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
