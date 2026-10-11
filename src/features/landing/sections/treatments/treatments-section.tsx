"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Clock } from "lucide-react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import {
  treatmentsContent,
  type LandingCatalog,
} from "@/src/features/landing/content/landing-content";
import { formatDuration, formatThousandsCop } from "@/src/features/landing/lib/format";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { TreatmentCard } from "@/src/features/landing/sections/treatments/treatment-card";

const EASE = [0.16, 1, 0.3, 1] as const;

export function TreatmentsSection({ catalog }: { catalog: LandingCatalog }) {
  const rootRef = useRef<HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);
  const canExpand = catalog.categories.length > 0;

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
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        });
        tl.from(split?.words ?? [], { yPercent: 105, duration: 1, stagger: 0.04 })
          .from("[data-treatments-action]", { opacity: 0, x: 24, duration: 0.9 }, 0.2)
          .fromTo(
            "[data-treatment-card]",
            { x: -56, opacity: 0, "--lift": "0px" },
            { x: 0, opacity: 1, "--lift": "18px", duration: 1.3, stagger: 0.14 },
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
      className="relative bg-[#F2EBDB] py-24 outline-none sm:py-32"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-5 sm:px-8">
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

        <div className="grid gap-6 desk:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {catalog.featured.map((treatment, index) => (
            <TreatmentCard key={treatment.id} treatment={treatment} featured={index === 0} />
          ))}
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
                    <h3 className="font-heading text-3xl text-[#062112]">{category.name}</h3>
                    <ul className="mt-4 divide-y divide-[#BF9250]/20">
                      {catalogItems(catalog, category.name).map((treatment) => (
                        <li key={treatment.id} className="flex items-center justify-between gap-4 py-3">
                          <div className="min-w-0">
                            <p className="font-sans font-bold text-[#062112]">{treatment.name}</p>
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
