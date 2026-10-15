"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";

import AccordionGallery from "@/src/components/ui/AccordionGallery";
import { BookingLink } from "@/src/features/landing/components/action-link";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import {
  treatmentsContent,
  type LandingCatalog,
  type LandingTreatment,
} from "@/src/features/landing/content/landing-content";
import {
  landingCategoryHref,
  landingTreatmentHref,
  TREATMENTS_PAGE,
} from "@/src/features/landing/lib/catalog-links";
import { formatDuration, formatThousandsCop } from "@/src/features/landing/lib/format";
import { SECTION_IDS, whatsappHref } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";

const EASE = [0.16, 1, 0.3, 1] as const;

function describe(treatment: LandingTreatment) {
  const price = treatment.promotion?.priceFromThousands ?? treatment.priceFromThousands;
  const parts = [treatment.copy.summary];
  if (treatment.requiresAssessment) parts.push("Requiere valoración previa.");
  parts.push(`Desde ${formatThousandsCop(price)} · ${formatDuration(treatment.durationMinutes)}.`);
  if (treatment.promotion) {
    parts.push(`${treatment.promotion.name}: ${treatment.promotion.discountPercentage}% de descuento.`);
  }
  return parts.join(" ");
}

export function TreatmentsSection({ catalog }: { catalog: LandingCatalog }) {
  const rootRef = useRef<HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);
  const canExpand = catalog.categories.length > 0;

  const items = catalog.featured.map((treatment) => ({
    label: treatment.name,
    description: (
      <>
        <span className="block">{describe(treatment)}</span>
        <span className="treatment-cta">
          Agendar cita
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </>
    ),
    link:
      whatsappHref(`Hola, quiero agendar ${treatment.name} en Leonice.`) ?? `#${SECTION_IDS.contact}`,
    image: treatment.image ?? undefined,
    alt: treatment.name,
    hint: `Foto de ${treatment.name}`,
  }));

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const heading = root.querySelector<HTMLElement>("[data-heading]");
        const split = heading ? SplitText.create(heading, { type: "words", mask: "words" }) : null;
        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: { trigger: root, start: "top 70%" },
        });
        tl.from(split?.words ?? [], { yPercent: 105, duration: 1, stagger: 0.04 })
          .from("[data-treatments-action]", { opacity: 0, x: 24, duration: 0.9 }, 0.2)
          .from(
            "[data-treatments-gallery] .ag-panel",
            {
              clipPath: "inset(0 100% 0 0 round 28px)",
              duration: 1.3,
              stagger: 0.1,
              clearProps: "clipPath",
            },
            0.25,
          );
        return () => split?.revert();
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.treatments}
      tabIndex={-1}
      aria-labelledby="treatments-title"
      className="relative bg-[#F2EBDB] py-16 outline-none sm:py-12 desk:flex desk:min-h-[calc(100svh-var(--nav-height))] desk:items-center"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 sm:px-8">
        <SectionHeading
          id="treatments-title"
          title={treatmentsContent.title}
          action={
            canExpand ? (
              <button
                type="button"
                data-treatments-action
                aria-expanded={showAll}
                aria-controls="all-treatments"
                onClick={() => setShowAll((value) => !value)}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[#062112] px-6 font-sans text-[0.95rem] font-bold text-[#F2EBDB] shadow-[calc(var(--sun-dx)*6px)_calc(var(--sun-dy)*6px)_18px_-6px_rgb(6_33_18/0.45)] transition-colors duration-300 hover:bg-[#0d3320]"
              >
                {showAll ? "Ocultar catálogo" : "Ver todos los tratamientos"}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 transition-transform duration-500 ${showAll ? "rotate-180" : ""}`}
                />
              </button>
            ) : null
          }
        />

        <div data-treatments-gallery className="treatments-gallery">
          <AccordionGallery
            items={items}
            defaultIndex={0}
            height="clamp(20rem, calc(100svh - 27rem), 40rem)"
            gap={12}
            radius={28}
            expandRatio={0.5}
            tilt={4}
            parallax={0}
            fill
            grayscale={false}
            persistentLabels
            accentColor="#BF9250"
            overlayColor="#F2EBDB"
            textColor="#062112"
            ariaLabel="Procedimientos destacados"
            renderMedia={(item) => (
              <div
                role="img"
                aria-label={`Sin imagen: ${item.hint}`}
                data-tone="light"
                className="media-empty flex h-full w-full items-start justify-center pt-24"
              >
                <span className="rounded-full border border-dashed border-[#BF9250]/60 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                  Sin imagen
                </span>
              </div>
            )}
          />
        </div>

        <AnimatePresence initial={false}>
          {showAll && (
            <motion.div
              id="all-treatments"
              key="all"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="grid gap-6 pt-2 md:grid-cols-2 desk:grid-cols-3">
                {catalog.categories.map((category, groupIndex) => (
                  <motion.section
                    key={category.id}
                    aria-label={category.name}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 * groupIndex }}
                    className="lit rounded-[1.75rem] border border-[#BF9250]/25 bg-[#FDF8F1] p-6"
                  >
                    <h3 className="font-heading text-3xl text-[#062112]">
                      <Link
                        href={landingCategoryHref(category)}
                        className="underline-offset-[8px] hover:underline hover:decoration-[#BF9250] hover:decoration-2"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <ul className="mt-4 divide-y divide-[#BF9250]/20">
                      {catalogItems(catalog, category.name).map((treatment) => (
                        <li key={treatment.id} className="flex items-center justify-between gap-4 py-3">
                          <div className="min-w-0">
                            <Link
                              href={landingTreatmentHref(treatment)}
                              className="font-sans font-bold text-[#062112] underline-offset-[5px] hover:underline hover:decoration-[#BF9250] hover:decoration-2"
                            >
                              {treatment.name}
                            </Link>
                            <p className="flex items-center gap-1.5 font-sans text-xs text-[#062112]/65">
                              <Clock className="size-3.5" aria-hidden="true" />
                              {formatDuration(treatment.durationMinutes)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className="font-sans text-sm font-bold text-[#7a5a2c] tabular-nums">
                              {formatThousandsCop(
                                treatment.promotion?.priceFromThousands ?? treatment.priceFromThousands,
                              )}
                            </span>
                            <BookingLink
                              variant="link"
                              arrow={false}
                              message={`Hola, quiero agendar ${treatment.name} en Leonice.`}
                              ariaLabel={`Reservar ${treatment.name}`}
                            >
                              Reservar
                            </BookingLink>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                ))}
              </div>
              <div className="flex justify-center pt-8">
                <Link
                  href={TREATMENTS_PAGE}
                  className="group inline-flex items-center gap-2 font-sans text-[0.95rem] font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
                >
                  Conoce cada tratamiento paso a paso
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function catalogItems(catalog: LandingCatalog, categoryName: string) {
  return catalog.all.filter((treatment) => treatment.categoryName === categoryName);
}
