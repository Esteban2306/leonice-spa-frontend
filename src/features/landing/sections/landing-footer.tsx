"use client";

import Image from "next/image";
import { ArrowUp } from "lucide-react";

import {
  formatWhatsappDisplay,
  OPENING_HOURS,
  SECTION_IDS,
  SPA_NAME,
  siteContact,
} from "@/src/features/landing/lib/site-config";
import { scrollToSection } from "@/src/features/landing/motion/scroll-to-section";
import { PRODUCTS_PAGE, TREATMENTS_PAGE } from "@/src/features/landing/lib/catalog-links";

import LogoW from "../../../../public/leonice-logo-w.png";

const LINKS: { label: string; target: string; page?: string }[] = [
  { label: "Inicio", target: SECTION_IDS.home },
  { label: "Por qué Leonice", target: SECTION_IDS.why },
  { label: "Tratamientos", target: SECTION_IDS.treatments, page: TREATMENTS_PAGE },
  { label: "Historias", target: SECTION_IDS.stories },
  { label: "Productos", target: SECTION_IDS.products, page: PRODUCTS_PAGE },
  { label: "Contacto", target: SECTION_IDS.contact },
];

export function LandingFooter() {
  const whatsapp = formatWhatsappDisplay();
  return (
    <footer className="relative bg-[#062112] text-[#F2EBDB]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 desk:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Image src={LogoW} alt={SPA_NAME} className="h-auto w-36" />
          <p className="max-w-[34ch] font-sans text-sm leading-relaxed text-[#F2EBDB]/70">
            Cuidado capilar con criterio clínico y alma de spa.
          </p>
        </div>

        <nav aria-label="Pie de página" className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#E0BC87]">Explora</h2>
          <ul className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <li key={link.target}>
                <a
                  href={link.page ?? `/#${link.target}`}
                  onClick={(event) => {
                    if (link.page) return;
                    event.preventDefault();
                    scrollToSection(link.target);
                  }}
                  className="font-sans text-sm text-[#F2EBDB]/80 transition-colors hover:text-[#F2EBDB]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#E0BC87]">Horario</h2>
          <ul className="flex flex-col gap-2 font-sans text-sm text-[#F2EBDB]/80 tabular-nums">
            {OPENING_HOURS.map((slot) => (
              <li key={slot.days}>
                {slot.days} · {slot.hours}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#E0BC87]">Contacto</h2>
          <ul className="flex flex-col gap-2 font-sans text-sm text-[#F2EBDB]/80">
            <li>{whatsapp ? `WhatsApp ${whatsapp}` : "WhatsApp: próximamente"}</li>
            <li>{siteContact.address ?? "Dirección: próximamente"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#F2EBDB]/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <p className="font-sans text-xs text-[#F2EBDB]/60">
            © {new Date().getFullYear()} {SPA_NAME}
          </p>
          <button
            type="button"
            onClick={() => scrollToSection(SECTION_IDS.home)}
            className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#F2EBDB]/25 px-4 font-sans text-xs font-bold text-[#F2EBDB] transition-colors hover:border-[#F2EBDB]/60"
          >
            Volver arriba
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
