"use client";

import Link from "next/link";
import { ArrowUpRight, BadgePercent } from "lucide-react";

import type { ShowcaseCategorySummary } from "@/src/features/treatments/api/showcase.types";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";
import { CategoryIcon } from "@/src/features/treatments/components/category-icon";
import { countLabel, durationLabel, priceFromLabel } from "@/src/features/treatments/lib/showcase-format";
import { categoryHref } from "@/src/features/treatments/lib/showcase-routes";

export function CategoryIndexRow({
  category,
  featured = false,
}: {
  category: ShowcaseCategorySummary;
  featured?: boolean;
}) {
  const glowRef = useSurfaceGlow<HTMLAnchorElement>();
  const meta = [
    countLabel(category.treatmentCount, "servicio", "servicios"),
    durationLabel(category.durationMinMinutes, category.durationMaxMinutes),
    priceFromLabel(category.priceFromThousands),
  ].filter(Boolean);

  return (
    <Link
      ref={glowRef}
      href={categoryHref(category.slug)}
      className={`group/row glow lit lit-hover relative grid cursor-pointer grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 overflow-hidden rounded-[2rem] bg-[#FDF8F1] p-6 [--lift:12px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BF9250] sm:gap-x-8 sm:p-8 desk:grid-cols-[auto_1fr_auto] ${
        featured ? "desk:py-12" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-[#062112] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100 group-focus-visible/row:scale-x-100 motion-reduce:transition-none"
      />
      <span
        className={`relative grid shrink-0 place-items-center rounded-full bg-[#E0BC87]/40 text-[#062112] transition-colors duration-500 group-hover/row:bg-[#E0BC87] ${
          featured ? "size-16 sm:size-24" : "size-14 sm:size-20"
        }`}
      >
        <CategoryIcon iconKey={category.iconKey} className={featured ? "size-7 sm:size-10" : "size-6 sm:size-8"} />
      </span>

      <span className="relative flex min-w-0 flex-col gap-2">
        <span className="flex flex-wrap items-center gap-3">
          <span
            className={`font-heading leading-[1.02] tracking-[-0.01em] text-[#062112] transition-colors duration-500 group-hover/row:text-[#F2EBDB] ${
              featured ? "text-[clamp(2.5rem,6vw,5rem)]" : "text-[clamp(2rem,4.4vw,3.5rem)]"
            }`}
          >
            {category.name}
          </span>
          {category.hasPromotion && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#062112] px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0BC87] transition-colors duration-500 group-hover/row:bg-[#E0BC87] group-hover/row:text-[#062112]">
              <BadgePercent className="size-3.5" aria-hidden="true" />
              Promoción
            </span>
          )}
        </span>
        {category.tagline && (
          <span className="max-w-[60ch] font-sans text-base leading-relaxed text-pretty text-[#062112]/70 transition-colors duration-500 group-hover/row:text-[#F2EBDB]/75 sm:text-lg">
            {category.tagline}
          </span>
        )}
      </span>

      <span className="relative col-span-2 flex flex-wrap items-center justify-between gap-4 desk:col-span-1 desk:flex-col desk:items-end">
        <span className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm font-bold tabular-nums text-[#7a5a2c] transition-colors duration-500 group-hover/row:text-[#E0BC87] desk:justify-end">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
        <span className="inline-flex items-center gap-3 font-sans text-sm font-bold text-[#062112] transition-colors duration-500 group-hover/row:text-[#F2EBDB]">
          Ver tratamientos
          <span className="grid size-10 place-items-center rounded-full bg-[#062112]/5 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:bg-[#E0BC87] group-hover/row:text-[#062112]">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </span>
      </span>
    </Link>
  );
}
