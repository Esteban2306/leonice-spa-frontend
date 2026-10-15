import { Clock, Stethoscope } from "lucide-react";

import { ActionLink, BookingLink } from "@/src/features/landing/components/action-link";
import type { ShowcaseTreatmentDetail } from "@/src/features/treatments/api/showcase.types";
import { Breadcrumbs } from "@/src/features/treatments/components/breadcrumbs";
import { ReviewPendingChip } from "@/src/features/treatments/components/review-pending-chip";
import { TreatmentVideo } from "@/src/features/treatments/components/treatment-video";
import {
  assessmentMessage,
  bookingMessage,
  durationLabel,
  priceDisplay,
} from "@/src/features/treatments/lib/showcase-format";
import { categoryHref, RITUAL_ID, TREATMENTS_ROOT } from "@/src/features/treatments/lib/showcase-routes";

export function TreatmentHero({ treatment }: { treatment: ShowcaseTreatmentDetail }) {
  const price = priceDisplay(treatment.price);
  const duration = durationLabel(treatment.durationMinMinutes, treatment.durationMaxMinutes);

  return (
    <header id="tratamiento-portada" className="px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Tratamientos", href: TREATMENTS_ROOT },
            { label: treatment.category.name, href: categoryHref(treatment.category.slug) },
            { label: treatment.name },
          ]}
        />
        <div className="grid gap-12 desk:grid-cols-[1.05fr_0.95fr] desk:items-center desk:gap-16">
          <div className="flex flex-col gap-8">

            <div className="flex flex-col gap-5">
              <h1 className="sunlit-text font-heading text-[clamp(3rem,7.2vw,6.25rem)] leading-[0.96] tracking-[-0.015em] text-balance text-[#062112]">
                {treatment.name}
              </h1>
              {treatment.tagline && (
                <p className="max-w-[30ch] font-heading text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.2] text-pretty text-[#062112]/85">
                  {treatment.tagline}
                </p>
              )}
            </div>

            {treatment.contentNeedsReview && <ReviewPendingChip />}

            {treatment.summary && (
              <p className="max-w-[58ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/72">
                {treatment.summary}
              </p>
            )}

            <dl className="grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-[#BF9250]/25">
              {duration && (
                <div className="flex flex-col gap-1 bg-[#FDF8F1] p-5">
                  <dt className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                    <Clock className="size-3.5" aria-hidden="true" />
                    Duración
                  </dt>
                  <dd className="font-sans text-xl font-bold tabular-nums text-[#062112]">{duration}</dd>
                </div>
              )}
              {price.label && (
                <div className="flex flex-col gap-1 bg-[#FDF8F1] p-5">
                  <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                    {price.promotionName ? `Precio · ${price.promotionName}` : "Precio"}
                  </dt>
                  <dd className="flex flex-wrap items-baseline gap-x-2 font-sans text-xl font-bold tabular-nums text-[#062112]">
                    {price.label}
                    {price.original && (
                      <span className="text-sm font-normal text-[#062112]/50 line-through">{price.original}</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>

            {treatment.requiresPriorAssessment && (
              <p className="flex max-w-xl items-start gap-3 font-sans text-[0.95rem] leading-relaxed text-[#062112]/75">
                <Stethoscope className="mt-0.5 size-5 shrink-0 text-[#BF9250]" aria-hidden="true" />
                Empezamos con una valoración de tu cabello: el precio final depende de su largo y su estado.
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <BookingLink
                variant="sand"
                size="lg"
                message={
                  treatment.requiresPriorAssessment
                    ? assessmentMessage(treatment.name)
                    : bookingMessage(treatment.name)
                }
              >
                {treatment.requiresPriorAssessment ? "Agendar mi valoración" : `Agendar ${treatment.name}`}
              </BookingLink>
              {treatment.steps.length > 0 && (
                <ActionLink variant="link" to={RITUAL_ID} arrow={false}>
                  Ver cómo se hace
                </ActionLink>
              )}
            </div>
          </div>

          <div className="bezel mx-auto w-full max-w-[34rem] desk:max-w-none">
            <TreatmentVideo
              videoUrl={treatment.videoUrl}
              posterUrl={treatment.posterUrl}
              title={treatment.name}
              mode="cover"
              stepTitles={treatment.steps.map((step) => step.title)}
              className="bezel-core lit aspect-[4/5] w-full [--lift:22px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
