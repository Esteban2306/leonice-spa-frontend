"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Clock, Stethoscope } from "lucide-react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import type { ShowcaseTreatmentCard } from "@/src/features/treatments/api/showcase.types";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";
import { TreatmentVideo } from "@/src/features/treatments/components/treatment-video";
import {
  durationLabel,
  priceDisplay,
  treatmentBookingMessage,
} from "@/src/features/treatments/lib/showcase-format";
import { treatmentHref } from "@/src/features/treatments/lib/showcase-routes";

export function TreatmentCard({
  treatment,
  wide = false,
}: {
  treatment: ShowcaseTreatmentCard;
  wide?: boolean;
}) {
  const [active, setActive] = useState(false);
  const glowRef = useSurfaceGlow<HTMLSpanElement>();
  const price = priceDisplay(treatment.price);
  const duration = durationLabel(treatment.durationMinMinutes, treatment.durationMaxMinutes);

  return (
    <div
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group/card bezel lit-hover flex h-full cursor-pointer flex-col has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-4 has-[[data-card-link]:focus-visible]:outline-[#BF9250]"
    >
      <span
        ref={glowRef}
        className={`bezel-core glow lit relative flex h-full w-full flex-col overflow-hidden bg-[#FDF8F1] [--lift:10px] ${
          wide ? "desk:flex-row" : ""
        }`}
      >
        <span
          className={`relative block overflow-hidden ${
            wide ? "aspect-[4/3] desk:aspect-auto desk:w-[55%]" : "aspect-[4/3]"
          }`}
        >
          <TreatmentVideo
            videoUrl={treatment.videoUrl}
            posterUrl={treatment.posterUrl}
            title={treatment.name}
            mode="card"
            playing={active}
            stepCount={treatment.stepCount}
            className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[#BF9250] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-x-100"
          />
          {treatment.price.promotion && (
            <span className="absolute left-4 top-4 rounded-full bg-[#062112] px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0BC87]">
              -{treatment.price.promotion.discountPercentage}% {treatment.price.promotion.name}
            </span>
          )}
        </span>

        <span className={`flex flex-1 flex-col gap-4 p-6 sm:p-7 ${wide ? "desk:min-h-[26rem] desk:justify-center desk:p-12" : ""}`}>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs font-bold text-[#7a5a2c]">
            {duration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {duration}
              </span>
            )}
            {treatment.requiresPriorAssessment && (
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="size-3.5" aria-hidden="true" />
                Con valoración previa
              </span>
            )}
          </span>
          <span className="flex flex-col gap-2">
            <span
              className={`font-sans font-bold leading-snug text-[#062112] ${wide ? "text-2xl desk:text-3xl" : "text-xl"}`}
            >
              {treatment.name}
            </span>
            {treatment.tagline && (
              <span className="font-sans text-[0.95rem] leading-relaxed text-pretty text-[#062112]/70">
                {treatment.tagline}
              </span>
            )}
          </span>
          {treatment.benefits.length > 0 && (
            <span className="flex flex-col gap-1.5">
              {treatment.benefits.slice(0, wide ? 3 : 2).map((benefit) => (
                <span key={benefit} className="flex items-start gap-2 font-sans text-sm text-[#062112]/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#BF9250]" aria-hidden="true" />
                  {benefit}
                </span>
              ))}
            </span>
          )}
          <span className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[#BF9250]/25 pt-4">
            <span className="flex flex-col">
              {price.original && (
                <span className="font-sans text-xs tabular-nums text-[#062112]/50 line-through">{price.original}</span>
              )}
              {price.label && (
                <span className="font-sans text-base font-bold tabular-nums text-[#062112]">{price.label}</span>
              )}
            </span>
            <span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-3">
              <Link
                href={treatmentHref(treatment.categorySlug, treatment.slug)}
                data-card-link
                aria-label={`Ver tratamiento ${treatment.name}`}
                className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#062112] outline-none after:absolute after:inset-0 after:content-['']"
              >
                <span className="underline decoration-[#BF9250] decoration-2 underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover/card:decoration-[#062112]">
                  Ver tratamiento
                </span>
                <span className="grid size-9 place-items-center rounded-full bg-[#062112]/5 transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:bg-[#062112] group-hover/card:text-[#E0BC87]">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
              <BookingLink
                variant="ink"
                size="sm"
                arrow={false}
                message={treatmentBookingMessage(treatment)}
                ariaLabel={`Agendar ${treatment.name} por WhatsApp`}
                className="z-10"
              >
                Agendar
              </BookingLink>
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
