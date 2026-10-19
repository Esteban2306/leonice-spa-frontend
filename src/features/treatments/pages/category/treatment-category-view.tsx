import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import type {
  ShowcaseCategoryDetail,
  ShowcaseCategorySummary,
} from "@/src/features/treatments/api/showcase.types";
import { BookingBand } from "@/src/features/landing/components/booking-band";
import { Breadcrumbs } from "@/src/features/landing/components/breadcrumbs";
import { CategoryIcon } from "@/src/features/treatments/components/category-icon";
import { Reveal } from "@/src/features/landing/components/reveal";
import { TreatmentCard } from "@/src/features/treatments/components/treatment-card";
import {
  bookingMessage,
  countLabel,
  durationLabel,
  priceFromLabel,
} from "@/src/features/treatments/lib/showcase-format";
import { categoryHref, TREATMENTS_ROOT } from "@/src/features/treatments/lib/showcase-routes";

export function TreatmentCategoryView({
  category,
  otherCategories,
}: {
  category: ShowcaseCategoryDetail;
  otherCategories: ShowcaseCategorySummary[];
}) {
  const meta = [
    countLabel(category.treatmentCount, "servicio", "servicios"),
    durationLabel(category.durationMinMinutes, category.durationMaxMinutes),
    priceFromLabel(category.priceFromThousands),
  ].filter(Boolean);

  return (
    <>
      <header className="px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tratamientos", href: TREATMENTS_ROOT },
              { label: category.name },
            ]}
          />
          <div className="grid gap-10 desk:grid-cols-[1.1fr_0.9fr] desk:items-end">
            <div className="flex flex-col gap-6">
              <span className="grid size-16 place-items-center rounded-full bg-[#E0BC87]/45 text-[#062112] sm:size-20">
                <CategoryIcon iconKey={category.iconKey} className="size-8 sm:size-9" />
              </span>
              <h1 className="sunlit-text font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.98] tracking-[-0.015em] text-balance text-[#062112]">
                {category.name}
              </h1>
              {category.tagline && (
                <p className="max-w-[40ch] font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.25] text-[#062112]/85">
                  {category.tagline}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-6">
              {category.description && (
                <p className="max-w-[56ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/70">
                  {category.description}
                </p>
              )}
              <p className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-sm font-bold tabular-nums text-[#7a5a2c]">
                {meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
              <div>
                <BookingLink variant="sand" size="lg" message={bookingMessage(category.name)}>
                  Agendar en {category.name}
                </BookingLink>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section aria-label={`Tratamientos de ${category.name}`} className="px-5 pb-24 sm:px-8 sm:pb-32">
        <ul className="mx-auto grid max-w-[1440px] gap-6 sm:grid-cols-2 desk:grid-cols-3">
          {category.treatments.map((treatment, index) => {
            const wide = index === 0 && category.treatments.length > 2;
            return (
              <Reveal
                as="li"
                key={treatment.id}
                delay={(index % 3) * 90}
                className={wide ? "sm:col-span-2 desk:col-span-3" : ""}
              >
                <TreatmentCard treatment={treatment} wide={wide} />
              </Reveal>
            );
          })}
        </ul>
      </section>

      {otherCategories.length > 0 && (
        <section aria-labelledby="otras-categorias" className="px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
            <h2
              id="otras-categorias"
              className="font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-[#062112]"
            >
              También te puede interesar
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 desk:grid-cols-3">
              {otherCategories.map((other) => (
                <li key={other.id}>
                  <Link
                    href={categoryHref(other.slug)}
                    className="group/other lit lit-hover flex items-center gap-4 rounded-[1.75rem] bg-[#F2EBDB] p-5 [--lift:8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BF9250]"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#FDF8F1] text-[#062112]">
                      <CategoryIcon iconKey={other.iconKey} className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-heading text-2xl leading-tight text-[#062112]">{other.name}</span>
                      <span className="font-sans text-xs font-bold text-[#7a5a2c]">
                        {countLabel(other.treatmentCount, "servicio", "servicios")}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-5 text-[#062112] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/other:-translate-y-0.5 group-hover/other:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BookingBand
        title={`Agenda tu cita de ${category.name}`}
        lead="Escríbenos por WhatsApp y te ayudamos a elegir el servicio y el horario que mejor te queda."
        message={bookingMessage(category.name)}
        actionLabel="Agendar por WhatsApp"
      />
    </>
  );
}
