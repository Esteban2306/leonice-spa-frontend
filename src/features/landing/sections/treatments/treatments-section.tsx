"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";

import AccordionGallery from "@/src/components/ui/AccordionGallery";
import { ActionLink } from "@/src/features/landing/components/action-link";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import {
  treatmentsContent,
  type LandingCatalog,
  type LandingTreatment,
} from "@/src/features/landing/content/landing-content";
import { TREATMENTS_PAGE } from "@/src/features/landing/lib/catalog-links";
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
            <span data-treatments-action className="inline-flex">
              <ActionLink variant="ink" href={TREATMENTS_PAGE}>
                Ver todos los tratamientos
              </ActionLink>
            </span>
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
      </div>
    </section>
  );
}
