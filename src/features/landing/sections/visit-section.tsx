"use client";

import { useRef } from "react";
import { Clock, MapPin, MessageCircle } from "lucide-react";

import { ReviewRating } from "@/src/features/landing/components/review-rating";
import { BookingLink } from "@/src/features/landing/components/action-link";
import { visitContent } from "@/src/features/landing/content/landing-content";
import type { OpeningHoursRow } from "@/src/features/landing/lib/opening-hours";
import {
  formatWhatsappDisplay,
  SECTION_IDS,
  siteContact,
  SPA_NAME,
  BOOKING_MESSAGE,
  whatsappHref,
} from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { SectionAtmosphere } from "@/src/features/landing/components/section-atmosphere";

function Pending({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-[#062112]/70 px-3 py-1 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#062112]">
      {children}
    </span>
  );
}

function MapPanel() {
  if (siteContact.mapEmbedUrl) {
    return (
      <iframe
        title={`Mapa de ${SPA_NAME}`}
        src={siteContact.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label="Mapa disponible pronto"
      className="media-empty absolute inset-0 grid place-items-center"
    >
      <div className="flex flex-col items-center gap-3 text-center text-[#7a5a2c]">
        <MapPin className="size-8" aria-hidden="true" />
        <span className="rounded-full border border-dashed border-[#BF9250]/60 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em]">
          Mapa disponible pronto
        </span>
        {process.env.NODE_ENV !== "production" && (
          <span className="max-w-[28ch] font-sans text-xs opacity-80">
            Configura NEXT_PUBLIC_SPA_MAP_EMBED_URL para mostrarlo
          </span>
        )}
      </div>
    </div>
  );
}

export function VisitSection({ hours }: { hours: OpeningHoursRow[] | null }) {
  const rootRef = useRef<HTMLElement>(null);
  const whatsapp = formatWhatsappDisplay();
  const whatsappLink = whatsappHref(BOOKING_MESSAGE);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const heading = root.querySelector<HTMLElement>("[data-heading]");
        const split = heading
          ? SplitText.create(heading, { type: "lines", mask: "lines" })
          : null;
        gsap
          .timeline({
            defaults: { ease: EASE_OUT },
            scrollTrigger: { trigger: root, start: "top 70%" },
          })
          .from(split?.lines ?? [], {
            yPercent: 105,
            duration: 1.1,
            stagger: 0.1,
          })
          .from(
            "[data-visit-item]",
            { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 },
            0.3,
          )
          .from(
            "[data-visit-map]",
            {
              clipPath: "inset(0 0 0 100% round 32px)",
              duration: 1.5,
              ease: "expo.inOut",
            },
            0.2,
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
      id={SECTION_IDS.contact}
      tabIndex={-1}
      aria-labelledby="visit-title"
      className="relative isolate overflow-hidden bg-[#BF9250] py-24 outline-none sm:py-28"
    >
      <SectionAtmosphere name="visit" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(255_226_180/0.45),transparent_65%)] blur-2xl"
      />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col gap-10">
          <h2
            id="visit-title"
            data-heading
            className="font-heading text-[clamp(2.5rem,4.8vw,4.25rem)] leading-[1.02] text-balance text-[#062112]"
          >
            {visitContent.title}
          </h2>

          <div data-visit-item>
            <BookingLink variant="ink" size="lg">
              Agendar cita
            </BookingLink>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2">
            {hours && hours.length > 0 && (
              <div data-visit-item className="flex flex-col gap-2">
                <dt className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#062112]/75">
                  <Clock className="size-4" aria-hidden="true" />
                  Horario
                </dt>
                {hours.map((slot) => (
                  <dd
                    key={slot.days}
                    className="font-sans text-lg text-[#062112] tabular-nums"
                  >
                    {slot.days} · {slot.hours}
                  </dd>
                ))}
              </div>
            )}
            <div data-visit-item className="flex flex-col gap-2">
              <dt className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#062112]/75">
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
              </dt>
              <dd className="font-sans text-lg text-[#062112]">
                {whatsapp && whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#062112]/50 decoration-2 underline-offset-[6px] transition-colors hover:decoration-[#062112]"
                  >
                    {whatsapp}
                  </a>
                ) : (
                  <Pending>Próximamente</Pending>
                )}
              </dd>
            </div>
            <div data-visit-item className="flex flex-col gap-2 sm:col-span-2">
              <dt className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#062112]/75">
                <MapPin className="size-4" aria-hidden="true" />
                Dirección
              </dt>
              <dd className="font-sans text-lg text-[#062112]">
                {siteContact.address ? (
                  siteContact.mapsUrl ? (
                    <a
                      href={siteContact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[#062112]/50 decoration-2 underline-offset-[6px] hover:decoration-[#062112]"
                    >
                      {siteContact.address}
                    </a>
                  ) : (
                    siteContact.address
                  )
                ) : (
                  <Pending>Próximamente</Pending>
                )}
              </dd>
            </div>
          </dl>

          <div
            data-visit-item
            className="lit flex max-w-md flex-col gap-3 rounded-[1.5rem] bg-[#F2EBDB]/40 p-5 backdrop-blur-sm"
          >
            <p className="font-sans font-bold text-[#062112]">
              {visitContent.reviewTitle}
            </p>
            <ReviewRating />
          </div>
        </div>

        <div
          data-visit-map
          className="lit relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#F2EBDB] desk:aspect-[5/4.3]"
        >
          <MapPanel />
        </div>
      </div>
    </section>
  );
}
